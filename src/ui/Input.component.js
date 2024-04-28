/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-26 13:32:19
 * @ Modified time: 2024-04-28 17:40:25
 * @ Description:
 * 
 * Defines an input component.
 */

import './Input.component.css'
import { Component } from './Component'

/**
 * A class for custom input fields.
 * Note that we use contenteditable=true to make this work.
 * 
 * @class
 */
export class InputComponent extends Component {
  static observedAttributes = [ 'contenteditable' ]
  
  constructor() {
    super();
  }

  /**
   * Gets called when we toggle the editability of the component.
   */
  attributeChangedCallback(name, oldValue, newValue) {
    // ! do somehing when made editable or smth
  }

  /**
   * Called when typing on the field.
   * 
   * @param   { event }   e   The event object. 
   */
  keyDown(e) {
    
    // Unfocus on enter and execute callback
    if(e.keyCode == 13) {
      if(this.submitCallback)
        this.submitCallback(e, this.textContent);

      return this.blur();
    }
    
    // Do some stuff when key pressed
    if(this.keyDownCallback)
      this.keyDownCallback(e, this.textContent);
  }

  /**
   * Called when the input field comes into focus.
   * 
   * @param   { event }   e   The event object. 
   */
  focus(e) {
    
  }

  init() {
    super.init();

    // Add the classes
    this.classList.add('input');
    this.setAttribute('contenteditable', true);
    this.setAttribute('spellcheck', false);

    // Add the pertinent event listeners
    this.addEventListener('keydown', this.keyDown);
    this.addEventListener('focus', this.focus);
  }
}

customElements.define('input-component', InputComponent);

export default {
  InputComponent,
}