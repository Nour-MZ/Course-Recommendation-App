import React from 'react';
import ReactDOM from 'react-dom/client';
import { UserProvider } from './UserContext';
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>,
  </React.StrictMode>
);

