
// We import the module from a cdn
if(typeof importScripts == 'function') {
  importScripts('https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js')

  /**
   * This function configures pyodide and the packages we need.
   */
  async function configPyodide() {
    
    // Define pyodide
    self.pyodide = await loadPyodide();

    // Load the packages we need
    await self.pyodide.loadPackage([ 'numpy' ]);
  }

  const configPyodidePromise = configPyodide();

  /**
   * This is the event handler for messages received from the main thread.
   * 
   * @param   { event }   e   The event object. 
   */
  self.onmessage = async (e) => {
    
    await configPyodidePromise;

    const { id, python, ...context } = e.data;

    for (const key of Object.keys(context)) {
      self[key] = context[key];
    }

    // Now is the easy part, the one that is similar to working in the main thread:
    try {
      await self.pyodide.loadPackagesFromImports(python);
      let results = await self.pyodide.runPythonAsync(python);
      self.postMessage({ results, id });
    } catch (error) {
      self.postMessage({ error: error.message, id });
    }
  }
}