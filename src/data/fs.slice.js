/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-29 23:17:37
 * @ Modified time: 2024-06-29 23:30:39
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
    fsCreate: (state, action) => {

      // Parse the action details
      const id = action?.payload?.id ?? null;
      const data = action?.payload?.data ?? null;
      const filename = action?.payload?.filename ?? null;

      // If any of the parameters were missing
      if(id == null || data == null || filename == null)
        return state;

      // Otherwise, save the entry to the state
      state.filenames[id] = filename;
      state.filedata[id] = data;
    },

    /**
     * Removes a file and its data from our store.
     * 
     * @param { state }   state   The value of the current state. 
     * @param { action }  action  The details of the action.
     */
    fsRemove: (state, action) => {

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
    fsSetStateLoading: (state, action) => {
      state.state = 'loading';
    },

    /**
     * Sets the load state of the current slice to loaded.
     * 
     * @param { state }   state   The value of the current state. 
     * @param { action }  action  The details of the action.
     */
    fsSetStateLoaded: (state, action) => {
      state.state = 'loaded';
    }
  }
});

export const fsReducer = fsSlice.reducer;

export default {
  fsSlice,
  fsReducer,
}