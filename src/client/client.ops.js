/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-02 01:48:47
 * @ Modified time: 2024-07-02 01:53:05
 * @ Description:
 * 
 * Deals with miscellaneous operations that need to be run on the main process but are called by the renderer.
 * For instance, closing the app.
 */

import { ClientIPC } from './client.ipc'

export const ClientOps = (function() {

  const _ = {};

  /**
   * Requests to exit the app.
   * 
   * @return  Returns the promise for the app exit.
   */
  _.appExit = function() {
    return ClientIPC.requestSender('ops', 'ops/exit-app')();
  }

  return {
    ..._,
  }
})();

export default {
  ClientOps
}
