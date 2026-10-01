import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Layout } from '../components/Layout';
import { MentionsLegales } from '../pages/MentionsLegales';
import '../index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Layout>
      <MentionsLegales />
    </Layout>
  </StrictMode>
);
