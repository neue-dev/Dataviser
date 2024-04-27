/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-27 22:22:47
 * @ Modified time: 2024-04-27 22:33:08
 * @ Description:
 * 
 * Creates an API for handling files and other related tasks.
 * Also helps with browsing directories, etc.
 */

export const File = (function() {

  // Stores all the pertinent methods for the api
  const _ = {
    registry: {},   // Stores all the files we've read
  };

  /**
   * Reads the text file as is.
   * 
   * @param   { File }      file      The file we want to read. 
   * @param   { function }  callback  A function that receives the file data after the file has been read.
   */
  _.readTextFile = function(file, callback) {
    
    // Create a file reader to read the files and store the filename
    const fileReader = new FileReader();
    const fileName = file.name;
            
    // Read the file, then save the data when done
    fileReader.readAsText(file);
    fileReader.onload = e => callback(e.target.result);
  }

  /**
   * Reads the binary file we have and stores the contents in a Uint8Array.
   * 
   * @param   { File }      file      The file we want to read. 
   * @param   { function }  callback  A function that receives the file data after the file has been read.
   */
  _.readBinaryFile = function(file, callback) {
    
    // Create a file reader to read the files and store the filename
    const fileReader = new FileReader();
    const fileName = file.name;
            
    // Read the file, then save the data when done
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = e => fileReader.onload = e => callback(new Uint8Array(e.target.result));
  }

  /**
   * Traverses the directory and returns all the files contained therein.
   * 
   * @param   { FileSystemDirectoryHandle }   directoryHandle   A handle to some folder in our system. 
   * @param   { object }                      options           Options on what files to read.
   */
  _.getDirectoryFiles = async function(directoryHandle, options={}) {
    
    // Queue of the different directories to parse
    let directoryHandlesQueue = [ directoryHandle ];
    let i = 0;

    // This loop goes through each of the files and reads them
    do {

      // Go to the next handle
      directoryHandle = directoryHandlesQueue[i++];

      // For each thing inside the folder
      for await(let entryHandle of directoryHandle.values()) {

        // Add directory to the queue
        if(entryHandle.kind == 'directory')
          directoryHandlesQueue.push(entryHandle);
      
        // Add file to list
        else if(entryHandle.kind == 'file')
          entryHandle.getFile().then(file => console.log(file));
      }

    // While we have stuff in the queue
    } while(i < directoryHandlesQueue.length)
  }

  // Return the file object
  return {
    ..._,
  }
})();

export default {
  File,
}