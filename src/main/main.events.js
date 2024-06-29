/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-29 06:35:28
 * @ Modified time: 2024-06-29 23:43:48
 * @ Description:
 * 
 * This file defines all the events the app will be listening to.
 */

import { IPC } from './main.ipc'

/**
 * This encloses all our variables in their own scope.
 * It prevents us from polluting the global namespace.
 */
export const Events = (function() {

  /**
   * Initializes all our events.
   */
  const init = function() {

    // Generate the new ipc with registered events
    const ipc = IPC.get()

      // All the file IO
      .map(IPC.eventRegisterer('fs/choose-files'))
      .map(IPC.eventRegisterer('fs/choose-directories'))
      .map(IPC.eventRegisterer('fs/load-files'))
      .map(IPC.eventRegisterer('fs/load-directories'))
      
      // ! change these later
      // ! actually register their callbacks
      .map(IPC.eventSubscriber('fs/choose-files', e => console.log(e)))
      .map(IPC.eventSubscriber('fs/choose-directories', e => console.log(e)))
      .map(IPC.eventSubscriber('fs/load-files', e => console.log(e)))
      .map(IPC.eventSubscriber('fs/load-directories', e => console.log(e)))

    // Finally, set the modified ipc to the existing one
    IPC.set(ipc);
  }

  return {
    init,
  }
})();

