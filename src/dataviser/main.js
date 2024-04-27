


/**
 * Our own API for interacting with the Pyodide worker.
 * This is adapated from an implementation I found online.
 * Note that I wrapped it around its own IIFE to enclose its data.
*/
export const PyodideAPI = (function() {
  
  // Create the worker from its URL
  const pyodideWorkerURL = new URL('./Pyodide.js', import.meta.url);
  const pyodideWorker = new Worker(pyodideWorkerURL);
  const _ = {
    workerURL: pyodideWorkerURL,
    worker: pyodideWorker,
    processes: {},
    processId: 0,
  };

  /**
   * This primarily responds to the messages sent by the worker after executing a script.
   * 
   * @param   { event }   e   The event object. 
   */
  pyodideWorker.onmessage = e => {
    
    // Retrieve the data sent by the worker and the resolving callback
    const { id } = e.data;
    const { onResolve, onReject } = _.processes[id];
    
    // The process id done, so remove it
    delete _.processes[id];

    // Resolve or reject the promise
    if(e.error) return onReject(e.error);
    if(e.data) return onResolve(e.data);
  };

  /**
   * We create a method for dispatching processes to the worker.
   * These processes run Python scripts for us. 
   * 
   * @param   { string }    script    The Python script to run in the process.
   * @param   { object }    context   The variables and data we want to pass to the script.
   * @return  { Promise }             A promise for a complete execution of the script.
   */
  _.dispatchProcess = (script, context) => {

    // Increment the id each time
    const id = _.processId += _.processId + 1;
    
    // Return a promise for the resolution of the process
    return new Promise((resolve, reject) => {
      
      // The function to call when the process finishes
      // Basically, we resolve the promise we return so the caller can now it's done
      _.processes[id] = {
        onResolve: resolve,
        onReject: reject,
      };
      
      // We send a message to the worker to tell it to run the script.
      pyodideWorker.postMessage({
        ...context,
        python: script,
        id,
      });
    });
  }
  
  const script = `
    import pandas
    from js import A_rank

    data = {
      "calories": [420, 380, 390],
      "duration": [50, 40, 45]
    }
    
    df = pandas.DataFrame(data)
    df.to_json(orient='records')
  `;
  
  const context = {
    A_rank: [0.8, 0.4, 1.2, 3.7, 2.6, 5.8],
  };
  
  async function main() {
    try {
      const { results, error } = await _.dispatchProcess(script, context);

      if (results)
        console.log("pyodideWorker return results: ", results);
      else if (error)
        console.log("pyodideWorker error: ", error)
 
    } catch (e) {
      console.log(`Error in pyodideWorker at ${e.filename}, Line: ${e.lineno}, ${e.message}`);
    }
  }
  
  main();

  return {
    ..._,
  }
})();