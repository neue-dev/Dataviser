/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-06 16:30:31
 * @ Modified time: 2024-06-29 07:16:44
 * @ Description:
 * 
 * This module has some file system handling utilities.
 */

// Modules
const path = require('node:path');
const fs = require('node:fs');
const { parse } = require('csv-parse/sync');

/**
 * The file system object provides us with utilities to manage files opened by the user.
 * It stores their contents here too, and manages some of their states.
 */
export const FS = (function() {

  // The default function we use to create a new _FS object
  const _identity = (value) => value;
  
  /**
   * This monad helps us chain IO operations in a much more readable way.
   * 
   * @param     { function }  operation   The operation we want to add to the chain. 
   * @returns   { _FS }                   A wrapper around the chain of operations.
   */
  const _FS = (operation) => {
    return {

      /**
       * This chains an operation unto the existing ones.
       * It doesn't run the operations yet.
       * 
       * @param     { function }  f   The function to chain with the current effects.
       * @returns   { _FS }           A composed monad of the two operations.
       */
      chain: (f) => {
        return _FS(() => f(operation()))
      },

      /**
       * Executes the chain of operations we currently have.
       * 
       * @returns   { object }  The output of all the operations.
       */
      run: () => {
        return operation();
      }
    }
  }

  const _ = {};

  /**
   * Creates a new FS object.
   * 
   * @return  { _FS }   A new FS object to append operations on.
   */
  _.create = function() {
    return _FS(_identity);
  }

  /**
   * Creates a file reader for the given filepath.
   * 
   * @param     { object }    options   The options for the file reader. 
   * @returns   { function }            A file reader that reads a given file when called.
   */
  _.fileCreateReader = function(options={}) {
    return function(filepath) {
      return function(data=[]) {

        // Read the data
        const filename = filepath;
        const content = fs.readFileSync(filepath, options);

        // Return the data
        return [ ...data, { filename, content } ];
      }
    }
  }

  _.dirCreateReader = function(dirpath) {
    return function(options={}) {
      
    }
  }

  return {
    ..._,
  }

})();
