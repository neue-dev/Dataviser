/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-03 06:59:05
 * @ Modified time: 2024-07-09 13:09:36
 * @ Description:
 * 
 * This allows us to create a construct for contexts without repeating code.
 * Our construct abstracts a bunch of the usual stuff we do to create and deal with contexts.
 */

import { createContext } from "react";
import { useContext } from "react";
import { useState } from "react";

/**
 * This function creates a new context manager.
 * The provided initial state is the initial state used.
 * 
 * @param   { State }   initial   The initial state used by the context.
 */
export const UtilsContext = function(initial) {

  // The IIFE just encapsulates everything in its own scope
  return (function() {
  
    const _= {};
    const _initial = { _: initial };            // The intial value of the context
    const _context = createContext(_initial);   // The context object

    /**
     * Retrieves the dataviser context object.
     * 
     * @return  { Context }   The context object.
     */
    _.getCtx = function() {
      return _context;
    }
  
    /**
     * Creates a new state for the context. 
     * 
     * @return  { State }   A dataviser context state object.
     */
    _.newCtx = function() {
  
      // Create the state
      const [ state, setState ] = useState(structuredClone(_initial));
  
      // A function for setting the state
      const set = (newState) => setState({ _: { ...state._, ...newState }});
      const get = (key) => state._[key];

      // If the state doesn't have the setter yet
      if(!state.set) state.set = set;
      if(!state.get) state.get = get;
      
      // Return the state
      return state;
    }
  
    /**
     * Uses the given context.
     * 
     * @return  { Consumer }  A consumer of the dataviser context. 
     */
    _.useCtx = function() {
      return useContext(_context);
    }
  
    return {
      ..._,
    }
  })();  
}

export default {
  UtilsContext,
}