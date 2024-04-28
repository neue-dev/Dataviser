/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-27 23:13:32
 * @ Modified time: 2024-04-29 00:05:36
 * @ Description:
 * 
 * A wrapper on JSON-serialized dataframe objects, so we can work with them in d3.js
 * Note that this class uses the Pyodide API to help perform operations on dataframes.
 * Also note that we implement dataframes as immutable objects here.
 * IF we want to perform an operation on a dataframe, we create a new one... functional programming!
 */

import { DataviserPyAPI } from "./Dataviser.pyapi";

/**
 * The dataframe class.
 * This is basically an extension of the dictionary object.
 */
export function Dataframe(id, data) {

  // Some metadata
  this.ID = id;
  this.COLUMNS = [];
  this.ROWS = [];
  this.INDEX = '';
  this.METADATA = new Set([ 
    'ID', 
    'COLUMNS',
    'ROWS', 
    'INDEX', 
    'METADATA', 
  ])

  // Copy the data into the instance
  for(let key in data)
    this[key] = data[key];

  return this;
}

/**
 * Retrieves the data of the dataframe without the metadata.
 * 
 * @return  { object }  An object representing the dataframe.
 */
Dataframe.prototype.get = function() {
  const df = {};

  // We create the df
  for(let key in this)
    if(!this.METADATA.has(key) && !Object.getPrototypeOf(this)[key])
      df[key] = this[key];

  return df;
}

/**
 * Retrieves the names of all the rows for the dataframe.
 * 
 * @return  { array }   An array containing all the labels for the rows.
 */
Dataframe.prototype.getRows = function() {

  // Create the df
  const df = this.get();

  // We already computed the rows before
  if(this.ROWS.length)
    return this.ROWS

  // We compute the rows
  for(let row in df)
    this.ROWS.push(row);

  return this.ROWS;
}

/**
 * Retrieves the names of all the columns for the dataframe.
 * 
 * @return  { array }   An array containing all the labels for the columns.
 */
Dataframe.prototype.getCols = function() {

  // Create the df
  const df = this.get();

  // We already computed the cols before
  if(this.COLS.length)
    return this.COLS;

  // We compute the cols
  for(let row in df)
    for(let col in df[row])
      if(this.COLS.indexOf(col) < 0)
        this.COLS.push(col);

  return this.COLS;  
}

/**
 * Filters the rows of the dataframe by the specified names.
 * 
 * @param   { array }     rows      An array of the rows we want.
 * @param   { function }  callback  The function to receive the filtered dataframe.
 */
Dataframe.prototype.filterRows = function(rows, callback=d=>d) {
  
  // Get the df
  const dfs = {};
  dfs[this.ID] = this.get();
  
  // Filter by rows
  DataviserPyAPI.dfsFilterRows(dfs, rows, df_new => callback(df_new));
}

/**
 * Filters the cols of the dataframe by the specified names.
 * 
 * @param   { array }     cols      An array of the cols we want.
 * @param   { function }  callback  The function to receive the filtered dataframe.
 */
Dataframe.prototype.filterCols = function(cols, callback=d=>d) {
  
  // Get the df
  const dfs = {};
  dfs[this.ID] = this.get();

  // Filter by columns
  DataviserPyAPI.dfsFilterCols(dfs, cols, df_new => callback(df_new));
}

/**
 * Manages all our dataframes.
 */
export const DataframeManager = (function() {
  
  // The manager
  const _ = {};
  let count = 0;
  const METHODS = new Set([
    'create',
    'get',
    'getDf',
    'getDfs',
    'getCount'
  ]);

  /**
   * Creates a new dataframe.
   * 
   * @param   { string }      id    The id of the dataframe. 
   * @param   { object }      data  The object we want to convert.
   * @return  { Dataframe }         The new dataframe object.
   */
  _.create = function(id, data) {
    _[id] = new Dataframe(id, data);
    count++;

    return _[id];
  }

  /**
   * Retrieves a selected dataframe.
   * 
   * @param   { string }    id  The id of the dataframe. 
   * @return  { Dataframe }     The dataframe we want to retrieve.  
   */
  _.getDf = function(id) {
    return _[id].get();
  }

  /**
   * Retrieves all the existing dataframes.
   * 
   * @param   { string }    id  The id of the dataframe. 
   * @return  { object }        The dataframes we want to retrieve in a dict.  
   */
  _.getDfs = function() {
    const dfs = {};

    for(let key in _)
      if(!METHODS.has(key))
        dfs[key] = _[key].get()

    return dfs;
  }

  /**
   * Returns how many dataframes we currently have.
   * 
   * @return  { number }  How many dataframes we have.
   */
  _.getCount = function() {
    return count;
  }

  return {
    ..._,
  }
})();

export default {
  Dataframe,
  DataframeManager,
}