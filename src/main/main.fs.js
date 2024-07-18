/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-06 16:30:31
 * @ Modified time: 2024-07-18 20:25:44
 * @ Description:
 * 
 * This module has some file system handling utilities.
 */

// Modules
const fs = require('node:fs');
const path = require('path');
const { dialog } = require('electron'); 

// Utils
import { Utils } from './main.utils'

/**
 * The file system object provides us with utilities to manage files opened by the user.
 * It stores their contents here too, and manages some of their states.
 */
export const FS = (function() {

  // The main window used by the FS object
  let _mainWindow = null;

  const _ = {};

  /**
   * Just a small helper function.
   * 
   * @param   { string }  filepath  The filepath to parse.
   * @return  { string }            The filename. 
   */
  const _getFilename = function(filepath) {
    return filepath.split('\\').slice(-1)[0].split('/').slice(-1)[0];
  }

  /**
   * Another small helper function.
   * 
   * @param   { string }  dirpath   The directory path of the file. 
   * @param   { string }  filename  The name of the file.
   * @return  { string }            The complete filepath of the file.
   */
  const _getFilepath = function(dirpath, filename) {
    return `${dirpath}\\${filename}`;
  }

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

      // If the user cancelled the action
      if(!filepaths)
        return [];

      // The actual data to send back
      // Contains filepaths and filenames
      const result = filepaths.map(filepath => {
        return { filepath, filename: _getFilename(filepath) }
      })

      return result;
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

      // The user cancelled the picking
      if(!dirpaths)
        return [];
      
      // Save the filepaths here
      const result = [];
      
      // Grab all the files in the directory
      dirpaths.forEach(dirpath => 
        fs.readdirSync(dirpath).forEach(filename =>
          result.push({
            filepath: _getFilepath(dirpath, filename),
            filename: filename,
          })));
          
      // Return the filepaths
      return result;
    }
  }

  /**
   * Creates a file reader for the given filepath.
   * Note that the filename includes the extension.
   * 
   * @returns   { function }            A file reader that reads a given file when called.
   */
  _.fileCreateReader = function() {
    return function(e, filepaths, options={}) {

      // Parses metadata of the file
      const metaParser = options.metaParser ? 
        Utils.deserializeFunction(options.metaParser) : (d => {{}});

      // Append the file contents and stuff here
      const result = [];

      // Read the data
      filepaths.forEach(filepath => {

        // The file contents
        const data = fs.readFileSync(filepath, options);
        const filename = filepath.split('/').slice(-1)[0].split('\\').slice(-1)[0];
        const extension = filepath.split('.').slice(-1)[0];
        const metadata = metaParser(filename);

        // Append the result
        result.push({ filepath, filename, metadata, data, extension })
      })

      // Return the data
      return result;
    }
  }

  /**
   * Gets the resource path of our custom files, including pyscripts.
   * This function is needed because the filepaths are different during dev and production.
   * This is the case because packaging our app requires us to put any extra files in ./resources.
   * 
   * @param   { string }  filepath  A file we wish to locate in the resources folder.
   * @return  { string }            The parent path of our resources in the current environment.
   */
  _.getResourcePath = function(filepath=null) {

    // Get the folder for the resources
    const resourcesPath = 
      
      // If the current environment is undefined or
      !process.env.NODE_ENV || 
      
      // The current environment isn't dev
      process.env.NODE_ENV === "production"

        ? process.resourcesPath   // Get the production resource path 
        : 'src';                  // Otherwise, get the dev environment source code folder

    // Return the resource path
    if(!filepath)
      return resourcesPath;

    // Otherwise, return resource location
    return path.join(resourcesPath, filepath);
  }

  return {
    ..._,
  }

})();
