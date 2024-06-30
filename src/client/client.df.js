/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-01 02:19:57
 * @ Modified time: 2024-07-01 02:51:07
 * @ Description:
 * 
 * This file deals with managing the interplay of JS and Python DF data.
 */

import { ClientPython } from './client.python'
import { ClientStore } from './client.store.api'; 

export const ClientDF = (function() {

  const _ = {};

  _.dfLoad = function() {
    fetch('./')
  }

  return {
    ..._,
  }
})();

console.log(ClientDF.loadDfs());

export default {
  ClientDF
}