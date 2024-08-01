/**
 * @ Author: Mo David
 * @ Create Time: 2024-08-01 23:09:01
 * @ Modified time: 2024-08-01 23:18:30
 * @ Description:
 * 
 * Formats the data for each of the visuals we have.
 */

export const VisualFormatter = (function() {
  
  const _ = {};

  /**
   * Converts a dataframe to a series.
   * 
   * @param   { Object }  df        The dataframe to parse.
   * @param   { Object }  options   The options for converting the dataframe.
   */
  _.dfToSeries = function(df, options={}) {
    // ! toadd
    return df;     
  }

  /**
   * Converts a dataframe to an adjacency matrix.
   * 
   * @param   { Object }  df        The dataframe to parse.
   * @param   { Object }  options   The options for converting the dataframe.
   */
  _.dfToMatrix = function(df, options={}) {
    // ! toadd
    return df; 
  }

  /**
   * Converts a dataframe to a format readed by sankey plotters.
   * 
   * @param   { Object }  df        The dataframe to parse.
   * @param   { Object }  options   The options for converting the dataframe.
   */
  _.dfToSankey = function(df, options={}) {
    // ! toadd
    return df; 
  }

  return {
    ..._,
  }
})();

export default {
  VisualFormatter,
}