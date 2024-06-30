/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-06 16:30:31
 * @ Modified time: 2024-07-01 02:43:01
 * @ Description:
 * 
 * This module has some file system handling utilities.
 */

// Modules
const fs = require('node:fs');
const { dialog } = require('electron'); 

/**
 * The file system object provides us with utilities to manage files opened by the user.
 * It stores their contents here too, and manages some of their states.
 */
export const FS = (function() {

  // The main window used by the FS object
  let _mainWindow = null;

  const _ = {};

  /**
   * Initializes the fs object.
   * 
   * @param   { Window }  mainWindow  The main window to use.
   */
  _.init = function(mainWindow) {
    _mainWindow = mainWindow;
  }

  /**
   * Creates a file picker with the given options.
   * 
   * @return  { function }  A function that opens a sync file picker dialog.
   */
  _.fileCreatePicker = function() {
    return function(e) {

      // Get the result of the open file dialog
      const filepaths = dialog.showOpenDialogSync(_mainWindow, {
        properties: [ 'openFile', 'multiSelections' ]
      });

      return filepaths;
    }
  }

  /**
   * Creates a directory picker with the given options.
   * 
   * @return  { function }  A function that opens a sync file picker dialog.
   */
  _.directoryCreatePicker = function() {
    return function(e) {

      // Get the result of the open file dialog
      const dirpaths = dialog.showOpenDialogSync(_mainWindow, {
        properties: [ 'openDirectory', 'multiSelections' ]
      });

      // Save the filepaths here
      const filepaths = [];
      
      // Grab all the files in the directory
      dirpaths.forEach(dirpath => 
        fs.readdirSync(dirpath).forEach(filepath =>
          filepaths.push(`${dirpath}\\${filepath}`)));
          
      // Return the filepaths
      return filepaths;
    }
  }

  /**
   * Creates a file reader for the given filepath.
   * 
   * @returns   { function }            A file reader that reads a given file when called.
   */
  _.fileCreateReader = function() {
    return function(e, filepaths, options={}) {

      // Append the file contents and stuff here
      const result = [];

      // Read the data
      filepaths.forEach(filepath => {

        // The file contents
        const data = fs.readFileSync(filepath, options);
        const extension = filepath.split('.').slice(-1)[0];

        // Append the result
        result.push({ filepath, data, extension })
      })

      // Return the data
      return result;
    }
  }

  return {
    ..._,
  }

})();
