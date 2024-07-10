/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-10 09:06:58
 * @ Modified time: 2024-07-10 09:36:49
 * @ Description:
 * 
 * The filter state variables.
 */

import { UtilsContext } from "../utils/utils.context";

export const DVisualFilterCtx = UtilsContext({
  
  // Stores the active filters
  filters: {},
});

export const DVisualFilterManager = (function() {
  
  const _ = {};

  /**
   * Registers a given filter to the state.
   * 
   * @param   { State }   state     The dvisual filter manager state.
   * @param   { object }  options   The options for the new filter.
   */
  _.registerFilter = (state, options) => {
    
    // Grab the options
    const name = options.name ?? '';
    const data = options.data ?? {};
    const filters = { ...state.filters };

    // Add the new filter
    filters[name] = data;

    // Update the filters
    state.set({ filters });
  }

  /**
   * Updates the data associated with a given filter.
   * 
   * @param   { State }   state     The dvisual filter manager state.
   * @param   { object }  options   The options for the new filter.
   */
  _.updateFilter = (state, options) => {
    
    // Grab the options
    const name = options.name ?? '';
    const data = options.data ?? {};
    const filters = { ...state.filters };

    // The filter doesn't exist
    if(!filters[name])
      return;

    // Update the data of the selected filter
    const oldData = filters[name];

    // Add the new filter
    filters[name] = { ...oldData, ...data };

    // Update the filters
    state.set({ filters });
  }

  /**
   * Remove the specified filter from the state.
   * 
   * @param   { State }   state     The dvisual filter manager state.
   * @param   { object }  options   The options for the new filter.
   */
  _.removeFilter = (state, options) => {
    
    // Grab the options
    const name = options.name ?? '';
    const filters = state.filters;

    // Nothing to remove
    if(!filters[name])
      return;

    // Exclude the filter
    const newFilters = filters.filter(filterName => filterName != name);

    // Update the state
    state.set({ filters: newFilters })
  }

  return {
    ..._,
  }
})();

export default {
  DVisualFilterCtx,
  DVisualFilterManager,
}