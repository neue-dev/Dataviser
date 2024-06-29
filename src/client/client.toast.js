/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-14 18:30:08
 * @ Modified time: 2024-06-30 01:58:02
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

  // The default style
  const _style = {
    
    // Styling
    position: 'bottom-right',
    variant: 'left-accent',
    size: 'xs',

    // Behavior
    isClosable: true,
    duration: 2000,

    // Container style
    containerStyle: {
      width: '512px',
    },
  }

  /**
   * Creates a function that creates a toast.
   * 
   * @param   { object }    options   The options for the toast. 
   * @return  { function }            A function that creates the toast given the chakra toast object.
   */
  _.createToaster = function(options={}) {
    return function(toast) {
      
      // Grab the options
      const successMessage = options.success ?? 'Request was processed.'
      const loadingMessage = options.loading ?? 'Request is being processed.'
      const failureMessage = options.failure ?? 'An error occurred.'
      const promise = options.promise ?? Promise.resolve('');

      // Create the toast
      toast.promise(promise, {
        success: { title: _successTitle, description: successMessage, ..._style },
        loading: { title: _loadingTitle, description: loadingMessage, ..._style },
        error: { title: _failureTitle, description: failureMessage, ..._style },
      });
    } 
  }

  return {
    ..._,
  }
})();

export default {
  ClientToast,
}
