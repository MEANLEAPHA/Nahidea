import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {AuthProvider} from "./assets/context/AuthContext.jsx";
import {NotificationProvider} from "./assets/context/NotificationContext.jsx";
import {RankingProvider} from "./assets/context/RankContext.jsx";
import App from './App.jsx'


const main = document.getElementById('root');
const root = createRoot(main);

root.render(
  <StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <RankingProvider>
          <App />
        </RankingProvider>
      </NotificationProvider>
    </AuthProvider>
  </StrictMode>
);
