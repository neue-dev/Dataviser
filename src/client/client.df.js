/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-01 02:19:57
 * @ Modified time: 2024-07-05 07:41:24
 * @ Description:
 * 
 * This file deals with managing the interplay of JS and Python DF data.
 */

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
  const _filterScriptCreate = function(rows, cols) {

    // Stringify the arrays
    const rowString = JSON.stringify(rows);
    const colString = JSON.stringify(cols);

    // Create the filter script
    return `
      DFS = dfFilterRows(DFS, 'index', ${rowString})
      DFS = dfFilterCols(DFS, ${colString})
      print('PYTHON: filtered')
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
   * Loads the dfs we have from the files into the Python environment.
   * AND THEN it loads them into the df slice of our store.
   * Note that it saves them to the group we provide.
   * 
   * @param   { object }    options   The options for loading the dataframes.
   * @return  { Promise }             A promise for the execution of the action. 
   */
  _.dfLoad = function(options={}) {

    // Create the output promise
    const { promise, resolveHandle, rejectHandle } = ClientPromise.createPromise();

    // Parse the options
    const group = options.group ?? null;
    const ids = options.ids ?? [];
    const rows = options.rows ?? [];
    const cols = options.cols ?? [];

    // Create the filter script
    const filterScript = _filterScriptCreate(rows, cols);

    // Send the data to the Python script
    ClientPython.dataSend({ IDS: ids, })
      .then(() => ClientPython.scriptRun(filterScript))
      .then(() => ClientPython.fileRun('df_out'))
      .then(() => ClientPython.dataRequest(_out))
      .then((result) => _dfCreate(result[_out], { group }))
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

  return {
    ..._,
  }
})();

export default {
  ClientDF
}