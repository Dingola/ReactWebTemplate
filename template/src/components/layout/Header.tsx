import { Link } from 'react-router-dom';

import { appConfig } from '@/app/config';
import { ThemeToggle } from '@/features/theme/ThemeToggle';

import { Container } from './Container';
import styles from './Header.module.css';

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
