/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-01 02:19:57
 * @ Modified time: 2024-07-05 06:10:52
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
   * // ! put the doc here
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
   * 
   * // ! allow us to specify filters and what not
   * // ! when saving dfs, save them to a new 'data group', and not the dfs dict
   * 
   * @param   { object }    options   The options for loading the dataframes.
   * @return  { Promise }             A promise for the execution of the action. 
   */
  _.dfLoad = function(options={}) {

    // Create the output promise
    const { promise, resolveHandle, rejectHandle } = ClientPromise.createPromise();

    // Parse the options
    const group = options.group ?? 'test';

    // !Remove
    const filters = `
      # DFS = dfFilterRows(DFS, 'index', ['Chanthaburi'])
      DFS = dfFilterCols(DFS, ['Chanthaburi'])
      print('PYTHON: filtered')
    `;

    // Send the data to the Python script
    ClientPython.dataSend({ IDS: [], })
      .then(() => ClientPython.scriptRun(filters))
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