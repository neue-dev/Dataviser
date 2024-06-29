/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-29 23:17:37
 * @ Modified time: 2024-06-30 01:41:56
 * @ Description:
 * 
 * Stores the raw file data we gather from the files we add.
 */

// Redux
import { createSlice } from "@reduxjs/toolkit";

// Our filesystem slice; manages file-related data
export const fsSlice = createSlice({
  
  // The name of the slice
  name: 'fs',

  initialState: {

    // The loading state of the fs slice
    state: 'idle',

    // All the filenames we've opened, INDEXED BY ID
    filenames: {},

    // All the data of each of our files, INDEXED BY ID
    filedata: {},
  },

  reducers: {
    
    /**
     * Creates a new file entry and saves its data to the store.
     * All files are indexed by their absolute filepaths.
     * 
     * @param { state }   state   The value of the current state. 
     * @param { action }  action  The details of the action.
     */
    fsFileCreate: (state, action) => {

      // Parse the action details
      const filepath = action?.payload?.filepath ?? null;

      // If the filepath was missing
      if(filepath == null)
        return state;

      // Otherwise, save the entry to the state
      state.filenames[filepath] = filepath.split('\\').slice(-1)[0];
      state.filedata[filepath] = '';
    },

    /**
     * Saves a file's data into the store.
     * A file can only be saved if its filepath has already been indexed.
     * In other words, fsFileCreate must first be called before fsFileSave.
     * 
     * @param { state }   state   The value of the current state. 
     * @param { action }  action  The details of the action.
     */
    fsFileLoad: (state, action) => {
      
      // Parse the action details
      const filepath = action?.payload?.filepath ?? null;
      const data = action?.payload?.data ?? null;

      // If any of the parameters were missing
      if(filepath == null || data == null)
        return state;

      if(!state.filenames[filepath])
        return state;

      // Otherwise, save the data for that file
      state.filedata[filepath] = data;
    },

    /**
     * Removes a file and its data from our store.
     * 
     * @param { state }   state   The value of the current state. 
     * @param { action }  action  The details of the action.
     */
    fsFileRemove: (state, action) => {

      // Parse the action details
      const filepath = action?.payload.filepath ?? null;

      // Missing filepath
      if(filepath == null)
        return state;
      
      // Filepath doesn't exist
      if(!state.filenames[filepaths] && !state.filedata[filepaths])
        return state;

      // Delete entries
      if(state.filenames[filepath]) delete state.filenames[filepath];
      if(state.filedata[filepath]) delete state.filedata[filepath];
    },

    /**
     * Sets the load state of the current slice to loading.
     * 
     * @param { state }   state   The value of the current state. 
     * @param { action }  action  The details of the action.
     */
    fsStateSetLoading: (state, action) => {
      state.state = 'loading';
    },

    /**
     * Sets the load state of the current slice to loaded.
     * 
     * @param { state }   state   The value of the current state. 
     * @param { action }  action  The details of the action.
     */
    fsStateSetLoaded: (state, action) => {
      state.state = 'loaded';
    }
  }
});

export const fsReducer = fsSlice.reducer;

export default {
  fsSlice,
  fsReducer,
}