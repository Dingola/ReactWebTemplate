import { Link } from 'react-router-dom';

import { appConfig } from '@/app/config';
import { ThemeToggle } from '@/features/theme/ThemeToggle';

import { Container } from './Container';
import styles from './Header.module.css';

/** Renders the application-wide header, home link, and color-theme control. */
export function Header() {
  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <Link className={styles.brand} to="/" aria-label={`${appConfig.name} home`}>
          {appConfig.name}
        </Link>
        <ThemeToggle />
      </Container>
    </header>
  );
}
