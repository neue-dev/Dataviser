/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-02 15:25:28
 * @ Modified time: 2024-07-02 15:27:11
 * @ Description:
 * 
 * Some utility functions which we'll probably use in a bunch of places. 
 */

export const Utils = (function() {

  const _ = {};

  /**
   * Deserializes passed callbacks.
   * 
   * @param   { string }    functionString  The stringified function.
   * @return  { function }                  The deserialized function.
   */
  _.deserializeFunction = function(functionString) {
    return new Function(`return ${functionString}`)();
  }

  return {
    ..._
  }
})();

export default {
  Utils,
}

