/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-07 05:10:47
 * @ Modified time: 2024-06-29 07:41:14
 * @ Description:
 * 
 * This file provides utility functions to help us deal with the client-side implementation of the IPC.
 * In this case, we handle IPC communication in a three-way manner.
 * The actual client window sends messages through the window.postMessage function which the preloader then receives.
 * Upon receiving these requests, the preloader invokes the actual main process function associated with the request.
 * Then the resulting data travels back up the preloader and back to the client.
 * All the while, we're using promises to manage the state of these requests on the client side.
 */

export const ClientIPC = (function() {
  
  const _ = {};
  const _responses = {};  // Stores the pending responses of the invocations

  /**
   * Creates a new function that calls the given service with a set source and message.
   * Makes our code more reusable.
   * 
   * @param     { string }    source    The source of the caller.
   * @param     { string }    message   The message the caller will send.
   * @returns   { function }            A caller that creates requests with the given source and message.
   */
  _.requestSender = function(source, message) {
    return function(args=[]) {
      
      // We need a unique id for each request
      const id = crypto.randomUUID();
      const target = 'preloader';

      // Create a new promise for that
      let resolveHandle;
      let rejectHandle;

      // Create a response promise
      _responses[id] = {

        // Create a new promise
        promise: new Promise((resolve, reject) => {
          resolveHandle = resolve;
          rejectHandle = reject;
        }),

        // Handles to the resolve and reject
        resolve: resolveHandle,
        reject: rejectHandle, 
      }

      // Relays the message to the preloader
      window.postMessage({ source, target, message, args });

      // Return the promise
      return _responses[id].promise;
    }
  }

  /**
   * This is the event listener that handles the messages coming from the preloader.
   * After the main process has created a response to our request, the preloader forwards it back to us.
   * This is the purpose of the event listener here: to listen to those reponses relayed by the preloader.
   */
  window.addEventListener('message', e => {
    
    // Parse the data
    const data = e.data;
    const { id, target, result } = data;

    // It's for the preloader
    if(target == 'preloader')
      return;

    // It's not a message intended for the ClientIPC if there's no id anyway
    if(!_responses[id])
      return;

    // Resolve the promise if it's a valid message
    _responses[id].resolve(result);
  })

  return {
    ..._,
  }
})();

export default ClientIPC;

