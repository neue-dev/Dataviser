/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-27 23:13:32
 * @ Modified time: 2024-04-29 09:03:57
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
export function Dataframe(id, data, serial) {

  // Some metadata
  this.ID = id;
  this.COLS = [];
  this.ROWS = [];
  this.INDEX = '';
  this.SERIAL = serial ?? 0;
  this.METADATA = new Set([ 
    'ID', 
    'COLS',
    'ROWS', 
    'INDEX', 
    'SERIAL',
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
 * Retrieves the maximum value within the dataframe, across the specified cols.
 * 
 * @param   { array }   cols  The columns where we wanna look.
 * @return  { array }         The maximum value found across the columns.
 */
Dataframe.prototype.getMax = function(cols) {

  // Create the df
  const df = this.get();
  let max = Number.NEGATIVE_INFINITY;

  // Use all cols by default
  if(!cols || !cols.length)
    cols = this.getCols();

  // We compute the cols
  for(let row in df)
    for(let col in df[row])
      if(cols.indexOf(col) >= 0)
        if(df[row][col] > max)
          max = df[row][col]

  return max;  
}

/**
 * Retrieves the minimum value within the dataframe, across the specified cols.
 * 
 * @param   { array }   cols  The columns where we wanna look.
 * @return  { array }         The minimum value found across the columns.
 */
Dataframe.prototype.getMin = function(cols) {

  // Create the df
  const df = this.get();
  let min = Number.POSITIVE_INFINITY;

  // Use all cols by default
  if(!cols || !cols.length)
    cols = this.getCols();

  // We compute the cols
  for(let row in df)
    for(let col in df[row])
      if(cols.indexOf(col) >= 0)
        if(df[row][col] < min)
          min = df[row][col]

  return min;  
}

/**
 * Gets the sum of all values across each row.
 * 
 * @return  { object }  A dictionary of the sums.
 */
Dataframe.prototype.getRowSums = function() {
  const df = this.get()
  const sums = {}

  for(let row in df) {
    sums[row] = 0;
    
    for(let col in df[row])
      sums[row] += df[row][col]
  }

  return sums;
}

/**
 * Gets the sum of all values across each col.
 * 
 * @return  { object }  A dictionary of the sums.
 */
Dataframe.prototype.getColSums = function() {
  const df = this.get()
  const sums = {}

  for(let row in df) {
    for(let col in df[row]) {
      if(!sums[col])
        sums[col] = 0;
      sums[col] += df[row][col]
    }
  }

  return sums;
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
 * Filters the rows and cols of the dataframe by the specified names.
 * 
 * @param   { array }     rowcols   An array of the rows and cols we want.
 * @param   { function }  callback  The function to receive the filtered dataframe.
 */
Dataframe.prototype.filterRowcols = function(rowcols, callback=d=>d) {
  
  // Get the df
  const dfs = {};
  dfs[this.ID] = this.get();

  // Filter by columns
  DataviserPyAPI.dfsFilterRowcols(dfs, rowcols, df_new => callback(df_new));
}

/**
 * Returns a matrix version of the dataframe.
 * 
 * @return  { matrix }  The matrix form of the data.
 */
Dataframe.prototype.toMatrix = function() {
  const matrix = [];
  const data = this.get();

  // Turns the data into a matrix
  for(let row in data) {
    matrix.push([]);
  
    for(let col in data[row]) {
      matrix[row].push(data[row][col])
    }
  }

  return matrix;
}

/**
 * Returns a list version of the dataframe.
 * By that, we mean a list of points.
 * 
 * @return  { array }   A list of the points we wanted.
 */
Dataframe.prototype.toList = function() {
  const list = [];
  const data = this.get();

  // Turns the data into a list of points
  for(let row in data) {
    for(let col in data[row]) {
      list.push({
        x: col, y: row,
        value: data[row][col]
      })
    }
  }

  return list;
}

/**
 * Manages all our dataframes.
 */
export const DataframeManager = (function() {
  
  // The manager
  let _ = {};
  let methods = {};
  let cache = {};
  const METHODS = new Set([
    'create',
    'setStore',
    'revertStore',
    'get',
    'getDf',
    'getDfs',
    'getDfsAsMatrix',
    'getDfsAsList',
    'getSumDfs',
    'getCount',
  ]);
  
  // Private vars
  let count = 0;
  let cacheCount = 0;

  /**
   * A utility function.
   * Filters the dataframes using their serial under the given callback.
   * The callback returns a boolean and is passed the serial of each dataframe.
   * 
   * @param   { function }  filter  The callback to use for filtering. 
   */
  const filterDfs = function(filter) {
    const dfs = {};

    // Filter the dfs
    for(let key in _) {
      if(!METHODS.has(key)) {
        if(filter(_[key].SERIAL) && !key.startsWith('_'))
          dfs[key] = _[key].get()
      }
    }

    return dfs;
  }

  /**
   * Stores the current dfs in the cache.
   * Replaces the current df dict with the one provided.
   * 
   * @param   { dict }  dfs       A dict of dfs. 
   * @param   { dict }  serials   The serials for the dfs.
   */
  _.setStore = function(dfs, serials) {
    cache = _;
    cacheCount = count;

    _ = {};
    _ = Object.assign(_, methods);
    count = serials.length;

    // Create the new store
    for(let key in dfs)
      _[key] = new Dataframe(key, dfs[key], serials[key])
  }
  
  /**
   * Reverts the store to the previous value.
   */
  _.revertStore = function() {
    _ = cache;
    count = cacheCount;
  }

  /**
   * Creates a new dataframe.
   * 
   * @param   { string }      id      The id of the dataframe. 
   * @param   { object }      data    The object we want to convert.
   * @param   { any }         serial  Something to serialize the df.
   * @return  { Dataframe }           The new dataframe object.
   */
  _.create = function(id, data, serial) {
    _[id] = new Dataframe(id, data, serial);
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
   * @param   { string }    id      The id of the dataframe. 
   * @param   { function }  filter  An optional function to filter the dfs.
   * @return  { object }            The dataframes we want to retrieve in a dict.  
   */
  _.getDfs = function(filter=serial=>true) {
    return filterDfs(filter);
  }

  /**
   * Retrieves all the existing dataframes as matrices.
   * 
   * @param   { string }    id      The id of the dataframe. 
   * @param   { function }  filter  An optional function to filter the dfs.
   * @return  { object }            The dataframes we want to retrieve in a dict.  
   */
  _.getDfsAsMatrix = function(filter=serial=>true) {
    const dfs = filterDfs(filter);

    // Convert to matrices
    for(let key in dfs)
      dfs[key] = dfs[key].toMatrix();

    return dfs;
  }

  /**
   * Retrieves all the existing dataframes as lists of points.
   * 
   * @param   { string }    id      The id of the dataframe. 
   * @param   { function }  filter  An optional function to filter the dfs.
   * @return  { object }            The dataframes we want to retrieve in a dict.  
   */
  _.getDfsAsList = function(filter=serial=>true) {
    const dfs = filterDfs(filter);

    // Convert to matrices
    for(let key in dfs)
      dfs[key] = dfs[key].toList();

    return dfs;
  }

  /**
   * Computes the sum of the dataframes that satisfy the filter.
   * 
   * @param   { function }  filter  The filter function.
   * @return  { object }            The sum of the filtered dfs.
   */
  _.getSumDfs = function(filter=serial=>true) {

    // Hmm
    const dfs = filterDfs(filter);
    const dfSum = {};
    
    // For each df
    for(let key in dfs) {

      // For each row
      for(let row in dfs[key]) {

        // If entry is undefined
        if(!dfSum[row])
          dfSum[row] = {};

        // For each column
        for(let col in dfs[key][row]) {
          
          // If col is undefined
          if(!dfSum[row][col])
            dfSum[row][col] = 0
          
          // Add the value of the df
          dfSum[row][col] += dfs[key][row][col]
        }
      }
    }

    // Return cumulative df
    return dfSum;
  }

  /**
   * Returns how many dataframes we currently have.
   * 
   * @return  { number }  How many dataframes we have.
   */
  _.getCount = function() {
    return count;
  }

  // So we have a reference next time
  methods = Object.assign(methods, _);

  return {
    ..._,
  }
})();

export default {
  Dataframe,
  DataframeManager,
}