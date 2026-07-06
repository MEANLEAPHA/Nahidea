import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {AuthProvider} from "./assets/context/AuthContext.jsx";
import {NotificationProvider} from "./assets/context/NotificationContext.jsx";
import App from './App.jsx'


const main = document.getElementById('root');
const root = createRoot(main);

root.render(
  <StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </AuthProvider>
  </StrictMode>
);
