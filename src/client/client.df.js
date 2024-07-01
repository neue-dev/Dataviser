/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-01 02:19:57
 * @ Modified time: 2024-07-02 07:03:05
 * @ Description:
 * 
 * This file deals with managing the interplay of JS and Python DF data.
 */

import { ClientPromise } from './client.promise';
import { ClientPython } from './client.python';
import { ClientStore } from './client.store.api'; 

export const ClientDF = (function() {

  const _ = {};

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
    dfKeys.forEach(dfKey => dispatch({ id: dfKey, data: dfs[dfKey] }))
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

    // We format the data so it's properly accessible through Python
    const pyData = {
      dfs: { ...filedata },
    };

    // Send the data to the Python script
    ClientPython.dataSend(pyData)
      .then(() => ClientPython.dataRequest('dfs'))
      .then((result) => _dfCreate(result.dfs))
      .then(() => resolveHandle())
      .catch((e) => rejectHandle(e));

    // Return the promise
    return promise;
  }

  return {
    ..._,
  }
})();

export default {
  ClientDF
}