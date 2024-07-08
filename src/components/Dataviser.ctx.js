/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-02 20:58:02
 * @ Modified time: 2024-07-09 06:15:42
 * @ Description:
 * 
 * This holds some information about the app which we don't keep in the store.
 * For instance, reference to the currently active charts and visualizations.
 */

import { UtilsContext } from "./utils/utils.context"

export const DataviserCtx = UtilsContext({
    
  // Stores all our current charts and what not
  dvisuals: [
    { id: '_' + crypto.randomUUID(), title: 'Migration Over Time', subtitle: '', x: 0, y: 0, w: 16, h: 6 },
    { id: '_' + crypto.randomUUID(), title: 'Chord Graph', subtitle: '', x: 0, y: 8, w: 16, h: 9 },
    { id: '_' + crypto.randomUUID(), title: 'Heat Map', subtitle: '', x: 16, y: 0, w: 16, h: 9 },
    { id: '_' + crypto.randomUUID(), title: 'Plot Graph', subtitle: '', x: 16, y: 8, w: 16, h: 6 },
  ],
});

export const DataviserManager = (function() {
  
  const _ = {};

  /**
   * Adds a new dvisual component to the state.
   * 
   * @param   { State }   state     The dataviser state.
   * @param   { object }  options   The options for the new dvisual.
   */
  _.dvisualCreate = function(state, options) {
    
    // Grab the details of the options
    const id = crypto.randomUUID();
    const title = options.title ?? 'New graph';
    const subtitle = options.subtitle ?? 'click the icon on the upper right to edit this graph.'
    
    // Position and sizing
    const x = options.x ?? 0;
    const y = options.y ?? 0;
    const w = options.w ?? 10;
    const h = options.h ?? 6;

    // Get the existing visuals
    const dvisuals = state.get('dvisuals');
    
    // Append the new visual
    dvisuals.push({
      id, title, subtitle, x, y, w, h
    })

    // Update the state
    state.set({ dvisuals })
  }

  /**
   * Updates the state of one of the dvisual components.
   * 
   * @param   { State }   state     The dataviser state.
   * @param   { object }  options   The options for the updated dvisual.
   */
  _.dvisualUpdate = function(state, options) {

    // Grab the id
    const id = options.id ?? options.i ?? null;

    // Nothing to update
    if(!id) return;

    // Get the selected visual and the old ones
    const dvisual = state.get('dvisuals').filter(dvisual => dvisual.id == id)[0];
    const dvisuals = state.get('dvisuals').filter(dvisual => dvisual.id != id);

    // Replace the old dvisual
    dvisuals.push({ ...dvisual, ...options });

    // We don't want a rerender here so we manually change it
    state._.dvisuals = dvisuals;
  }

  /**
   * Removes one of the dvisual components.
   * 
   * @param   { State }   state     The dataviser state.
   * @param   { object }  options   The options for the updated dvisual.
   */
  _.dvisualRemove = function(state, options) {
    
    // Grab the id
    const id = options.id ?? options.i ?? null;

    // Nothing to update
    if(!id) return;

    // Exclude the dvisual with the given id
    const dvisuals = state.get('dvisuals').filter(dvisual => dvisual.id != id);

    // Nothing to remove
    if(dvisuals.length == state.get('dvisuals').length)
      return;

    // Update the state
    state.set({ dvisuals })
  }

  return {
    ..._,
  }
})()

export default {
  DataviserCtx,
  DataviserManager,
}