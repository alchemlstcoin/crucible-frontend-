import React from 'react';
import ReactDOM from 'react-dom';
import { Web3ReactProvider } from '@web3-react/core';
import App from 'App';
import reportWebVitals from 'reportWebVitals';
import theme from 'config/theme';
import { ChakraProvider } from '@chakra-ui/react';
import { GlobalStyles } from 'styles/global-styles';
import { Global } from '@emotion/react';
import { ethers } from 'ethers';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from 'store/store';
import 'focus-visible/dist/focus-visible';

function getLibrary(provider: any) {
  return new ethers.providers.Web3Provider(provider);
}

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <ReduxProvider store={store}>
        <ChakraProvider theme={theme}>
          <Global styles={GlobalStyles} />
          <App />
        </ChakraProvider>
      </ReduxProvider>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
