/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-13 08:47:11
 * @ Modified time: 2024-07-13 11:10:59
 * @ Description:
 * 
 * Allows us to filter dictionaries much more easily.
 */

export const ClientDict = (function() {

  const _ = {};

  /**
   * Filters a dictionary by keys.
   * 
   * @param   { object }    dict  The dictionary to filter.
   * @param   { Function }  f     The filter function to use for the keys. 
   * @return  { object }          A filtered version of the dictionary.
   */
  _.filterKeys = function(dict, f) {
    const out = {};

    // Include only the keys we want
    Object.keys(dict).filter(key => {
      if(f(key)) out[key] = dict[key];
    })

    // Return the out dict
    return out;
  }

  /**
   * Filters a dictionary by values.
   * 
   * @param   { object }    dict  The dictionary to filter. 
   * @param   { Function }  f     The function to use to filter the values.
   * @return  { object }          A filtered version of the dictionary.
   */
  _.filterValues = function(dict, f) {
    const out = {};

    // Include only the keys we want
    Object.keys(dict).filter(key => {
      if(f(dict[key])) out[key] = dict[key];
    })

    // Return the out dict
    return out;
  }

  return {
    ..._,
  }
})();

export default {
  ClientDict,
}