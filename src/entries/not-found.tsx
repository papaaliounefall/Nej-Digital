import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Layout } from '../components/Layout';
import { NotFound } from '../pages/NotFound';
import '../index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Layout>
      <NotFound />
    </Layout>
  </StrictMode>
);
