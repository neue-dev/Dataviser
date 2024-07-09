/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-01 02:19:57
 * @ Modified time: 2024-07-09 13:03:18
 * @ Description:
 * 
 * This file deals with managing the interplay of JS and Python DF data.
 */

import { dispatch } from 'd3';
import { ClientPromise } from './client.promise';
import { ClientPython } from './client.python';
import { ClientStore } from './client.store.api'; 
import { ClientToast } from './client.toast';

export const ClientDF = (function() {

  const _ = {};
  const _out = 'OUT';   // The name of the output variable

  /**
   * Creates the filter script based on the provided rows and cols.
   * 
   * @param   { array }   rows  The rows to use for filtering.
   * @param   { array }   cols  The cols to use for filtering.
   * @return  { string }        The script to filter for the rows and cols.
   */
  const _filterScriptCreate = function(options) {

    // Grab the options
    const rows = options.rows ?? [];
    const cols = options.cols ?? [];

    // Stringify the arrays
    const rowString = JSON.stringify(rows);
    const colString = JSON.stringify(cols);

    // Create the filter script
    return `
      DFS = df_filter_rows(DFS, 'index', ${rowString})
      DFS = df_filter_cols(DFS, ${colString})
      print('PYTHON: filtered.')
    `;
  }

  /**
   * Creates the transformer script.
   * Converts the dataframes to row sums or cols sums based on the options.
   * 
   * @param   { object }  options   The options for how to convert the dataframe.
   * @return  { string }            The script to filter for the rows and cols.
   */
  const _transformScriptCreate = function(options={}) {

    // Parse the options
    const orient = options.orient ?? '';
    const transform = [ 'cols', 'col' ].includes(orient) ? 
      'df_transform_col_sums' :
      'df_transform_row_sums';

    // No transform was provided
    if(!orient.length)
      return `
        print('PYTHON: no transform applied.')
      `;

    // Create the filter script
    return `
      DFS = ${transform}(DFS)
      print('PYTHON: transformed.')
    `;
  }

  /**
   * Saves all the provided dfs into the store.
   * 
   * @param   { object }  dfs       A dict containing all the dfs.
   * @param   { object }  options   Options for saving the dfs.
   */
  const _dfCreate = function(dfs, options={}) {

    // Grab the options
    const group = options.group ?? null;

    // The dispatcher and the dfkeys
    const dispatch = ClientStore.storeDispatcher('df/dfCreate');
    const dfKeys = Object.keys(dfs);

    // Save each of the dfs to the store
    dfKeys.forEach(dfKey => dispatch({ id: dfKey, data: dfs[dfKey].df, group }))

    // Update the timestamp
    _dfUpdateTimestamp(group);
  }

  /**
   * Register metadata for the given dfs.
   * 
   * @param   { object }  dfs   The collection of dfs whose metadata to register.
   */
  const _dfCreateMeta = function(dfs) {

    // The dispatcher and the dfkeys
    const dispatch = ClientStore.storeDispatcher('df/dfMetaCreate');
    const dfKeys = Object.keys(dfs);

    // Save each of the dfs to the store
    dfKeys.forEach(dfKey => dispatch({ id: dfKey, meta: dfs[dfKey].meta }))

    // Update the timestamp
    _dfUpdateTimestamp('_');
  }

  /**
   * Update the timestamp for the specified group.
   * 
   * @param   { string }  group   The group we want to update.
   */
  const _dfUpdateTimestamp = function(group='_') {
    
    // The dispatcher
    const dispatch = ClientStore.storeDispatcher('df/dfTimestampUpdate');

    // Update the timestamp for that group
    dispatch({ group });
  }

  /**
   * Returns a function that checks whether or not the store updated the group last time.
   * 
   * @param   { string }    group   The group we're checking updates for.
   * @return  { function }          A function that checks if the group was updated from the last check.
   */
  const _dfUpdateChecker = function(group='_') {
    
    // The timestamps
    let prevTimestamp = null;
    let currTimestamp = null;

    return () => {

      // Update the previous and current timestamp
      prevTimestamp = currTimestamp;
      currTimestamp = ClientStore.select(state => state.df.timestamps[group]);

      // Return whether or not there was an update
      if(prevTimestamp != currTimestamp)
        return true;
      return false;
    }
  }

  /**
   * Initializes our dataframes from the fs part of the store.
   */
  _.dfInit = function() {

    // Create the output promise
    const { promise, resolveHandle, rejectHandle } = ClientPromise.createPromise();

    // Grab the data from the store
    const filedata = ClientStore.select(state => state.fs.filedata);
    const filemeta = ClientStore.select(state => state.fs.filemeta);
    const filepaths = Object.keys(filedata);

    // We format the data so it's properly accessible through Python
    const pyData = {
      dfs: {},
    };

    // Options for some Python stuffs
    const pyOptions = {
      ORIENT: 'dict',
    };

    // Append data and the metadata
    filepaths.forEach(filepath => {
      pyData.dfs[filepath] = {
        df: filedata[filepath],
        meta: filemeta[filepath],
      }
    })

    // Send the data to the Python script
    ClientPython.dataSend({ ...pyData, ...pyOptions })
      .then(() => ClientPython.fileRun('df_preprocess'))
      .then(() => ClientPython.fileRun('df_out'))
      .then(() => ClientPython.dataRequest(_out))
      .then((result) => {
        _dfCreate(result[_out])
        _dfCreateMeta(result[_out]);
      })
      .then(() => resolveHandle())
      .catch((e) => rejectHandle(e));

    // Return the promise
    return ClientToast.createToaster({ 
      promise,
      success: 'Files were converted into Pandas dataframes.',
      loading: 'Creating dataframes...',
      failure: 'Could not create dataframes.'
    });
  }

  /**
   * Retrieves the dataframes of the given group from the store.
   * Reformats the data based on the given options.
   * 
   * @param   { object }  options   The options for which group of dataframes we want.
   * @return  { object }            The requested dataframes.
   */
  _.dfGet = function(options={}) {

    // Parse the options
    const group = options.group ?? '_';

    // Grab the raw df data
    const result = ClientStore.select(state => state.df.dfs[group]);

    // Return the result
    return result;
  }

  /**
   * Creates a selector that retrieves the group of dfs.
   * 
   * @param   { string }    group   The name of the group of dfs to retrieve.
   * @return  { function }          A selector function that returns the group of dfs specified. 
   */
  _.dfSelector = function(group='_') {
    return (state) => {
      return state.df.dfs[group];
    }
  }

  /**
   * Subscribes a given callback to the store.
   * 
   * @param   { function }  callback  The callback that executes per dispatch.
   * @return  { function }            The function that unsubscribes the callback.
   */
  _.dfSubscribe = function(callback) {
    return ClientStore.subscribe(callback);
  }

  /**
   * Subscribes a given group to the store.
   * This means that when any of the file contents change, the groups are automatically updated.
   * 
   * @param   { object }    options   The options for the subscription.
   * @return  { function }            The function that unsubscribes the callback.
   */
  _.dfSubscribeGroup = function(options={}) {

    // Grab the option params
    const group = options.group ?? '_';
    const ids = options.ids ?? [];
    const rows = options.rows ?? [];
    const cols = options.cols ?? [];
    const orient = options.orient ?? '';

    // Create the filter script
    const filterScript = _filterScriptCreate({ rows, cols });
    const transformScript = _transformScriptCreate({ orient });

    // The function we subscribe to the store
    const checker = _dfUpdateChecker('_');
    const updater = () => {

      // No update happened, so no need to run scripts
      if(!checker())
        return;
      
      // Send the data to Python and update the store after
      ClientPython.dataSend({ IDS: ids, })
        .then(() => ClientPython.scriptRun(filterScript))
        .then(() => ClientPython.scriptRun(transformScript))
        .then(() => ClientPython.fileRun('df_out'))
        .then(() => ClientPython.dataRequest(_out))
        .then((result) => _dfCreate(result[_out], { group }))
    }

    // Call it once at the start too
    updater();

    // Subscribe to the store
    return ClientStore.subscribe(updater);
  }

  return {
    ..._,
  }
})();

export default {
  ClientDF
}