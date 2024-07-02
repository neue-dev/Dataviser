/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-02 20:52:31
 * @ Modified time: 2024-07-02 20:54:44
 * @ Description:
 * 
 * A file containing all the functions and logic that are specific to the user, not the app.
 * For instance, the ourMetaParser() function parses metadata in a very specific way 
 * (it's not a feature of the app per se).
 */

/**
 * A function that extracts metadata from the filenames of our files.
 * Extracts the date of the file from the filename.
 * 
 * @param   { string }  filename  The name of the file to parse.
 * @return  { object }            Contains date information about the file.
 */
export function ourMetaParser(filename) {

  // Define some other params abt the file
  const dateString = filename.split('_').slice(-1)[0].split('.')[0];
  const months = [ 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec' ];
  
  // Define the date params
  const day = parseInt(dateString.slice(-2))
  const month = months.indexOf(dateString.slice(0, 3).toLowerCase())
  const year = 2024;
  const date = (new Date(year, month, day)).getTime();

  // Return the metadata
  return { day, month, year, date };
}

export default {
  ourMetaParser
}