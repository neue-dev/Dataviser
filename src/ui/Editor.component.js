/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-28 17:33:26
 * @ Modified time: 2024-04-28 17:39:36
 * @ Description:
 * 
 * This class defines an HTMLElement with an editable field.
 * This is useful for stuff like editable code.
 */

import './EditorComponent.css'
import { Component } from './Component'

/**
 * An editable text field.
 * 
 * @class
 */
export class EditorComponent extends Component {
  static observedAttributes = [];

  constructor() {
    super()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    
  }

  init() {
    super.init();

    this.classList.add('editor');
  }
}

customElements.define('editor-component', EditorComponent);

export default {
  EditorComponent
}