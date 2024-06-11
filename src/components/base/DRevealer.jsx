/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-11 19:04:06
 * @ Modified time: 2024-06-11 19:30:49
 * @ Description:
 * 
 * A button that reveals a side panel on hover.
 */

import * as React from 'react' 

// Chakra
import { Center } from '@chakra-ui/react'

// React Icons
import { GoChevronLeft } from '@react-icons/all-files/go/GoChevronLeft.js'
import { GoChevronRight } from '@react-icons/all-files/go/GoChevronRight.js'
import { GoChevronUp } from '@react-icons/all-files/go/GoChevronUp.js'
import { GoChevronDown } from '@react-icons/all-files/go/GoChevronDown.js'

/**
 * DRevealer component class.
 * 
 * @class
 */
export function DRevealer(props={}) {
  
  // The props
  const location = props.location ?? 'left';
  const orientation = props.orientation ?? 'right';
  const onHoverCallback = props.onHover ?? function(){};
  const onLeaveCallback = props.onLeave ?? function(){};

  // Define the style 
  const style = (() => {
    switch(location) {
      case 'left': return { width: '10vw', height: '100vh', position: 'fixed', top: 0, left: 0 }
      case 'right': return { width: '10vw', height: '100vh', position: 'fixed', top: 0, right: 0 }
      case 'up': return { width: '100vw', height: '10vh', position: 'fixed', top: 0, left: 0 }
      case 'down': return { width: '100vw', height: '10vh', position: 'fixed', bottom: 0, left: 0 }
    }
  })();

  // Define the inner elements
  const Arrow = (() => {
    switch(orientation) {
      case 'left': return GoChevronLeft
      case 'right': return GoChevronRight
      case 'up': return GoChevronUp
      case 'down': return GoChevronDown
    }
  })()

  /**
   * This function gets called when the mouse enters the component.
   * 
   * @param   { event }   e   The event object. 
   */
  function onHover(e) {
    onHoverCallback(e);
  }

  /**
   * This function gets called when the mouse leaves the component.
   * Note that it must first be in the component before it can leave it.
   * 
   * @param   { event }   e   The event object. 
   */
  function onLeave(e) {
    onLeaveCallback(e);
  }

  return (
    <div className="drevealer"
      
      // Component styling
      style={ style }
      
      // Component callbacks
      onMouseEnter={ onHover } 
      onMouseLeave={ onLeave }> 
      
      <Center width="100%" height="100%">
        <Arrow />
      </Center>
    </div>
  )
}

export default DRevealer;