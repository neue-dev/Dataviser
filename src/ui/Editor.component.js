/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-28 17:33:26
 * @ Modified time: 2024-04-28 18:38:20
 * @ Description:
 * 
 * This class defines an HTMLElement with an editable field.
 * This is useful for stuff like editable code.
 */

import './Editor.component.css'
import { Component } from './Component'
import hljs from '../libs/highlight.min'

/**
 * An editable text field.
 * 
 * @class
 */
export class EditorComponent extends Component {
  static observedAttributes = [ 'language' ];

  constructor() {
    super()
  }

  /**
   * Gets called when we change one of the attributes of the component.
   * In this case, when the language is changed, it updates the class to change the syntax highlighting.
   * 
   * @param   { string }  name      The name of the attribute. 
   * @param   { stirng }  oldValue  The old value of the attribute.
   * @param   { string }  newValue  The new value of the attribute.
   */
  attributeChangedCallback(name, oldValue, newValue) {

    // The language specified for syntax highlighting has changed
    if(name == 'language') {

      // Remove the original classes
      let classesToRemove = [];
      
      for(let i = 0; i < this.code.classList.length; i++)
        if(this.code.classList[i].includes('language'))
          classeToRemove.push(this.code.classList[i]);

      if(classesToRemove.length)
        this.code.classList.remove(...classesToRemove);
      
      // Update the classnames
      this.code.classList.add('language-' + newValue);
    }
  }

  init() {
    super.init();

    // Editor class
    this.classList.add('editor');

    // Define the underlying structure
    this.pre = document.createElement('pre');
    this.code = document.createElement('code');

    // Enable Python syntax highlighting
    this.code.contentEditable = true;
    this.setAttribute('language', 'python');
    this.setAttribute('spellcheck', false);

    // Construct the DOM 
    this.pre.appendChild(this.code);
    this.appendChild(this.pre);

    // Do the highlighting
    hljs.highlightAll();

    // Event listener for when editing
    this.addEventListener('keydown', this.keydown);
    this.addEventListener('focusout', this.focusout);
  }

  /**
   * The event listener for key presses.
   * 
   * @param   { event }   e   The event object. 
   */
  keydown(e) {

    // So we can put tab characters
    if(e.keyCode == 9)
      e.preventDefault();

    // this.code.setAttribute('data-highlighted', false)
    this.code.removeAttribute('data-highlighted');
  }
  
  focusout(e) {
    hljs.highlightElement(this.code);
  }

}

// Enable syntax highlighting
hljs.configure({
  ignoreUnescapedHTML: true,
})

// Register the element
customElements.define('editor-component', EditorComponent);

export default {
  EditorComponent
}