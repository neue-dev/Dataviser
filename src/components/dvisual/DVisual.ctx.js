/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-03 03:49:19
 * @ Modified time: 2024-07-15 08:35:22
 * @ Description:
 * 
 * This stores the state of a given chart or visualization.
 */

import { ClientDict } from '../../client/client.dict'
import { UtilsContext } from '../utils/utils.context'

export const DVisualCtx = UtilsContext({
  
  // When we mute a vis, we prevent it from consuming resources by not rendering it live
  isMuted: false,
  
  // The actual data the vis is rendering
  data: [],
  
  // Stores the active filters
  filters: {},
});

export const DVisualManager = (function() {

  const _ = {};

  /**
   * Initializes the state of the visual.
   * Does not perform a rerender.
   * 
   * @param   { State }   state     The dvisual state.
   * @param   { object }  options   The options for the initial dvisual state.
   */
  _.init = function(state, options) {
    state._ = { ...state._, ...options };
  }

  /**
   * Creates a new filter and updates the state to register it.
   * 
   * @param   { State }   state     The state of the filter state manager.
   * @param   { object }  options   The options for the filter. 
   */
  _.filterCreate = function(state, options={}) {

    // Gather the details of the filter to register
    const name = options.name ?? null;
    const dataCallback = options.dataCallback ?? (() => []);
    const filterCallback = options.filterCallback ?? (() => true);

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
    const dataCallback = options.dataCallback ?? (() => []);
    const filterCallback = options.filterCallback ?? (() => true);
    
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
    const args = options.args ?? {};
    
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
    const wrappedFilter = (d) => filterCallback(d, args);
    
    // For each type, perform a different filter method
    switch(type) {
      case 'keys':
      case 'key':
      case 'k':
        return ClientDict.filterKeys(dataCallback(), wrappedFilter);

      case 'values':
      case 'value':
      case 'vals':
      case 'val':
      case 'v':
        return ClientDict.filterValues(dataCallback(), wrappedFilter);

      case 'array':
      case 'arr':
      case 'a':
      default:
        return dataCallback().filter(wrappedFilter);
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
  DVisualCtx,
  DVisualManager,
}