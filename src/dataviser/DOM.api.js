/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-28 22:21:14
 * @ Modified time: 2024-04-28 22:38:08
 * @ Description:
 * 
 * A utility for helping us manipulate the DOM.
 */

import '../ui/Grid.component'
import '../ui/Input.component'
import '../ui/Button.component'
import '../ui/Editor.component'
import '../ui/Slider.component'

export const DOMApi = (function() {

  const _ = {
    root: document.body,
  };

  /**
   * Sets a root element.
   * The root is where elements are appended by default.
   * 
   * @param   { HTMLElement }   root  The default root element. 
   */
  _.setRoot = function(root) {
    _.root = root;
  }

  /**
   * Creates a new HTML element.
   * 
   * @param   { string }        id        A string representing the id of the element. 
   * @param   { string }        tag       A string representing the type of element.
   * @param   { string }        content   The content of the element.
   * @return  { HTMLElement }             The created element.
   */
  _.create = function(id, tag, parentId='root', content='', options={}) {
    
    // Don't proceed if element doesn't exist
    if(!_[parentId]) 
      return;

    // If element exists
    if(_[id])
      return;

    // Create the element and append it
    _[id] = document.createElement(tag);
    _[id].innerHTML = content;
    _[id].classList.add(id)
    _[parentId].appendChild(_[id]);

    // If other classes are specified
    if(options.classes) {
      options.classes.forEach(className => 
        _[id].classList.add(className))
    }

    // Return the created element
    return _[id];
  }
  
  /**
   * Updates the style of an element.
   * 
   * @param   { string }        id      The id string.
   * @param   { object }        style   The style object.
   * @return  { HTMLElement }           The modified element.
   */
  _.style = function(id, style) {
    
    // Element doesn't exist
    if(!_[id])
      return;
    
    // Set the style
    for(let styleProperty in style)
      _[id].style[styleProperty] = style[styleProperty];  
    
    // Return the element
    return _[id];
  }

  /**
   * Gets the requested element.
   * 
   * @param   { string }        id  The id of the element we want.
   * @return  { HTMLElement }       The DOM element we want.
   */
  _.get = function(id) {
    if(_[id])
      return _[id];
    return null;
  }

  return {
    ..._,
  };
})();

export default {
  DOMApi
}