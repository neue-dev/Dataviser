/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-01 02:41:45
 * @ Modified time: 2024-07-01 03:04:48
 * @ Description:
 * 
 * This file reads all the python scripts and forwards them to the renderer process.
 */

const fs = require('node:fs');

export const Python = (function() {
  
  const _ = {};
  const _cache = {};  // Where the actual file contents are stored until we send them to the IPC
  const _scripts = {
    df: './src/scripts/df.py'
  };

  /**
   * Reads the file for a particular script.
   * 
   * @param   { string }  filepath  The path to the script.
   * @return  { string }            The text content of the script.
   */
  _scriptLoad = function(filepath) {
    return fs.readFileSync(filepath, { encoding: 'utf-8' });
  }

  /**
   * Loads all the Python scripts into memory.
   * Forwards them to the renderer process.
   */
  _scriptLoadAll = function() {

    // Script keys
    const scriptNames = Object.keys(_scripts);

    // For each script
    scriptNames.forEach(scriptName => {
      
      // Grab the code content of the script
      _cache[scriptName] = _scriptLoad(_scripts[scriptName]);
    });
  }

  /**
   * I keep this here just so I don't forget to import this script in the main process.
   */
  _.init = function() {
    
  }

  /**
   * Sends the loaded scripts to the renderer process.
   */
  ipcMain.handle('py/request-scripts', (e, ...args) => {
    
    // Load all the scripts first
    _scriptLoadAll();

    // Send back the script contents
    return _cache;
  })

  return {
    ..._,
  }
})();

export default {
  Python,
}