/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-27 09:03:51
 * @ Modified time: 2024-07-03 13:40:33
 * @ Description:
 * 
 * The script defines the structure of the worker responsible for executing Python scripts.
 * The Python scripts are handled by Pyodide, which is a neat API built on top of Web Assembly.
 * That just means it's basically as fast as running natively.
 */
  
// Only execute everything during the second invocation of the worker script
if('function' == typeof importScripts) {
  
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
      'pandas',
    ]);
  }

  // ! to implement
  function pythonGetContext() {
    
  }

  /**
   * Sets the context of a script (its data) through its globals.
   * 
   * @param   { object }  context   The data to be given the script.
   */
  function pythonSetContext(context) {

    // Parse the keys of the provided context
    let globals = Object.keys(context);
    let script = `import pyodide\n`;
    
    // Provide the context of the script through the globals
    for(let i = 0; i < globals.length; i++)
      self.pyodide.globals.set(globals[i], context[globals[i]]);

    // Create a script to convert globals into Python objects
    // By default the globals are JS proxy objects
    for(let i = 0; i < globals.length; i++) {
      let g = globals[i];
      script += `${g} = ${g}.to_py() if isinstance(${g}, pyodide.ffi.JsProxy) else ${g}\n`;
      script += `print('Successfully sent ${g}.')\n`;
    }

    // Run the script
    pythonRun(script, null);
  }

  /**
   * Runs a python script using Pyodide.
   * 
   * @param   { string }  script  A string contaning Python code.
   * @return  { object }          The results of the script.
   */
  async function pythonRun(script) {
    
    // Load packages and libraries based on the script imports
    await self.pyodide.loadPackagesFromImports(script);

    // Save the results of the script
    return self.pyodide.runPython(script);
  }

  /**
   * This is the event handler for messages received from the main thread.
   * It's called whenever we dispatch a Python process (script) for execution.
   * 
   * @param   { event }   e   The event object. 
   */
  self.onmessage = async function(e) {
    
    // Wait for config if it's not done
    await configPyodidePromise;

    // Retrieve the data and the script code
    const { id, action, script, context } = e.data;
    
    // What we're going to return
    let result = {};

    // We actually try to run the script
    try {

      switch(action) {
        case 'process-dispatch':
          result = await pythonRun(script);
          break;

        case 'context-set':
          pythonSetContext(context);
          break;
      }

      // Send to the results to the renderer thread
      self.postMessage({ result, id });

    // Something happened
    } catch (error) {
      self.postMessage({ error: error.message, id });
    }
  }
}