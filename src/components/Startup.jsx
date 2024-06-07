import * as React from "react";

// Chakra
import { Card, CardBody, CardHeader, CardFooter } from '@chakra-ui/react'
import { Heading, Text, Highlight } from '@chakra-ui/react' 
import { Button, ButtonGroup } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'

// Custom
import { DCardHeader } from "./base/DCardHeader.jsx";
import { DCardBody } from "./base/DCardBody.jsx";
import { DCardFooter } from "./base/DCardFooter.jsx";
import { FilePicker } from "./FilePicker.jsx";
import { FileTable } from "./FileTable.jsx"

/**
 * The startup component contains the prompt we give to the user.
 * It asks them to select a folder or file before we begin the datavis.
 * 
 * @component 
 */
export function Startup() {
  return (
    <Card className="startup" px="0.5em" pt="0.25em">
      <DCardHeader className="startup-title" text="dataviser" />

      <DCardBody className="startup-content">
        <Box>
          <Text pt='0.75em' fontSize='xs' lineHeight='1.75em'>
            To get started, select a folder containing any number of data files.
          </Text>
          <br />

          <FilePicker type="folder" />
          <br />
        </Box>
          
        <FileTable />
      </DCardBody>
      
      <DCardFooter></DCardFooter>
    </Card>
  )
}