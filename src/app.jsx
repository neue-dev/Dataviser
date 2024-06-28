/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-05 16:55:08
 * @ Modified time: 2024-06-28 21:01:51
 * @ Description:
 * 
 * The main app file.
 */

import * as React from 'react';
import { createRoot } from 'react-dom/client';

// Chakra
import { ChakraProvider } from '@chakra-ui/react';
import { Container } from '@chakra-ui/react'

// Redux
import { Provider } from 'react-redux';
import { store } from './data/store.js'

// Custom
import { Dataviser } from './components/Dataviser.jsx'

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
root.render(
  <Provider store={ store }>
    <App />
  </Provider>
);