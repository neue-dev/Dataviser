/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-25 17:44:22
 * @ Modified time: 2024-07-25 17:59:47
 * @ Description:
 * 
 * Represents how we get user input through dvisuals.
 */

import * as React from 'react'

// Chakra
import { Heading, Text } from '@chakra-ui/react'
import { Divider, Flex, VStack } from '@chakra-ui/react'

/**
 * A form component.
 * 
 * @component
 */
export function DForm(props={}) {

  // The form title and subtitle
  const _title = props.title ?? 'Form';
  const _subtitle = props.title ?? 'Fill in the necessary information.'

  return (<>
    <_DFormHeader title={ _title } subtitle={ _subtitle } />
  </>)
}

/**
 * The form header.
 * 
 * @component 
 */
function _DFormHeader(props={}) {

  // The title and subtitle
  const _title = props.title ?? 'Form';
  const _subtitle = props.title ?? 'Fill in the necessary information.'

  return (
    <VStack align="left">
      <Flex>
        <VStack p="0" m="0" mr="1em" spacing="0" align="left">
          <b><Heading fontSize="1rem">
            { _title }
          </Heading></b>
          <Text fontSize="0.5rem">
            { _subtitle }
          </Text>
        </VStack>
      </Flex>
      <Divider />
    </VStack>
  ) 
}