import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { Provider } from 'react-redux';
import {store} from "./state/session/session.store.ts";
import App from "./App.tsx";

const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <App/>
          </Provider>
      </QueryClientProvider>
  </StrictMode>,
)
