/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-01 16:59:51
 * @ Modified time: 2024-07-01 17:37:12
 * @ Description:
 * 
 * This slice stores the python scripts and stuff we'll be using for the app.
 */

import { createSlice } from "@reduxjs/toolkit";

export const pySlice = createSlice({
  
  name: 'py',

  initialState: {

    // Whether this slice is idle or not
    state: 'idle',

    // The scripts we have
    scripts: {},
  },

  reducers: {
    
    /**
     * Saves a script to the store.
     * 
     * @param { state }   state   The value of the current state. 
     * @param { action }  action  The details of the action.
     */
    fsScriptSave: (state, action) => {
      
      // Parse the action data
      const scripts = action?.payload?.scripts;

      // Nothing to save
      if(!scripts)
        return state;

      // Save each of the scripts
      const scriptNames = Object.keys(scripts);

      // Save each script
      scriptNames.forEach(scriptName => {
        state.scripts[scriptName] = scripts[scriptName];
      });
    }
  }
});

export const pyReducer = pySlice.reducer;

export default {
  pySlice,
  pyReducer,
}