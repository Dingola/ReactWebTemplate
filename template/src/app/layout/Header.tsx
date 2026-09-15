import { Link } from 'react-router-dom';

import { Container } from '@/components/layout/Container';

import { appConfig } from '../config';
import { ThemeToggle } from '../providers/theme/ThemeToggle';
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
