/**
 * @ Author: Mo David
 * @ Create Time: 2024-08-01 23:09:01
 * @ Modified time: 2024-08-03 16:48:12
 * @ Description:
 * 
 * Formats the data for each of the visuals we have.
 */

export const VisualFormatter = (function() {
  
  const _ = {};

  /**
   * Returns the columns of a dataframe.
   * 
   * @param   { Object }  df  The raw dataframe.
   * @return  { array }       An array of the column names of the df.
   */
  const _getDfCols = function(df) {
    return Object.keys(df);
  }

  /**
   * Grabs all the row names of the df.
   * 
   * @param   { Object }  df  The raw dataframe. 
   * @return  { array }       The rows in the dataframe.
   */
  const _getDfRows = function(df) {
    const cols = _getDfCols(df);
    const rows = new Set();

    // Add each of the rows to the set
    cols.forEach(col => {
      const c = df[col];
      Object.keys(c).forEach(row => rows.add(row));
    })
    
    // Return array of row keys
    return Array.from(rows);
  }

  /**
   * Computes the sum of an array of dataframes.
   * 
   * @param   { array }   dfArray   An array of dataframes to sum.
   * @return  { Object }            A single dataframe representing the sum of all dfs.   
   */
  const _computeDfSum = function(dfArray) {
    
    // The sum
    const sumDf = {};

    // Generate the sum
    dfArray.forEach(df =>
      _getDfCols(df).forEach(col => {
        _getDfRows(df).forEach(row => {
          
          // Init the col if undefined
          if(!sumDf[col]) 
            sumDf[col] = {};

          // Init the row if undefined
          if(!sumDf[col][row]) 
            sumDf[col][row] = 0;
          
          // Sum them all
          if(df[col])
            if(df[col][row])
              sumDf[col][row] += df[col][row];
        })
      })
    )

    // Return the sum
    return sumDf;
  }

  /**
   * Computes the sums along each of the columns of the df.
   * 
   * @param   { Object }  df  A raw dataframe.
   * @return  { Object }      An object containing the sums per column. 
   */
  const _computeDfRowSums = function(df) {

    // The row sums
    const rowSums = {};

    // Generate the row sums
    _getDfCols(df).forEach(col => {
      _getDfRows(df).forEach(row => {
        
        // Init the sums
        if(!rowSums[row]) 
          rowSums[row] = 0;
  
        // Compute the sums
        if(df[col])
          if(df[col][row])
            rowSums[row] += df[col][row];
      })
    })

    // Compute the max value
    const keys = Object.keys(rowSums);
    const min = keys.reduce((acc, curr) => acc = rowSums[curr] < acc ? rowSums[curr] : acc, Number.POSITIVE_INFINITY);
    const max = keys.reduce((acc, curr) => acc = rowSums[curr] > acc ? rowSums[curr] : acc, Number.NEGATIVE_INFINITY);
    
    // Save the properties
    rowSums.min = min;
    rowSums.max = max;

    // Return the rowSums
    return rowSums;
  }

  /**
   * Computes the sums along each of the columns of the df.
   * 
   * @param   { Object }  df  A raw dataframe.
   * @return  { Object }      An object containing the sums per col. 
   */
  const _computeDfColSums = function(df) {
    
    // The col sums
    const colSums = {};

    // Generate the row sums
    _getDfCols(df).forEach(col => {
      _getDfRows(df).forEach(row => {
        
        // Init the sums
        if(!colSums[col]) 
          colSums[col] = 0;
  
        // Compute the sums
        if(df[col])
          if(df[col][row])
            colSums[col] += df[col][row];
      })
    })

    // Compute the max value
    const keys = Object.keys(colSums);
    const min = keys.reduce((acc, curr) => acc = colSums[curr] < acc ? colSums[curr] : acc, Number.POSITIVE_INFINITY);
    const max = keys.reduce((acc, curr) => acc = colSums[curr] > acc ? colSums[curr] : acc, Number.NEGATIVE_INFINITY);
    
    // Save the properties
    colSums.min = min;
    colSums.max = max;

    // Return the col sums
    return colSums;
  }

  /**
   * Computes the sum of the values along both the row and the columns.
   * 
   * @param   { Object }  df        A raw dataframe.
   * @param   { Object }  options   Options for computing the sum.
   * @return  { Object }            An object containing the sums per row and col. 
   */
  const _computeDfRowColSums = function(df, options={}) {
    
    // Contains sums for both row and cols
    const sums = {};

    // Generate the row-col sums
    _getDfCols(df).forEach(col => {
      _getDfRows(df).forEach(row => {

        // Init the sums
        if(!sums[row]) 
          sums[row] = 0;
  
        if(!sums[col]) 
          sums[col] = 0;
  
        // Compute the sums
        // Increment both the row and col associated with the data
        // If the row and col are the same name, then it gets incremented twice
        if(df[col]) {
          if(df[col][row]) {
            sums[col] += df[col][row];
            sums[row] += df[col][row];
          }
        }
      })
    })

    // Return the generated sums
    return sums;
  }

  /**
   * Returns a filtered version of the df.
   * 
   * @param   { Object }  df        A raw dataframe.
   * @param   { Object }  options   Options for filtering the df.
   * @return  { Object }            A filtered dataframe. 
   */
  const _computeDfFiltered = function(df, options={}) {
   
    // Grab the optional filters
    const colIncludes = options.colIncludes ?? [];
    const rowIncludes = options.rowIncludes ?? [];

    // The output
    const out = {};

    // Filter the df
    _getDfCols(df).forEach(col => {
      _getDfRows(df).forEach(row => {

        // Skip excluded cols
        if(!colIncludes.includes(col) && colIncludes.length) 
          return;
        
        // Skip excluded rows
        if(!rowIncludes.includes(row) && rowIncludes.length) 
          return;
  
        // Save the data to the out df
        if(!out[col])
          out[col] = {};

        if(!out[col][row])
          out[col][row] = df[col][row];
      })
    })

    // Return the output
    return out;
  }

  /**
   * Converts a raw dataframe into a plain matrix of values.
   * 
   * @param   { Object }  df        The dataframe to convert.
   * @param   { array }   indices   The ordering of the row/col names to use for indexing.
   * @return  { array }             A 2d array of values.
   */
  const _computeDfMatrix = function(df, indices=[]) {
    
    // The output matrix
    const matrix = [];

    // For each col
    _getDfCols(df).forEach((col, i) => {
      
      // The matrix row
      const matrixRow = [];
      const colIndex = indices.length
        ? indices.indexOf(col)
        : i;
    
      // For each of the row entries
      _getDfRows(df).forEach((row, j) => {

        // Grab the index associated with the row
        const rowIndex = indices.length 
          ? indices.indexOf(row) 
          : j;
  
        // Update the row
        matrixRow[rowIndex] = df[col][row];
      })
  
      // Push the constructed row
      matrix[colIndex] = matrixRow;
    })

    // Return the matrix
    return matrix;
  }

  /**
   * Converts a dataframe to a series.
   * 
   * @param   { Object }  data      The data to parse.
   * @param   { Object }  options   The options for converting the dataframe.
   */
  _.dfToSeries = function(data, options={}) {
    // ! toadd
    return data;     
  }

  /**
   * Converts a dataframe to an adjacency matrix.
   * 
   * @param   { Object }  data      The data to parse.
   * @param   { Object }  options   The options for converting the dataframe.
   */
  _.dfToMatrix = function(data, options={}) {

    // Some options
    const mapper = options.mapper ?? (d => d);
    const limit = options.limit ?? 7;
        
    // Compute the sum df
    const dfArray = data.map(d => mapper(d));
    const sumDf = _computeDfSum(dfArray);
    const sums = _computeDfRowColSums(sumDf);
    
    // An array of the sums
    const filteredKeys = Object.keys(sums)

    // ! remove this part and make sure the component does the cleanup, not this file
      .filter(key => key.length)

      // ! keep
      .map(key => ({ key: key, value: sums[key] }))  
      .toSorted((a, b) => b.value - a.value)
      .toSpliced(limit)
      .map(d => d.key);

    // Compute the filtered sum
    const filteredSumDf = _computeDfFiltered(sumDf, { 
      colIncludes: filteredKeys,
      rowIncludes: filteredKeys,
    });

    // The output
    const keys = filteredKeys;
    const matrix = _computeDfMatrix(filteredSumDf, filteredKeys);    

    // Return the keys and the matrix
    return { keys, matrix }; 
  }

  /**
   * Converts the dataframe into a bunch of row sums.
   * 
   * @param   { Object }  data      The data to parse.
   * @param   { Object }  options   The options for converting the dataframe.
   */
  _.dfToRowSums = function(data, options={}) {

    // Get the options
    const mapper = options.mapper ?? (d => d);

    // Convert to dfArray
    const dfArray = data.map(d => mapper(d));
    
    // Get the sum df first
    const sumDf = _computeDfSum(dfArray);

    // Retrieve the row sum data
    return _computeDfRowSums(sumDf);
  }

  /**
   * Converts the dataframes into a bunch of col sums.
   * 
   * @param   { Object }  data      The data to parse.
   * @param   { Object }  options   The options for converting the dataframe.
   */
  _.dfToColSums = function(data, options={}) {
   
    // Get the options
    const mapper = options.mapper ?? (d => d);

    // Convert to dfArray
    const dfArray = data.map(d => mapper(d));
    
    // Get the sum df first
    const sumDf = _computeDfSum(dfArray);

    // Retrieve the row sum data
    return _computeDfColSums(sumDf);
  }

  /**
   * Converts a dataframe to a format readed by sankey plotters.
   * 
   * @param   { Object }  data      The data to parse.
   * @param   { Object }  options   The options for converting the dataframe.
   */
  _.dfToSankey = function(data, options={}) {
    // ! toadd
    return data; 
  }

  return {
    ..._,
  }
})();

export default {
  VisualFormatter,
}