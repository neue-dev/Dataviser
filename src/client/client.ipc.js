/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-07 05:10:47
 * @ Modified time: 2024-06-14 21:06:02
 * @ Description:
 * 
 * This file provides utility function to help us deal with the client-side implementation of the IPC.
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
   * This function calls the given invocation.
   * 
   * @param   { string }  host      The name of the host.
   * @param   { string }  message   The content of the message.
   * @param   { object }  args      Arguments to the invocation (if any).
   */
  _.call = function(host, message, args=[]) {
    const target = 'preloader';

    // Relays the message to the preloader
    window.postMessage({ host, message, args, target });

    // Create a new promise for that
    let resolveHandle;
    let rejectHandle;

    // Create a response promise
    _responses[message] = {

      // Create a new promise
      promise: new Promise((resolve, reject) => {
        resolveHandle = resolve;
        rejectHandle = reject;
      }),

      // Handles to the resolve and reject
      resolve: resolveHandle,
      reject: rejectHandle, 
    }

    // Return the promise
    return _responses[message].promise;
  }

  // This function resolves the promises we have saved
  // This is called whenever the preloader receives a response from the main thread
  window.addEventListener('message', e => {
    
    // Parse the message
    const target = e.data?.target ?? '';
    const message = e.data?.message ?? '';
    const result = e.data?.result ?? '';

    // It's for the preloader
    if(target == 'preloader')
      return;

    // It probably wasn't for us
    if(!_responses[message])
      return;

    // Resolve the promise
    _responses[message].resolve(result);
  })

  return {
    ..._,
  }
})();

export default ClientIPC;

