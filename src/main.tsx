import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';
import './index.scss';

async function enableMocking() {
  const { worker } = await import('./__mocks/browser');

  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

function renderApp() {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

enableMocking()
  .catch((error) => {
    // Preview/E2E may block service workers; still mount the app.
    console.warn('MSW worker failed to start; continuing without mocks.', error);
  })
  .finally(() => {
    renderApp();
  });
