import { Outlet } from 'react-router-dom';

import styles from './App.module.css';
import { Footer } from './layout/Footer';
import { Header } from './layout/Header';

/**
 * Provides the persistent application shell shared by all routes.
 *
 * The header and footer remain mounted while `Outlet` renders the page selected by
 * the current route.
 */
export function App() {
  return (
    <div className={styles.app}>
      {/* Allows keyboard users to bypass the primary navigation. */}
      <a className={styles.skipLink} href="#main-content">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className={styles.main} tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
