/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-10 09:06:58
 * @ Modified time: 2024-07-13 11:23:56
 * @ Description:
 * 
 * The filter state variables.
 */

import { ClientDict } from '../../client/client.dict'
import { UtilsContext } from "../utils/utils.context";

export const DVisualFilterCtx = UtilsContext({
  
  // Stores the active filters
  filters: {},
});

export const DVisualFilterManager = (function() {
  
  const _ = {};

  /**
   * Creates a new filter and updates the state to register it.
   * 
   * @param   { State }   state     The state of the filter state manager.
   * @param   { object }  options   The options for the filter. 
   */
  _.filterCreate = function(state, options={}) {

    // Gather the details of the filter to register
    const name = options.name ?? null;
    const dataCallback = options.dataCallback ?? (() => { return {} });
    const filterCallback = options.filterCallback ?? (() => { return true });

    // Name is required
    if(!name)
      return 

    // The filters we currently have
    const filters = state.get('filters');

    // Add the filters
    filters[name] = { dataCallback, filterCallback, };

    // Update the state
    state.set({ filters });
  }

  /**
   * Updates the configuration of one of the filters.
   * 
   * @param   { State }   state     The state of the filter state manager.
   * @param   { object }  options   The options for the filter. 
   */
  _.filterUpdate = function(state, options={}) {

    // Gather the details of the filter to register
    const name = options.name ?? null;
    const dataCallback = options.dataCallback ?? (() => { return {} });
    const filterCallback = options.filterCallback ?? (() => { return true });
    
    // Name is required
    if(!name)
      return;

    // The filters we currently have
    const filters = state.get('filters');

    // Name not found
    if(!filters[name])
      return;

    // Add the filters
    filters[name] = { ...filters[name], dataCallback, filterCallback };

    // Update the state
    state.set({ filters });
  } 

  /**
   * 
   * @param   { State }   state     The state of the filter state manager.
   * @param   { object }  options   The options for the filter. 
   * @return  { object }            The filtered dict or array.
   */
  _.filterExecute = function(state, options={}) {

    // Gather the details of the filter to register
    const name = options.name ?? null;
    const type = options.type ?? 'array';
    
    // Name is required
    if(!name)
      return;

    // The filters we currently have
    const filters = state.get('filters');

    // Name not found
    if(!filters[name])
      return;

    // Grab the callbacks of that filter
    const dataCallback = filters[name].dataCallback;
    const filterCallback = filters[name].filterCallback;
    
    // For each type, perform a different filter method
    switch(type) {
      case 'array':
      case 'arr':
      case 'a':
        return dataCallback().filter(filterCallback);

      case 'keys':
      case 'key':
      case 'k':
        return ClientDict.filterKeys(dataCallback(), filterCallback);

      case 'values':
      case 'value':
      case 'vals':
      case 'val':
      case 'v':
        return ClientDict.filterValues(dataCallback(), filterCallback);
    }
  }

  /**
   * Removes the filter from the state.
   * 
   * @param   { State }   state     The state of the filter state manager.
   * @param   { object }  options   The options for the filter. 
   */
  _.filterRemove = function(state, options={}) {

    // Gather the details of the filter to register
    const name = options.name ?? null;
    
    // Name is required
    if(!name)
      return;

    // The filters we currently have
    const filters = state.get('filters');

    // Name not found
    if(!filters[name])
      return;

    // Remove the filter and update the state
    delete filters[name];
    state.set({ filters })
  }

  return {
    ..._,
  }
})();

export default {
  DVisualFilterCtx,
  DVisualFilterManager,
}