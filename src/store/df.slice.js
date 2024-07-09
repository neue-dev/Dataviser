/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-28 21:12:24
 * @ Modified time: 2024-07-10 02:35:52
 * @ Description:
 * 
 * This portion of redux manages our dataframe data.
 */

// Redux
import { createSlice } from "@reduxjs/toolkit";

// Our dataframe slice
export const dfSlice = createSlice({
  
  // Name of the slice
  name: 'df',

  // Initial state
  initialState: {

    // The loading state of the df slice
    state: 'idle',

    // Store all our dataframe data, indexed by unique id
    dfs: {},

    // Timestamps for the last updates
    timestamps: {},

    // The metadata of each of the dfs
    meta: {},
  },

  // Reducers
  reducers: {
    
    /**
     * Adds a dataframe to the slice.
     * Uses the provided id to identify the dataframe.
     * 
     * @param { state }   state   The value of the current state. 
     * @param { action }  action  The details of the action.
     */
    dfCreate: (state, action) => {

      // Get the action details
      const id = action?.payload?.id ?? null;
      const group = action?.payload?.group ?? '_';
      const data = action?.payload?.data ?? null;

      // We don't generate ids within this method
      // They must be provided, otherwise nothing happens
      // Also, we can't save nullish data
      if(id == null || data == null)
        return state;

      // The group hasn't been created yet
      if(!state.dfs[group])
        state.dfs[group] = {};

      // Save the data to the group it belongs to
      state.dfs[group][id] = data;
    },

    /**
     * Remove a dataframe from the slice.
     * Uses the id of the dataframe to identify it.
     * 
     * @param { state }   state   The value of the current state. 
     * @param { action }  action  The details of the action.
     */
    dfRemove: (state, action) => {
      
      // Parse the action details
      const id = action?.payload?.id ?? null;
      const group = action?.payload?.group ?? null;

      // Missing id or group
      if(id == null || group == null)
        return state;
      
      // Invalid group
      if(!state.dfs[group])
        return state;

      // Invalid id
      if(!state.dfs[group][id])
        return state;

      // Delete entry and update timestamp
      delete state.dfs[group][id];
    },

    /**
     * Registers the metadata for a given dataframe.
     * 
     * @param { state }   state   The value of the current state. 
     * @param { action }  action  The details of the action.
     */
    dfMetaCreate: (state, action) => {

      // Grab the action details
      const id = action?.payload?.id ?? null;
      const meta = action?.payload?.meta ?? null;
      const cols = action?.payload?.cols ?? [];
      const rows = action?.payload?.rows ?? [];

      // Id was not provided
      if(id == null)
        return state;

      // The metadata was not provided
      if(meta == null)
        return state;

      // Save the metadata
      state.meta[id] = { ...meta, rows, cols };
    },

    /**
     * Deletes the metadata for a particular dataframe.
     * 
     * @param { state }   state   The value of the current state. 
     * @param { action }  action  The details of the action.
     */
    dfMetaRemove: (state, action) => {
      
      // Grab the action details
      const id = action?.payload?.id ?? null;
      const meta = action?.payload?.meta ?? null;

      // Id was not provided
      if(id == null)
        return state;

      // The metadata does not exist
      if(!state.meta[id])
        return state;
      
      // Delete the metadata
      delete state.meta[id];
    },

    /**
     * Updates the timestamp for the given group.
     * We should only do this after all dfs have been updated for that group.
     * 
     * @param { state }   state   The value of the current state. 
     * @param { action }  action  The details of the action.
     */
    dfTimestampUpdate: (state, action) => {

      // Get the group
      const group = action?.payload?.group ?? null;

      // I know this is bad but eh
      const timestamp = Date.now();

      // Missing id or group
      if(group == null)
        return state;

      // Update the timestamp
      state.timestamps[group] = timestamp;
    },

    /**
     * Sets the state of the slice to 'loading'.
     * 
     * @param { state }   state   The value of the current state. 
     * @param { action }  action  The details of the action.
     */
    dfSetStateLoading: (state, action) => {
      state.state = 'loading';
    },

    /**
     * Sets the state of the slice to 'loaded'.
     * 
     * @param { state }   state   The value of the current state. 
     * @param { action }  action  The details of the action.
     */
    dfSetStateLoaded: (state, action) => {
      state.state = 'loaded';
    }
  }
})

export const dfReducer = dfSlice.reducer;

export default {
  dfSlice,
  dfReducer
}