import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { StateProvider } from './contexts/StateProvider';
import * as Sentry from '@sentry/browser';
import 'antd/dist/antd.css';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import * as reset from './styles/reset.css';
import * as global from './styles/global.css';
import { initialState } from './reducers/initialState';
import { mainReducer } from './reducers/mainReducer';


//enable Sentry only for production builds
if (process.env.NODE_ENV === 'production') {
  Sentry.init({ dsn: 
    'https://0ff73aa2b95c4b75b27ed6fff1c45dab@sentry.io/1728693' 
  });
}

const GlobalStyle = createGlobalStyle`
    ${reset}
    ${global}
    body{
        font-family: ${({ theme }) => theme.loraFont}
    }
`;

const theme = {
  primaryColor: 'blue',
  secondaryColor: 'green',
  borderRadiusDefault: '10px',
};

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <>
      <GlobalStyle />
      <StateProvider initialState={initialState} reducer={mainReducer}>
        <Router>
          <App />
        </Router>
      </StateProvider>
    </>
  </ThemeProvider>,
  document.getElementById('root')
);
