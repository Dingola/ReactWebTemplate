import { Container } from '@/components/layout/Container';

import { appConfig } from '../config';
import styles from './Footer.module.css';

/** Renders the application-wide footer with the current year and application name. */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        © {new Date().getFullYear()} {appConfig.name}
      </Container>
    </footer>
  );
}
