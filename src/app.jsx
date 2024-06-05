import { Dataviser } from './components/Dataviser.jsx'
import { ChakraProvider } from '@chakra-ui/react';
import * as React from 'react';
import { createRoot } from 'react-dom/client';

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
root.render(<App />);