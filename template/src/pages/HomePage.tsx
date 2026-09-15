import { useDocumentTitle } from '@/hooks/useDocumentTitle';

import { appConfig } from '@/app/config';
import { Container } from '@/components/layout/Container';

import styles from './HomePage.module.css';

/** Renders the neutral start page intended to be replaced by the first product route. */
export default function HomePage() {
  useDocumentTitle(appConfig.name);

  return (
    <Container as="section" className={styles.hero}>
      <p className={styles.eyebrow}>React · TypeScript · Vite</p>
      <h1>{appConfig.name}</h1>
      <p>{appConfig.description}</p>
      <p className={styles.hint}>
        Replace this neutral start page with the first route of your application.
      </p>
    </Container>
  );
}
