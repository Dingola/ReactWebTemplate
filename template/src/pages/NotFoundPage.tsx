import { Link } from 'react-router-dom';

import { appConfig } from '@/app/config';
import { Container } from '@/components/layout/Container';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

/** Renders the fallback page for URLs that do not match an application route. */
export default function NotFoundPage() {
  useDocumentTitle(`Page not found · ${appConfig.name}`);

  return (
    <Container as="section">
      <h1>Page not found</h1>
      <p>The requested page does not exist.</p>
      <Link to="/">Return to the start page</Link>
    </Container>
  );
}
