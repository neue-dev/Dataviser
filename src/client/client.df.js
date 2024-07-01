/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-01 02:19:57
 * @ Modified time: 2024-07-02 06:46:04
 * @ Description:
 * 
 * This file deals with managing the interplay of JS and Python DF data.
 */

import { ClientPython } from './client.python';
import { ClientStore } from './client.store.api'; 

export const ClientDF = (function() {

  const _ = {};

  _.dfLoad = function() {

    // Grab the data from the store
    const filenames = ClientStore.select(state => state.fs.filenames);
    const filedata = ClientStore.select(state => state.fs.filedata);
    const dfKeys = Object.keys(filedata);

    // We format the data so it's properly accessible through Python
    const pyData = {
      dfs: {},
    };

    // Add the dfs
    for(let i = 0; i < dfKeys.length; i++) {
      const dfKey = dfKeys[i];
      pyData.dfs[dfKey] = filedata[dfKey];
    }

    // Send the data to the Python script
    ClientPython.dataSend(pyData)
      .then(() => ClientPython.dataRequest('dfs'))
      .then((result) => console.log(result))
  }

  return {
    ..._,
  }
})();

export default {
  ClientDF
}