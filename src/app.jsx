import { Dataviser } from './components/Dataviser.jsx'
import { ChakraProvider } from '@chakra-ui/react';
import { Container } from '@chakra-ui/react'
import { createRoot } from 'react-dom/client';
import * as React from 'react';

// A wrapper component for our app
function App() {
  return (
    <ChakraProvider>
      <Container className="dataviser-container" maxW="100vw" maxH="100vh" w="100vw" h="100vh" m="0" p="0">
        <Dataviser />
      </Container>
    </ChakraProvider>
  );
}

// Render the component into the DOM
const root = createRoot(document.getElementById('root'));
root.render(<App />);