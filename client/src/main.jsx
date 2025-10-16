import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { FormStepProvider } from './contexts/FormStepContext.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient({
  queries: {
    staleTime: 0,
    duration:5000
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      <FormStepProvider>
        <Toaster position='top-center' gutter={12} />
        <App />
      </FormStepProvider>
    </QueryClientProvider>
  </StrictMode>
);
