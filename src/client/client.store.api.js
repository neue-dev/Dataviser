/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-29 07:41:58
 * @ Modified time: 2024-06-29 08:39:47
 * @ Description:
 * 
 * This file links our store with the ipc.
 */

import { store } from '../data/store'
import { ClientIPC } from './client.ipc'

export const ClientStore = (function() {

  const _ = {};

  /**
   * Creates a function that creates store dispatches with the given action.
   * 
   * @param     { string }    action  The name of the action. 
   * @returns   { function }          A function that dispatches requests with that action.
   */
  _.storeDispatcher = function(action) {
    return function(payload={}) {
      store.dispatch({ type: action, payload });
    }
  }

  /**
   * Creates a request with the Client IPC first.
   * The result of this request is then used as the payload of the actual store dispatch.
   * 
   * @param     { string }    source  The source of the request.
   * @param     { string }    action  The name of the action. 
   * @returns   { function }          A function that creates dispatches to the main process via the ipc.
   */
  _.storeIPCDispatcher = function(source, action) {
    return function(args=[]) {
  
      // Create the request for the data from the main process first
      ClientIPC.requestSender(source, action)(args)
        
        // Then save the result to the store or smth else
        .then(result => store.dispatch({ type: action, payload: result }));
    }
  }

  // ! todo
  _.storeSubscriber = function() {
    return function() {
      
    }
  }

  // ! todo 
  _.storeIPCSubscriber = function() {
    return function() {
      
    }
  }

  return {
    ..._,
  }

})();