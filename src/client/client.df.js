/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-01 02:19:57
 * @ Modified time: 2024-07-03 13:52:53
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
   * @param   { object }  dfs   A dict containing all the dfs.
   */
  const _dfCreate = function(dfs) {

    // The dispatcher and the dfkeys
    const dispatch = ClientStore.storeDispatcher('df/dfCreate');
    const dfKeys = Object.keys(dfs);

    // Save each of the dfs to the store
    dfKeys.forEach(dfKey => dispatch({ id: dfKey, data: dfs[dfKey].df, meta: dfs[dfKey].meta }))
  }

  /**
   * Loads the dfs we have from the files into the Python environment.
   * AND THEN it loads them into the df slice of our store.
   * 
   * @return  { Promise }   A promise for the execution of the action. 
   */
  _.dfLoad = function() {

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

    // Append data and the metadata
    filepaths.forEach(filepath => {
      pyData.dfs[filepath] = {
        df: filedata[filepath],
        meta: filemeta[filepath],
      }
    })

    // Send the data to the Python script
    ClientPython.dataSend(pyData)
      .then(() => ClientPython.fileRun('df_init'))
      .then(() => ClientPython.dataRequest(_out))
      .then((result) => _dfCreate(result[_out]))
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