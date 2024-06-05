import * as React from "react";

// Chakra
import { Card, CardBody, CardHeader, CardFooter } from '@chakra-ui/react'
import { Heading, Text, Highlight } from '@chakra-ui/react' 
import { Button, ButtonGroup } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'

// Custom
import { DCardHeader } from "./base/DCardHeader.jsx";
import { DCardBody } from "./base/DCardBody.jsx";
import { FilePicker } from "./utils/FilePicker.jsx";

/**
 * The startup component contains the prompt we give to the user.
 * It asks them to select a folder or file before we begin the datavis.
 * 
 * @component 
 */
export function Startup() {
  return (
    <Card className="startup" px="1em" pt="0.5em">
      <DCardHeader className="startup-title" text="dataviser"/>
      <DCardBody className="startup-content">
        <Box>
          <Text pt='0.75em' fontSize='sm'>
            Dataviser is a data visualization utility. To get started, select a folder containing any number of data files.
          </Text>
        </Box>

        <Box>
          <FilePicker type="folder" />
        </Box>
      </DCardBody>
    </Card>
  )
}