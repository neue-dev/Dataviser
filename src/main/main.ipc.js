/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-06 16:07:28
 * @ Modified time: 2024-06-06 16:30:24
 * @ Description:
 * 
 * This file contains the IPC handlers for the main process.
 */

const { dialog, ipcMain } = require('electron'); 

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
    const filePaths = result.filePaths;

    
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
