import React from 'react';
import ReactDOM from 'react-dom/client';
//import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
//
console.log("#entry-client");
//
const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
