/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-23 16:21:09
 * @ Modified time: 2024-04-28 00:52:02
 * @ Description:
 * 
 * The grid class.
 */

import './Grid.component.css'
import { Component } from './Component'

/**
 * This component basically acts as a manager for the cell component defined below.
 * It is only through this component that we can modify the cell components.
 * 
 * @class
 */
export class GridComponent extends Component {
  cells = {};

  constructor() {
    super();
  }

  init() {
    super.init();

    this.classList.add('grid');
  }

  /**
   * Returns the cell located at the coordinates specified.
   * 
   * @param   { number }  x   The x-location of the cell. 
   * @param   { number }  y   The y-location of the cell.
   */
  getCell(x, y) {
    if(this.cells[x][y])
      return this.cells[x][y]
    return null;
  }

  /**
   * Creates a new grid cell at the specified location with the specified dimensions.
   * 
   * @param   { number }  x   The x-location of the cell. 
   * @param   { number }  y   The y-location of the cell.
   * @param   { number }  w   The width of the cell.
   * @param   { number }  h   The height of the cell.
   */
  appendCell(x=1, y=1, w=1, h=1) {

    // Duplicate cells not allowed
    if(this.cells[x][y])
      return;

    // Create the component and configure it
    const gridCellComponent = new GridCellComponent();
    
    gridCellComponent.setPlacement(x, y);
    gridCellComponent.setDimensions(w, h);

    // Queue it for appending
    this.appendComponent(gridCellComponent);

    // Save it in the dict
    this.cells[x][y] = gridCellComponent;
  }
}

/**
 * Note that the methods of this component must not be accessed directly.
 * The component can only be modified, created and deleted through the above component.
 * This ensures the robustness of our UI.
 * 
 * @class
 */
export class GridCellComponent extends Component {
  static observedAttributes = [ 'cell-x', 'cell-y', 'cell-w', 'cell-h' ];

  x = 1;
  y = 1;
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

    // Remove the cell from the old location
    this.parentElement.cells[this.x][this.y] = null;

    if(name == 'cell-x') this.x = parseInt(newValue);
    if(name == 'cell-y') this.y = parseInt(newValue);
    if(name == 'cell-w') this.w = parseInt(newValue);
    if(name == 'cell-h') this.h = parseInt(newValue);

    // Store the cell from in the new location
    this.parentElement.cells[this.x][this.y] = this;

    // Update the style
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

    // Remove old classes
    let classeToRemove = [];
    for(let i = 0; i < this.classList.length; i++)
      if(this.classList[i].includes('grid-cell'))
        classeToRemove.push(this.classList[i]);

    // Define the classes
    this.classList.remove(...classeToRemove);
    this.classList.add('grid-cell');
    this.classList.add('grid-cell-x' + this.x);
    this.classList.add('grid-cell-y' + this.y);
    this.classList.add('grid-cell-w' + this.w);
    this.classList.add('grid-cell-h' + this.h);

    // Define the styles
    this.style.left = `calc(${this.x - 1} * var(--root-cell-width) + ${this.x - 1} * var(--root-border-size))`;
    this.style.top = `calc(${this.y - 1} * var(--root-cell-height) + ${this.y - 1} * var(--root-border-size))`;
    this.style.width = `calc(${this.w} * var(--root-cell-width) + ${this.w - 1} * var(--root-border-size))`;
    this.style.height = `calc(${this.h} * var(--root-cell-height) + ${this.h - 1} * var(--root-border-size))`;
  }
}

// Register the custom elements
customElements.define('grid-component', GridComponent);
customElements.define('grid-cell-component', GridCellComponent);

export default {
  GridComponent,
  GridCellComponent,
}