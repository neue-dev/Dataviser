/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-29 06:35:28
 * @ Modified time: 2024-06-30 01:33:16
 * @ Description:
 * 
 * This file defines all the events the app will be listening to.
 */

import { IPC } from './main.ipc'
import { FS } from './main.fs'

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
      .map(IPC.eventSubscriber('fs/choose-files', FS.fileCreatePicker()))
      .map(IPC.eventSubscriber('fs/choose-directories', FS.directoryCreatePicker()))
      .map(IPC.eventSubscriber('fs/load-files', e => FS.fileCreateReader()))

    // Finally, set the modified ipc to the existing one
    IPC.set(ipc);
  }

  return {
    init,
  }
})();

