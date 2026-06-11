// Entry point: mounts the React app into the <div id="root"> in index.html.
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode runs extra development-only checks; it has no effect on
  // the built app.
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
