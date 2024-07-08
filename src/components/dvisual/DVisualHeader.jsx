/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-09 06:02:49
 * @ Modified time: 2024-07-09 06:10:02
 * @ Description:
 * 
 * The visual header.
 */

import * as React from 'react'

// Chakra
import { Divider, Flex, Heading, Spacer, Text, VStack } from '@chakra-ui/react';

// Custom contexts and components
import { DVisualCtx } from './DVisual.ctx'
import { DVisualButtons } from './DVisualButtons.jsx'

/**
 * Defines the header of a visualization.
 * 
 * @component
 */
export const DVisualHeader = function(props={}) {

  // Get the state of the visual
  const _dvisualState = DVisualCtx.useCtx();
  const _title = _dvisualState.get('title');
  const _subtitle = _dvisualState.get('subtitle');

  return (
    <VStack align="left">
      <Flex>
        <VStack p="0" m="0" mr="1em" spacing="0" align="left">
          <_DVisualTitle text={ _title } />
          <_DVisualSubtitle text={ _subtitle } />
        </VStack>
        <Spacer />
        <DVisualButtons />
      </Flex>
      <Divider />
    </VStack> 
  );
}

/**
 * The title component for a given visualization.
 * 
 * @component
 */
const _DVisualTitle = function(props={}) {
  const _text = props.text ?? '';

  return (
    <b><Heading fontSize="1rem">
      { _text }
    </Heading></b>
  )
}

/**
 * The subtitle component for a given visualization
 * 
 * @component
 */
const _DVisualSubtitle = function(props={}) {
  const _text = props.text ?? '';

  return (
    <Text fontSize="0.5rem">
      { _text }
    </Text>
  )
}
