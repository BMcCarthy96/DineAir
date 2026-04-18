import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import configureStore from './store';
import { restoreCSRF, csrfFetch } from './store/csrf';
import * as sessionActions from './store/session';
import { ThemeProvider } from "./context/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";
import { logViteEnvInDevelopment } from "./utils/viteEnvDebug";

logViteEnvInDevelopment();

const store = configureStore();

// Always fetch a fresh CSRF token so POST mutations work in all environments.
// In production the HTML route sets XSRF-TOKEN, but browser cache can skip that.
restoreCSRF();

if (import.meta.env.MODE !== 'production') {
  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <Provider store={store}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);
