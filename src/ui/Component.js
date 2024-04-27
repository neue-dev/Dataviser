/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-23 09:03:20
 * @ Modified time: 2024-04-28 00:50:01
 * @ Description:
 * 
 * This acts as a base class for all other components we might define.
 */

import './Component.css'

/**
 * The base class for all other UI components we have.
 * 
 * @class
 */
export class Component extends HTMLElement {
  static observedAttributes = [];
  isInitted = false;
  childrenQueue = [];

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

    // Append the children we queued up
    this.appendChildren();
  }

  /**
   * Appends a component.
   * This allows us to do this even before the element exists in the DOM.
   * 
   * @param   { HTMLElement }   element   The element to append.
   */
  appendComponent(element) {

    // If it hasn't been initted, queue it up for pushing
    if(!this.isInitted)
      return this.childrenQueue.push(element);

    // Otherwise, just append it already
    this.appendChild(element);
  }

  /**
   * Appends all the children in the queue to the parent.
   */
  appendChildren() {
    for(let i = 0; i < this.childrenQueue.length; i++)
      this.appendChild(this.childrenQueue[i]);
    this.childrenQueue = [];
  }
}

export default {
  Component
}