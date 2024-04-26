/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-26 13:32:19
 * @ Modified time: 2024-04-26 13:51:58
 * @ Description:
 * 
 * Defines an input component.
 */

import './Input.component.css'
import { Component } from './Component'

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

  keyDown(e) {
    
  }

  focus(e) {
    
  }

  init() {
    super.init();

    // Add the classes
    this.classList.add('input-component');
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