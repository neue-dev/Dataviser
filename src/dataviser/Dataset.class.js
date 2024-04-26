/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-24 17:03:42
 * @ Modified time: 2024-04-26 12:34:57
 * @ Description:
 * 
 * The data set class stores a group of similar data assets.
 * These assets can be dataframes, matrices, arrays or something else.
 */

import d3 from '../libs/d3.v7.min.js'

/**
 * This is a constructor function.
 * It creates a new Dataset object, which holds groups of similar data together.
 * 
 * @param   { function }  keyParser       Parses the file key and extracts data from it. 
 * @param   { object }    assetParsers    Functions that transform the raw data into something we can use to display stuff.
 * @param   { function }  columnParser    A function that derives the columns from the data.
 * @param   { function }  rowParser       A function that derives the rows from the data.
 * @return  { Dataset }                   The created instance.
 */
export function Dataset(keyParser, assetParsers, seriesParsers, columnParser, rowParser) {

  // Metadata are extracted from filenames by keyParser
  this.metadata = {};

  // Summaries and series are generated from the assets
  this.summaries = {};
  this.series = {};

  // The actual data we have
  this.assets = {};
  this.assetCount = 0;

  // The labels of the rows and columns
  this.columns = {};
  this.rows = {};

  // Some helper function to make reading our data easier
  this.keyParser = keyParser ?? (d => d);
  this.assetParsers = { default: d => d, ...assetParsers };
  this.seriesParsers = { default: d => d, ...seriesParsers };
  this.columnParser = columnParser ?? (d => Object.keys(d[0]));
  this.rowParser = rowParser ?? (d => Object.keys(d));

  return this;
}

/**
 * Reads a files contents and adds the files contents to its list of assets.
 * Note that the file must be a JSON file.
 * 
 * @param   { File }      file      The file object we want to read.
 * @param   { object }    options   Additional options we may want to pass.
 * @return  { Promise }             A promise for the instance.
 */
Dataset.prototype.readJSON = async function(file, options={}) {
  const reader = new FileReader();
  const key = options.name ?? file.name.split('/').at(-1).split('\\').at(-1).split('.').slice(0, -1).join('.');

  // Creates an object with metadata
  this.metadata[key] = this.keyParser(key);

  // Return a promise for the data
  return new Promise((resolve, reject) => {
    
    // Note that the filekey above is just the filename minus the extension
    reader.readAsText(file);
    reader.onload = e => {
      this.add(key, JSON.parse(e.target.result))
      resolve(this);
    };
  });
}

/**
 * Adds a new asset object to the current list of assets stored by the dataset.
 * 
 * @param   { string }    key     The key to refer to the asset.
 * @param   { object }    asset   The asset to store.
 * @return  { Dataset }           The current instance.
 */
Dataset.prototype.add = function(key, asset) {

  // Saves the asset
  this.assets[key] = asset;
  this.assetCount++;

  // Creates an object with metadata
  this.metadata[key] = this.keyParser(key);

  // Adds the key to the columns and rows
  this.addColumns(key);
  this.addRows(key);

  return this;
}

/**
 * Adds columns to the column list from a particular asset.
 * 
 * @param     { string }  assetKey  Which instance to get the column info.
 * @return    { object }            The current instance.
 */
Dataset.prototype.addColumns = function(assetKey) {
  const columns = this.columnParser(this.assets[assetKey]);
  const columnKeys = Object.keys(columns);

  for(let i = 0; i < columnKeys.length; i++)
    if(!(columnKeys[i] in this.columns))
      this.columns[columnKeys[i]] = columns[columnKeys[i]];

  return this;
}

/**
 * Adds rows to the row list from a particular asset.
 * 
 * @param     { string }  assetKey  Which instance to get the row info.
 * @return    { object }            The row instance.
 */
Dataset.prototype.addRows = function(assetKey) {
  const rows = this.rowParser(this.assets[assetKey]);
  const rowKeys = Object.keys(rows);

  for(let i = 0; i < rowKeys.length; i++)
    if(!(rowKeys[i] in this.rows))
      this.rows[rowKeys[i]] = rows[rowKeys[i]];

  return this;
}

/**
 * Gets all the columns present in all the asset data instances.
 * 
 * @return  { object }  An ordinally-indexed object with the column names.
 */
Dataset.prototype.getColumns = function(assetKey) {
  return this.columns;
}

/**
 * Gets all the rows present in all the asset data instances.
 * 
 * @return  { object }  An ordinally-indexed object with the row names.
 */
Dataset.prototype.getRows = function(assetKey) {
  return this.rows;
}

/**
 * Retrieves a particular data asset from the data set.
 * 
 * @param   { string }    key     The key to refer to the asset.
 * @return  { object }            The data asset we were requesting for or null if it doesn't exist.
 */
Dataset.prototype.get = function(key) {
  if(key in this.assets)
    return this.assets[key];
  return null;
}

/**
 * Retrieves the list of data assets in the data set.
 * 
 * @return  { array }   The list of data asset keys.
 */
Dataset.prototype.getList = function(key) {
  return Object.keys(this.assets);
}

/**
 * Retrieves data from the dataset in a formatted manner.
 * Calls the selected asset parser to convert the format of the data.
 * 
 * @param   { string }  key             The data asset we want.
 * @param   { string }  assetParserKey  The parser for the asset.
 * @param   { object }  options         Options for the asset parser.
 * @return  { object }                  The data in the format we wanted.
 */
Dataset.prototype.getData = function(key, assetParserKey, options={}) {
  return this.assetParsers[assetParserKey](this.assets[key], options);
}

