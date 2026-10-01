import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Layout } from '../components/Layout';
import { Confidentialite } from '../pages/Confidentialite';
import '../index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Layout>
      <Confidentialite />
    </Layout>
  </StrictMode>
);
