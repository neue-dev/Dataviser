/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-27 22:22:47
 * @ Modified time: 2024-04-27 23:07:48
 * @ Description:
 * 
 * Creates an API for handling files and other related tasks.
 * Also helps with browsing directories, etc.
 */

export const FileAPI = (function() {

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
    fileReader.onload = e => callback(new Uint8Array(e.target.result));
  }

  /**
   * Traverses the directory and returns all the files contained therein.
   * 
   * @param   { FileSystemDirectoryHandle }   directoryHandle   A handle to some folder in our system. 
   * @param   { function }                    callback          Receives a list of all the files found in the directory.
   */
  _.getDirectoryFiles = async function(directoryHandle, callback) {
    
    // Queue of the different directories to parse
    const directoryHandlesQueue = [ directoryHandle ];
    const fileHandlesStack = []; 

    // Helps us terminate the loop and return after reading all files
    let directoryHandleIndex = 0, fileCount = 0;

    // This loop goes through each of the files and reads them
    while(directoryHandleIndex < directoryHandlesQueue.length) {

      // Go to the next handle
      directoryHandle = directoryHandlesQueue[directoryHandleIndex];

      // For each thing inside the folder
      for await(let entryHandle of directoryHandle.values()) {

        // Add directory to the queue
        if(entryHandle.kind == 'directory') {
          directoryHandlesQueue.push(entryHandle);
      
        // Add file to list
        } else if(entryHandle.kind == 'file') {

          // Retrieve the file and push to the stack
          entryHandle.getFile().then(file => {
            fileHandlesStack.push(file)
            
            // Also check if we're done with all files in the directory
            if(directoryHandleIndex >= directoryHandlesQueue.length && fileHandlesStack.length >= fileCount)
              callback(fileHandlesStack)
          });
          
          // Count the file
          fileCount++;
        }
      }

      // Increment the counter
      directoryHandleIndex++;
    }
  }

  // Return the file object
  return {
    ..._,
  }
})();

export default {
  FileAPI,
}