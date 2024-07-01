/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-01 02:19:57
 * @ Modified time: 2024-07-02 04:19:46
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

    // We format the data so it's properly accessible through Python
    const pyData = {
      'test': 'mydata'
    };

    // Send the data to the Python script
    ClientPython.dataSend(pyData);
  }

  return {
    ..._,
  }
})();

export default {
  ClientDF
}