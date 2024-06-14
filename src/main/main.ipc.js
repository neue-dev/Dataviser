/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-06 16:07:28
 * @ Modified time: 2024-06-14 21:11:37
 * @ Description:
 * 
 * This file contains the IPC handlers for the main process.
 */

// Modules
const { dialog, ipcMain, ipcRenderer } = require('electron'); 

// Main subprocesses
// ! remove this import, don't couple the two together
const { FS } = require('./main.fs');

/**
 * The IPC object helps us modularize all the functionality dealing with IPC.
 */
export const IPC = (function() {

  const _ = {};

  /**
   * The setup function.
   * Sets up the IPC with the given arguments.
   * 
   * @param   { Window }  mainWindow  The window object to use for the IPC. 
   */
  _.setup = function(mainWindow) {
    _.mainWindow = mainWindow;
    _.isInitted = true;
  }
  
  /**
   * Listens for when the user decides to open a folder.
   * The folder picking is done within the main process.
   */
  ipcMain.handle('fs:choose-directories', async(e, ...args) => {
    
    // Wait for IPC to be initted before handling anything
    if(!_.isInitted)
      return;

    // Prompt to select a directory
    const result = await dialog.showOpenDialog(
      _.mainWindow, { properties: [ 'openDirectory' ] }
    );

    // Get the array of selected filepaths
    const dirpaths = result.filePaths;

    // Return the output to the renderer
    return dirpaths;
  });

  /**
   * Listens for when the user decides to open a file.
   * The file picking is done within the main process.
   */
  ipcMain.handle('fs:choose-files', async(e, ...args) => {
    
    // Wait for IPC to be initted before handling anything
    if(!_.isInitted)
      return;

    // Prompt to select a directory
    const result = await dialog.showOpenDialog(
      _.mainWindow, { properties: [ 'openFile' ] }
    );

    // Get the array of selected filepaths
    const filepaths = result.filePaths;

    // Return the output to the renderer
    return filepaths;
  });

  /**
   * Listens for when the user decides to load a folder's contents into memory.
   * The result of this process is saved in memory.
   */
  ipcMain.handle('fs:load-directories', async(e, ...args) => {
  
    // Wait for IPC to be initted before handling anything
    if(!_.isInitted)
      return;

    // Get the args
    const dirpaths = args[0];
    const options = args[1];

    // Load the files in the directory to memory
    return FS.loadDirectories(dirpaths, options);
  });

  /**
   * Listens for when the user decides to load a bunch of file contents into memory.
   * The result of this process is saved in memory.
   */
  ipcMain.handle('fs:load-files', async(e, ...args) => {
  
    // Wait for IPC to be initted before handling anything
    if(!_.isInitted)
      return;

    // Get the args
    const filepaths = args[0];
    const options = args[1];

    // Load the files into memory
    return FS.loadFile(filepaths, options);
  });

  /**
   * Listens for when the user decides to request the data for loaded files.
   * The result of this process sent back to the client.
   */
  ipcMain.handle('fs:request-files', async(e, ...args) => {
  
    // Wait for IPC to be initted before handling anything
    if(!_.isInitted)
      return;

    // Get the args
    const ids = args[0];
    const options = args[1];

    // Load the files into memory
    return FS.requestFiles(ids, options);
  });

  /**
   * Fallback for erroneous invocations.
   */
  ipcMain.handle('-', (e, ...args) => {})

  return {
    ..._,
  }
})();

export default IPC;
