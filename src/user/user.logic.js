/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-13 15:58:45
 * @ Modified time: 2024-07-13 16:25:03
 * @ Description:
 * 
 * A file that holds the logic specific to the files we're using.
 */

export const UserLogic = (function() {

  const _ = {}

  /**
   * Returns the minimum value of each property in the metadata.
   * 
   * @param   { object }  metadata  The meta data to get the minimum of.
   * @return  { object }            An object containing the minimum of each metadata property.
   */
  _.getMetaMin = function(metadata) {

    // Stores the minimum of each metadata property
    const out = {};

    // For each piece of metadata...
    Object.keys(metadata).forEach(metadataKey => {
      
      // Grab the metadata piece
      const d = metadata[metadataKey];
      
      // For each metadata property
      Object.keys(d).forEach(key => {
        
        // If the key hasn't been placed in the out object
        if(!Object.keys(out).includes(key))
          out[key] = d[key]

        // Otherwise, compare the values
        if(out[key] > d[key])
          out[key] = d[key]
      })
    })
    
    return out;
  }

  /**
   * Returns the maximum value of each property in the metadata.
   * 
   * @param   { object }  metadata  The meta data to get the maximum of.
   * @return  { object }            An object containing the maximum of each metadata property.
   */
  _.getMetaMax = function(metadata) {

    // Stores the maximum of each metadata property
    const out = {};

    // For each piece of metadata...
    Object.keys(metadata).forEach(metadataKey => {
      
      // Grab the metadata piece
      const d = metadata[metadataKey];
      
      // For each metadata property
      Object.keys(d).forEach(key => {
        
        // If the key hasn't been placed in the out object
        if(!Object.keys(out).includes(key))
          out[key] = d[key]

        // Otherwise, compare the values
        if(out[key] < d[key])
          out[key] = d[key]
      })
    })
    
    return out;
  }

  return {
    ..._,
  }
})();

export default {
  UserLogic,
}
