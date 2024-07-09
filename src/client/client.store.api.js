/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-29 07:41:58
 * @ Modified time: 2024-07-09 11:33:09
 * @ Description:
 * 
 * This file links our store with the ipc.
 */

import { store } from '../store/store'
import { ClientIPC } from './client.ipc'

export const ClientStore = (function() {

  const _ = {};

  /**
   * Subscribes a function to the store.
   * This is kept here so we don't have to reference the store directly.
   * 
   * @param   { function }  callback  The callback to execute when responding to store events.
   * @return  { function }            The cleanup function that unsubscribes the registered callback. 
   */
  _.subscribe = function(callback) {
    return store.subscribe(callback);
  }

  /**
   * Returns a portion of the state according to the callback given.
   * Again, this is kept here so we don't have to reference the store directly.
   * 
   * @param   { function }  callback  A callback that selects a portion of the state. 
   * @return  { state }               A portion of the state.
   */
  _.select = function(callback) {
    return callback(store.getState());
  }

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

  return {
    ..._,
  }

})();