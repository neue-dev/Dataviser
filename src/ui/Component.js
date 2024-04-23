/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-23 09:03:20
 * @ Modified time: 2024-04-23 10:50:52
 * @ Description:
 * 
 * This acts as a base class for all other components we might define.
 */

export class Component extends HTMLElement {
  static observedAttributes = [];
  isInitted = false;

  constructor() {
    super();
  }

  /**
   * This gets called when the element gets added to the DOM.
   * Note that the timeout is present to let the DOM solidify before any modifications are made to it by init().
   */
  connectedCallback() {
    if(!this.isInitted)
      setTimeout(() => this.init());
    this.isInitted = true;
  }

  /**
   * The init function.
   */
  init() {
    this.classList.add('component');
  }
}

export default {
  Component
}