/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-03 03:49:19
 * @ Modified time: 2024-07-09 06:37:29
 * @ Description:
 * 
 * This stores the state of a given chart or visualization.
 */

import { UtilsContext } from "../utils/utils.context"

export const DVisualCtx = UtilsContext({
  isMuted: false,   // When we mute a vis, we prevent it from consuming resources by not rendering it live
  data: [],         // The actual data the vis is rendering
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

  return {
    ..._,
  }
})();

export default {
  DVisualCtx,
  DVisualManager,
}