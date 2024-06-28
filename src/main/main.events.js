/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-29 06:35:28
 * @ Modified time: 2024-06-29 06:45:18
 * @ Description:
 * 
 * This file defines all the events the app will be listening to.
 */

import { IPC } from './main.ipc'

/**
 * This encloses all our variables in their own scope.
 * It prevents us from polluting the global namespace.
 */
export const EVENTS = (function() {

  /**
   * Initializes all our events.
   */
  const init = () => {

    // Generate the new ipc with registered events
    const ipc = IPC.get()

      // All the file IO
      .map(IPC.eventRegister('fs:choose-files'))
      .map(IPC.eventRegister('fs:choose-directories'))
      .map(IPC.eventRegister('fs:load-files'))
      .map(IPC.eventRegister('fs:load-directories'))
      
      .map(IPC.eventSubscribe('fs:choose-files', e => console.log(e)))
      .map(IPC.eventSubscribe('fs:choose-directories', e => console.log(e)))
      .map(IPC.eventSubscribe('fs:load-files', e => console.log(e)))
      .map(IPC.eventSubscribe('fs:load-directories', e => console.log(e)))

    // Finally, set the modified ipc to the existing one
    IPC.set(ipc);
  }

  return {
    init,
  }
})();

