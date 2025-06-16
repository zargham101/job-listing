import React from 'react';
import LayoutStyles from './Layout.module.css';

const Layout = ({ children }) => {
  return (
    <div className={LayoutStyles.layout}>
      <header className={LayoutStyles.header}>
        <h1>Job Listings</h1>
      </header>
      <main className={LayoutStyles.main}>{children}</main>
      <footer className={LayoutStyles.footer}>
        <p>© {new Date().getFullYear()} Job Board</p>
      </footer>
    </div>
  );
};

export default Layout;