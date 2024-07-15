/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-03 03:49:19
 * @ Modified time: 2024-07-15 11:44:34
 * @ Description:
 * 
 * This stores the state of a given chart or visualization.
 */

import { ClientDict } from '../../client/client.dict'
import { UtilsContext } from '../utils/utils.context'

export const DVisualCtx = UtilsContext({
  
  // When we mute a vis, we prevent it from consuming resources by not rendering it live
  isMuted: false,

  // The metadata associated with each of the data keys
  meta: {},
  
  // The actual data the vis is rendering
  data: [],
  
  // Stores the active filters
  filters: {},

  // Stuff to call after we perform filters
  filterCallbacks: {},
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
  _.config = function(state, options) {
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
    const type = options.type ?? 'array';
    const filterCallback = options.filterCallback ?? (() => true);

    // Name is required
    if(!name)
      return 

    // The filters we currently have
    const filters = state.get('filters');

    // Add the filters
    filters[name] = { filterCallback, type, args: {}, result: null, };

    // Update the state
    state._.filters = filters;
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
    
    // Name is required
    if(!name)
      return;

    // The filters we currently have
    const filters = state.get('filters');

    // Name not found
    if(!filters[name])
      return;

    // Grab some details of the filter
    const type = options.type ?? filters[name].type;
    const args = options.args ?? filters[name].args;
    const filterCallback = options.filterCallback ?? filters[name].filterCallback;

    // Add the filters
    filters[name] = { ...filters[name], type, args, filterCallback };

    // Update the state
    state._.filters = filters;
  } 

  /**
   * Triggers the filter callbacks to execute.
   * 
   * @param   { State }   state     The state of the filter state manager.
   * @param   { object }  options   The options for the filter. 
   */
  _.filterTrigger = function(state, options={}) {

    // Gather the details of the filter to register
    const name = options.name ?? null;  
    const args = options.args ?? {};

    // Update the filter
    _.filterUpdate(state, { name, args });    

    // Name is required
    if(!name)
      return;

    // Grab the existing filters
    const filters = state.get('filters');
    const filterCallbacks = state.get('filterCallbacks');

    // Name not found
    if(!filters[name])
      return;
    
    // We execute each of the filter callbacks
    Object.values(filterCallbacks).forEach(filterCallback => {
      filterCallback(state);
    })

    // Return the result too
    return filters[name].result;
  }

  /**
   * Executes a given filter and updates its stored result.
   *  
   * @param   { State }   state     The state of the filter state manager.
   * @param   { object }  options   The options for the filter. 
   * @return  { object }            The filtered dict or array.
   */
  _.filterExecute = function(state, options={}) {

    // Gather the details of the filter to register
    const name = options.name ?? null;
    const data = options.data ?? [];
    
    // Name is required
    if(!name)
      return;

    // The filters we currently have
    const filters = state.get('filters');

    // Name not found
    if(!filters[name])
      return;

    // Grab the callbacks of that filter
    const type = filters[name].type;
    const args = filters[name].args;
    const filterCallback = filters[name].filterCallback;
    const wrappedFilter = (d) => filterCallback(d, args);
    
    // For each type, perform a different filter method
    switch(type) {
      case 'keys':
      case 'key':
      case 'k':
        filters[name].result = ClientDict.filterKeys(data, wrappedFilter);
        break;

      case 'values':
      case 'value':
      case 'vals':
      case 'val':
      case 'v':
        filters[name].result = ClientDict.filterValues(data, wrappedFilter);
        break;

      case 'array':
      case 'arr':
      case 'a':
      default:
        filters[name].result = data.filter(wrappedFilter);
        break;
    }

    // We don't want a rerender here so we manually change it
    state._.filters = filters;

    // Return the result too
    return filters[name].result;
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
    state._.filters = filters;
  }

  /**
   * Registers a new filter callback.
   * 
   * @param   { State }   state     The state of the filter state manager.
   * @param   { object }  options   The options for the filter. 
   */
  _.filterCallback = function(state, options) {
    
    // Grab the callback
    const name = options.name ?? null;
    const callback = options.callback ?? null;

    // If no callback or no name, return
    if(!name || !callback)
      return;

    // Otherwise, register the function
    const filterCallbacks = state.get('filterCallbacks');

    // Append the filter callback
    filterCallbacks[name] = callback;

    // Update the state
    state._.filterCallbacks = filterCallbacks;
  }

  return {
    ..._,
  }
})();

export default {
  DVisualCtx,
  DVisualManager,
}