import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { FormStepProvider } from './contexts/FormStepContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FormStepProvider>
      <App />
    </FormStepProvider>
  </StrictMode>
);