/**
 * Retrieves a series from the dataset in a formatted manner.
 * Calls the selected series parser to convert the format of the data.
 * 
 * @param   { string }  key               The data series we want.
 * @param   { string }  seriesParserKey   The parser for the series.
 * @param   { object }  options           Options for the series parser.
 * @return  { object }                    The data in the format we wanted.
 */
Dataset.prototype.getSeries = function(key, seriesParserKey, options={}) {
  return this.seriesParsers[seriesParserKey](this.series[key], options);
}

/**
 * Retrieves the metadata associated with a particular data asset.
 * Note that the metadata is always derived from the filename.
 * 
 * @param   { string }  key             The metadata we want.
 * @return  { object }                  The metadata we wanted.
 */
Dataset.prototype.getMetadata = function(key) {
  return this.metadata[key];
}

/**
 * Retrieves data from the dataset in a formatted manner.
 * Calls the selected asset parser to convert the format of the data.
 * The data retrieved here represents a summary of some interval of the input data.
 * 
 * @param   { string }  key             The data summary we want.
 * @param   { string }  assetParserKey  The parsed version of the asset.
 * @return  { object }                  The data in the format we wanted.
 */
Dataset.prototype.getSummary = function(key, assetParserKey, options) {
  return this.assetParsers[assetParserKey](this.summaries[key], options);
}

/**
 * Adds an asset parser to the ones we have.
 * 
 * @param   { string }    parserKey   The key for the asset parser.
 * @param   { function }  parser      The function we want to register.
 * @param   { string }    parserType  The type of parser we want to add.
 * @return  { object }                The current instance.
 */
Dataset.prototype.addParser = function(parserKey, parser, parserType='asset') {
  switch(parserType) {
    case 'key':
      this.keyParser = parser;
      break;

    case 'series':
      this.seriesParsers[parserKey] = parser;
      break;
    
    case 'asset':
    default: 
      this.assetParsers[parserKey] = parser;
      break;
  }

  return this;
}

/**
 * Computes a series of values across all assets.
 * The options parameter can help specify which subset of the assets to use.
 * 
 * @param   { string }  parameter   The parameter whose value we want to get over time / over the files.
 * @return  { object }              The series generated by the function.
 */
Dataset.prototype.computeSeries = function(parameter, options={}) {
  
  // The series we want to generate
  const series = {};
  const type = options.type ?? 'column';

  for(let assetKey in this.assets) {
    let asset = this.assets[assetKey];

    for(let row in asset) {
      for(let entry in asset[row]) {

        // It's column-based
        if(type == 'column') {
          if(entry == parameter) {
            if(!series[assetKey])
              series[assetKey] = {};
            series[assetKey][row] = asset[row][entry];
          }
        
        // If it's row-based
        } else {
          if(row == parameter) {
            if(!series[assetKey])
              series[assetKey] = {};
            series[assetKey][entry] = asset[row][entry];
          }
        }
      }  
    }
  }

  // Save the series
  this.series[options.savekey ?? 'series'] = series;

  // Return it
  return this.series[options.savekey ?? 'series'];
}

/**
 * Computes the total (summative) data asset for all the data assets.
 * Basically, it combines all the data assets into one and stores the sum in the asset dict.
 * 
 * @return  { object }  The total data for that period.
 */
Dataset.prototype.computeTotal = function() {
  return this.computeCumulative({ savekey: 'total' });
}

/**
 * Computes the total (summative) data asset for all the data assets.
 * Basically, it combines all the data assets into one and stores the sum in the asset dict.
 * 
 * @return  { object }  The data asset representing the cumulative data for that period.
 */
Dataset.prototype.computeCumulative = function(options={}) {

  // The object representing the total
  const cumulative = {};
  
  // Grab the asset keys
  let assetKeys = Object.keys(this.assets);

  // For each asset, we copy their data onto the cumulative object
  for(let i = 0; i < assetKeys.length; i++) {
    let asset = this.assets[assetKeys[i]];
    let refs = [ { path: [], o: asset } ];
    let optionKeys = Object.keys(options);
    
    // Check if the asset is within the options
    let skip = false;
    for(let j = 0; j < optionKeys.length; j++) {
      if(!(optionKeys[j] in this.metadata[assetKeys[i]]))
      continue;
    
    if(this.metadata[assetKeys[i]][optionKeys[j]] < options[optionKeys[j]][0] ||
      this.metadata[assetKeys[i]][optionKeys[j]] > options[optionKeys[j]][1]) {
        skip = true;
        break;
      }
    }
    
    // Skip this asset
    if(skip)
      continue;

    // While we have keys to iterate over
    while(refs.length) {
      
      // Get the current head object of the src and dest objects
      let refhead = refs.shift();
      let head = cumulative;
      
      // Create the keys in the dest if they dont exist
      // Copy data otherwise
      let keyIndex = 0;
      while(keyIndex < refhead.path.length) {
        let key = refhead.path[keyIndex++];

        // Register the key
        if(keyIndex < refhead.path.length && !head[key])
          head[key] = {};
        
        // Copy the value of the key
        if(keyIndex == refhead.path.length && !isNaN(parseInt(refhead.o))) {
          if(!head[key])
            head[key] = parseInt(refhead.o);
          else
            head[key] += parseInt(refhead.o);
        }

        // Set the new head
        head = head[key];
    }

      // Push the next object reference into the queue
      refs.push(...Object.keys(refhead.o).map(
        key => { return {
          path: [...refhead.path, key],
          o: refhead.o[key]
        }}
      ));
    }
  }

  // Save cumulative
  this.summaries[options.savekey ?? 'cumulative'] = cumulative;

  // Return the cumulative
  return this.summaries[options.savekey ?? 'cumulative'];
}

export default {
  Dataset,
}