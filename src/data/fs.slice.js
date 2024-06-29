/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-29 23:17:37
 * @ Modified time: 2024-06-30 00:35:41
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
     * 
     * @param { state }   state   The value of the current state. 
     * @param { action }  action  The details of the action.
     */
    fsFileCreate: (state, action) => {

      // Parse the action details
      const id = action?.payload?.id ?? null;
      const filename = action?.payload?.filename ?? null;

      // If any of the parameters were missing
      if(id == null || filename == null)
        return state;

      // Otherwise, save the entry to the state
      state.filenames[id] = filename;
    },

    /**
     * Saves a file's data into the store.
     * A file can only be saved if its filename has already been index.
     * In other words, fsFileCreate must first be called before fsFileSave.
     * 
     * @param { state }   state   The value of the current state. 
     * @param { action }  action  The details of the action.
     */
    fsFileLoad: (state, action) => {
      
      // Parse the action details
      const id = action?.payload?.id ?? null;
      const data = action?.payload?.data ?? null;

      // If any of the parameters were missing
      if(id == null || data == null)
        return state;

      // If the filename doesn't exist yet
      if(!state.filenames[id])
        return state;

      // Otherwise, save the data for that file
      state.filedata[id] = data;
    },

    /**
     * Removes a file and its data from our store.
     * 
     * @param { state }   state   The value of the current state. 
     * @param { action }  action  The details of the action.
     */
    fsFileRemove: (state, action) => {

      // Parse the action details
      const id = action?.payload.id ?? null;

      // Missing id
      if(id == null)
        return state;
      
      // Invalid id
      if(!state.filenames[id] && !state.filedata[id])
        return state;

      // Delete entries
      if(state.filenames[id]) delete state.filenames[id];
      if(state.filedata[id]) delete state.filedata[id];
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