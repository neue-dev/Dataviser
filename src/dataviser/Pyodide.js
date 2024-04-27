/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-27 09:03:51
 * @ Modified time: 2024-04-27 12:01:11
 * @ Description:
 * 
 * The script defines the structure of the worker responsible for executing Python scripts.
 * The Python scripts are handled by Pyodide, which is a neat API built on top of Web Assembly.
 * That just means it's basically as fast as running natively.
 */

if(typeof importScripts == 'function') {
  
  // We import the module from a cdn
  importScripts('https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js')

  // Tells us whether or not Pyodide is done configuring
  const configPyodidePromise = configPyodide();

  /**
   * This function configures pyodide and the packages we need.
   */
  async function configPyodide() {
    
    // Define pyodide
    self.pyodide = await loadPyodide();

    // Load the packages we need
    await self.pyodide.loadPackage([ 
      // Currently none since we load imports by default,
      // but we can put smth like 'pandas' here
    ]);
  }

  /**
   * This is the event handler for messages received from the main thread.
   * It's called whenever we dispatch a Python process (script) for execution.
   * 
   * @param   { event }   e   The event object. 
   */
  self.onmessage = async (e) => {
    
    // Wait for config if it's not done
    await configPyodidePromise;

    // Retrieve the data and the script code
    const { id, python, ...context } = e.data;

    // For each piece of data we want the script to have access
    // we copy it unto the worker
    for (const key of Object.keys(context))
      self[key] = context[key];

    // We actually try to run the script
    try {

      // Load packages and libraries based on the script imports
      await self.pyodide.loadPackagesFromImports(python);

      // Save the results of the script and send to the main thread
      const results = await self.pyodide.runPythonAsync(python);
      self.postMessage({ results, id });

    // Something happened
    } catch (error) {
      self.postMessage({ error: error.message, id });
    }
  }
}