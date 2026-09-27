import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Layout } from '../components/Layout';
import { Team } from '../pages/Team';
import '../index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Layout>
      <Team />
    </Layout>
  </StrictMode>
);
