/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-03 03:49:19
 * @ Modified time: 2024-07-15 10:35:20
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
  filterCallbacks: [],
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
    const dataCallback = options.dataCallback ?? (() => []);
    const filterCallback = options.filterCallback ?? (() => true);

    // Name is required
    if(!name)
      return 

    // The filters we currently have
    const filters = state.get('filters');

    // Add the filters
    filters[name] = { dataCallback, filterCallback, result: null, };

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
    state._.filters = filters;
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
    const type = options.type ?? 'array';
    const args = options.args ?? {};
    
    // Name is required
    if(!name)
      return;

    // The filters we currently have
    const filters = state.get('filters');
    const filterCallbacks = state.get('filterCallbacks');

    // Name not found
    if(!filters[name])
      return;

    // Grab the callbacks of that filter
    const dataCallback = filters[name].dataCallback;
    const filterCallback = filters[name].filterCallback;
    const data = dataCallback(state._);
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

    // We execute each of the filter callbacks
    filterCallbacks.forEach(filterCallback => {
      filterCallback(state);
    })
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
    const callback = options.callback ?? null;

    // If no callback, return
    if(!callback)
      return;

    // Otherwise, register the function
    const filterCallbacks = state.get('filterCallbacks');

    // Append the filter callback
    filterCallbacks.push(callback);

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