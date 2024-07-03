/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-28 21:12:24
 * @ Modified time: 2024-07-03 11:51:34
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
      const data = action?.payload?.data ?? null;
      const meta = action?.payload?.meta ?? {};

      // We don't generate ids within this method
      // They must be provided, otherwise nothing happens
      // Also, we can't save nullish data
      if(id == null || data == null)
        return state;

      // Save the data
      state.dfs[id] = data;
      state.meta[id] = meta;
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
      const id = action?.payload.id ?? null;

      // Missing id
      if(id == null)
        return state;
      
      // Invalid id
      if(!state.dfs[id])
        return state;

      // Delete entry
      delete state.dfs[id];
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