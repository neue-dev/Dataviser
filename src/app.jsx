/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-05 16:55:08
 * @ Modified time: 2024-07-09 13:29:15
 * @ Description:
 * 
 * The main app file.
 */

import * as React from 'react';
import { createRoot } from 'react-dom/client';

// Chakra
import { ChakraProvider } from '@chakra-ui/react';

// Redux
import { Provider } from 'react-redux';
import { store } from './store/store.js'

// Custom
import { Dataviser } from './components/Dataviser.jsx'

// A wrapper component for our app
function App() {
  return (
    <ChakraProvider>
      <Dataviser />
    </ChakraProvider>
  );
}

// Render the component into the DOM
const root = createRoot(document.getElementById('root'));

// We have to make sure our components have access to the redux store
root.render(
  <Provider store={ store }>
    <App />
  </Provider>
);