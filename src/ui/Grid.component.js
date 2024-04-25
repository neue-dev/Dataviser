/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-23 16:21:09
 * @ Modified time: 2024-04-25 22:47:54
 * @ Description:
 * 
 * The grid class.
 */

import './Grid.component.css'
import { Component } from './Component'

export class GridComponent extends Component {

  constructor() {
    super();
  }

  init() {
    super.init();

    this.classList.add('grid');
  }
}

export class GridCellComponent extends Component {
  static observedAttributes = [ 'cell-x', 'cell-y', 'cell-w', 'cell-h' ];

  x = 0;
  y = 0;
  w = 1;
  h = 1;

  constructor() {
    super();
  }

  /**
   * Initializes the grid cell.
   */
  init() {
    super.init();

    this.classList.add('grid-cell');
    this.updateStyle();
  }

  /**
   * Updates the parameters of the grid cell.
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if(name == 'cell-x') this.x = parseInt(newValue);
    if(name == 'cell-y') this.y = parseInt(newValue);
    if(name == 'cell-w') this.w = parseInt(newValue);
    if(name == 'cell-h') this.h = parseInt(newValue);

    this.updateStyle();
  }

  /**
   * Sets the placement of the cell on the grid.
   * 
   * @param   { number }  x   The x location on the grid. 
   * @param   { number }  y   The y location on the grid.
   */
  setPlacement(x, y) {
    this.setAttribute('cell-x', x);
    this.setAttribute('cell-y', y);    
  }

  /**
   * Sets the dimensions of the cell on the grid.
   * 
   * @param   { number }  w   The number of unit cells wide. 
   * @param   { number }  h   The number of unit cells high.
   */
  setDimensions(w, h) {
    this.setAttribute('cell-w', w);
    this.setAttribute('cell-h', h);
  }

  /**
   * Updates the style of the grid cell based on its attributes.
   */
  updateStyle() {
    let classeToRemove = [];
    for(let i = 0; i < this.classList.length; i++)
      if(this.classList[i].includes('grid-cell'))
        classeToRemove.push(this.classList[i]);

    this.classList.remove(...classeToRemove);
    this.classList.add('grid-cell');
    this.classList.add('grid-cell-x' + this.x);
    this.classList.add('grid-cell-y' + this.y);
    this.classList.add('grid-cell-w' + this.w);
    this.classList.add('grid-cell-h' + this.h);
  }
}

// Register the custom elements
customElements.define('grid-component', GridComponent);
customElements.define('grid-cell-component', GridCellComponent);

export default {
  GridComponent,
  GridCellComponent,
}