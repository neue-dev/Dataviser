/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-28 19:40:17
 * @ Modified time: 2024-06-28 20:30:47
 * @ Description:
 * 
 * Uses the toast api in a much more maintainable way.
 */

export const ClientLogger = (function() {

  const _ClientLogger = (logger) => {
    return function (message) {
      logger(message);
    }
  }

  const _ ={};

  /**
   * A function that creates a new client logger.
   * 
   * @param     { Function }      logger  The logger to use. 
   * @returns   { ClientLogger}           The client logger to use.
   */
  _.create = (logger) => _ClientLogger(logger);

  return {
    ..._,
  }

})();

const test = ClientLogger.create(console.log);


export default {
  ClientLogger
}
