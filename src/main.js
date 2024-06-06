/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-05 09:11:39
 * @ Modified time: 2024-06-06 16:36:50
 * @ Description:
 * 
 * This file contains the main process of the app.
 */

// Modules
const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const fs = require('node:fs');

// Main subprocesses
const { IPC } = require('./main/main.ipc');

const MAIN = (function() {

  const _ = {};

  // Handle creating/removing shortcuts on Windows when installing/uninstalling.
  if (require('electron-squirrel-startup'))
    app.quit();

  /**
   * Creates a new window.
   */
  _.createWindow = function() {
    
    // Create the browser window.
    const mainWindow = new BrowserWindow({

      // Kiosk mode basically
      frame: false,

      // Some other settings
      webPreferences: {
        contextIsolation: true,
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
    });

    // Load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    mainWindow.maximize();

    // Setup the IPC
    IPC.setup(mainWindow);
  };

  /**
   * Gets called when Electron has finished initializing.
   * Creates a new browser window after the init.
   */
  app.whenReady().then(() => {
    
    // Create the window
    _.createWindow();

    // This is OSX behavior.
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0)
        _.createWindow();
    });
  });

  /**
   * When all windows are closed and this isn't OSX, then quit the app.
   * Again, OSX default behavior can have the app still running even when all windows are closed.
   */
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
      app.quit();
  });

  return {
    ..._,
  }
})();