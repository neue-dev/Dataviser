/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-14 18:30:08
 * @ Modified time: 2024-06-14 19:48:15
 * @ Description:
 * 
 * This file deals with all the toasts the application might create.
 * Also deals with presenting errors and feedback to the user.
 */

export const ClientToast = (function() {
  
  const _ = {};

  // Some default messages
  const _successTitle = 'success';
  const _loadingTitle = 'loading';
  const _failureTitle = 'failed';

  /**
   * Creates a new toast.
   * 
   * @param   { object }  options   The options to pass for the toast.
   * @return  { string }            The id of the new toast.
   */
  _.createToast = function(toast, options={}) {
    
    // Grab the options
    const successMessage = options.success ?? 'Request was processed.'
    const loadingMessage = options.loading ?? 'Request is being processed.'
    const failureMessage = options.failure ?? 'An error occurred.'
    const promise = options.promise ?? new Promise(resolve => {
      resolve();
    })

    // The default style
    const style = {
      isClosable: true,
      position: 'bottom-right',
      duration: 20000,
      variant: 'left-accent',
      size: 'xs',

      containerStyle: {
        width: '512px',
      },
    }

    // Create the toast
    toast.promise(promise, {
      success: { title: _successTitle, description: successMessage, ...style },
      loading: { title: _loadingTitle, description: loadingMessage, ...style },
      error: { title: _failureTitle, description: failureMessage, ...style },
    });
  }

  return {
    ..._,
  }
})();

export default {
  ClientToast,
}
