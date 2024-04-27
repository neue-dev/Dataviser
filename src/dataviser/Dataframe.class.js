/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-27 23:13:32
 * @ Modified time: 2024-04-27 23:50:27
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
 */
function Dataframe(id, data) {
  this.id = id;
  this.data = data;
  this.cols = [];
  this.rows = [];

  return this;
}

/**
 * Retrieves the names of all the rows for the dataframe.
 * 
 * @return  { array }   An array containing all the labels for the rows.
 */
Dataframe.prototype.getRows = function() {

  // We already computed the rows before
  if(this.rows.length)
    return this.rows

  // We compute the rows
  for(let row in this.data)
    this.rows.push(row);

  return this.rows;
}

/**
 * Retrieves the names of all the columns for the dataframe.
 * 
 * @return  { array }   An array containing all the labels for the columns.
 */
Dataframe.prototype.getCols = function() {

  // We already computed the cols before
  if(this.cols.length)
    return this.cols

  // We compute the cols
  for(let row in this.data)
    for(let col in this.data[row])
      if(!(col in this.cols))
        this.cols.push(col);

  return this.cols;  
}

/**
 * 
 */
Dataframe.prototype.filterRows = function(rows) {
  const df = {};
  df[this.index] = this.data;
  DataviserPyAPI.dfsFilterRows(df, rows, d => console.log(d));
}

const test = new Dataframe('1', {
  '1': { '1': '10', '2': '20' },
  '2': { '1': '30', '2': '40' }
})

test.filterRows(['1']);

/**
 * Manages all our dataframes.
 */
export const DataframeManager = (function() {
  
  // The manager
  const _ = {};

  return {
    ..._,
  }
})();

export default {
  DataframeManager,
}