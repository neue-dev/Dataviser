import * as React from "react";

// Chakra
import { SimpleGrid } from '@chakra-ui/react'
import { FileTable } from './FileTable.jsx'

// Custom
import { Startup } from "./Startup.jsx";

export function Dataviser() {
  return (
    <SimpleGrid className="dataviser" columns="3" spacing="1rem" height="100%" p="2rem">
      <Startup />
    </SimpleGrid>
  )
}