/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-06 16:07:28
 * @ Modified time: 2024-06-06 16:55:11
 * @ Description:
 * 
 * This file contains the IPC handlers for the main process.
 */

// Modules
const { dialog, ipcMain } = require('electron'); 

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
   * The result of this process is saved in memory.
   */
  ipcMain.handle('fs:select-directory', async(e, ...args) => {
    
    // Wait for IPC to be initted before handling anything
    if(!_.isInitted)
      return;

    // Prompt to select a directory
    const result = await dialog.showOpenDialog(
      _.mainWindow, { properties: [ 'openDirectory' ] }
    );

    // Get the array of selected filepaths
    const filepaths = result.filePaths;

    console.log(result);

    // ! move this into another message sent by the client, don't couple FS and IPC together
    // Load the file contents into memory
    // filepaths.forEach(filepath => FS.load(filepath));
  });

  /**
   * Listens for when the user decides to open a file.
   * The file picking is done within the main process.
   * The result of this process is saved in memory.
   */
  ipcMain.handle('fs:select-file', async(e, ...args) => {
    
    // Wait for IPC to be initted before handling anything
    if(!_.isInitted)
      return;

    // Prompt to select a directory
    const result = await dialog.showOpenDialog(
      _.mainWindow, { properties: [ 'openFile' ] }
    );

    // Get the array of selected filepaths
    const filePaths = result.filePaths;
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
