/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-23 08:59:53
 * @ Modified time: 2024-04-28 17:39:57
 * @ Description:
 * 
 * Defines a custom button element.
 */

import './Button.component.css'
import { Component } from './Component'

/**
 * A class for custom buttons.
 * 
 * @class
 */
export class ButtonComponent extends Component {

  constructor() {
    super();
  }

  /**
   * The init function.
   */
  init() {
    super.init();

    // Define the classnames
    this.classList.add('button');

    // Register event listeners
    this.addEventListener('mousedown', this.mouseDown);
  }

  /**
   * This gets called when the mouse clicks the element.
   */
  mouseDown(e) {
    if(this.mouseDownCallback)
      this.mouseDownCallback(e);
  }
}

// Register the element
customElements.define('button-component', ButtonComponent);

export default {
  ButtonComponent
}