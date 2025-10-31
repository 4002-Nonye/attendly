import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { FormStepProvider } from './contexts/FormStepContext.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: 1, // TODO: MAYBE INCREASE RETRY
      gcTime: 1000 * 60 * 10,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <FormStepProvider>
        <Toaster position='top-center' gutter={12} />
        <App />
      </FormStepProvider>
    </QueryClientProvider>
  </StrictMode>
);
