import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import App from './App';
import './index.css';
import './satoshi.css';
import { msalConfig } from './config/msalConfig';
import { store, persistor } from './store/store';
import Loader from './common/Loader';
import { ThemeStyleProvider } from './context/ThemeStyleContext';

// Crear instancia de MSAL
const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<Loader />} persistor={persistor}>
        <MsalProvider instance={msalInstance}>
          <ThemeStyleProvider>
            <Router>
              <App />
            </Router>
          </ThemeStyleProvider>
        </MsalProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
