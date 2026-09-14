import { appConfig } from '@/app/config';

import { Container } from './Container';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        © {new Date().getFullYear()} {appConfig.name}
      </Container>
    </footer>
  );
}
