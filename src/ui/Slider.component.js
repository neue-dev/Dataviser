/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-23 09:37:16
 * @ Modified time: 2024-04-28 00:50:51
 * @ Description:
 * 
 * The slider component.
 */

import './Slider.component.css'
import { Component } from './Component'

/**
 * A custom slider component.
 * 
 * @class
 */
export class SliderComponent extends Component {
  static observedAttributes = [ 'width', 'cur-thumb' ];
  static defaultWidth = 256;

  width = 0;
  minThumb = 0;
  curThumb = 0;
  maxThumb = 0;
  
  constructor() {
    super();
  }

  /**
   * The callback that gets called when we modify attributes.
   * 
   * @param   { string }  name      The name of the attribute. 
   * @param   { string }  oldValue  The old value of the attribute.
   * @param   { string }  newValue  The new value of the attribute.
   */
  attributeChangedCallback(name, oldValue, newValue) {
    
    // Update the slider size
    if(name == 'width') {
      let oldWidth = parseInt(oldValue);
      let width = parseInt(newValue);
      let height = width / 8;
      let border = height / 2;

      // Set the parameters
      this.width = width;
      this.minThumb = 0;
      this.maxThumb = width;
      this.curThumb *= newValue / oldValue;

      // Set the thumb to the leftmost on startup
      if(!this.curThumb) 
        this.curThumb = border;

      // Change the style based on the width
      this.style.width = width + border * 2 + 'px';
      this.style.height = height + 'px';
      this.thumbElement.style.marginLeft = this.curThumb - height + 'px';
      this.thumbElement.style.transform = 'translateX(' + border + 'px)';
    }

    // Update the slider location
    if(name == 'cur-thumb') {

      // Change the current location of the slider thumb
      let curThumb = parseInt(newValue);
      let height = parseInt(this.style.height);
      let border = height / 2;

      // Compute the current thumb location
      this.curThumb = Math.max(Math.min(curThumb, this.maxThumb), this.minThumb);

      // Update the UI based on the changes
      this.thumbElement.style.marginLeft = this.curThumb - border + 'px';
    }
  }

  /**
   * Initializes the slider.
   */
  init() {
    super.init();

    // Define the classes
    this.classList.add('slider-component');

    // Construct the slider
    this.trackElement = document.createElement('div');
    this.thumbElement = document.createElement('div');

    this.trackElement.classList.add('slider-component-track');
    this.thumbElement.classList.add('slider-component-thumb');

    // Set the width of the slider
    this.setAttribute('width', SliderComponent.defaultWidth);

    // Append the elements
    this.trackElement.appendChild(this.thumbElement);
    this.appendChild(this.trackElement);

    // Add the event listeners
    this.addEventListener('mousedown', this.mouseDown);
  }

  /**
   * Gets called when the user clicks on the slider.
   * 
   * @param   { event }   e   The event object. 
   */
  mouseDown(e) {
    this.setAttribute('cur-thumb', e.clientX - this.getBoundingClientRect().left);

    if(this.mouseDownCallback)
      this.mouseDownCallback(e);
  }

  /**
   * Returns the current value of the slider (from 0 to 1).
   * @return 
   */
  getValue() {
    return (this.curThumb - this.minThumb) / (this.maxThumb - this.minThumb);
  }
}

// Register the element
customElements.define('slider-component', SliderComponent);

export default {
  SliderComponent
}