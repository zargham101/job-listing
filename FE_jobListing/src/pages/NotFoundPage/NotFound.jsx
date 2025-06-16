import React from 'react';
import NotFoundPageStyles from './NotFoundPage.module.css';

const NotFoundPage = () => {
  return (
    <div className={NotFoundPageStyles.notFound}>
      <h2>404 - Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
};

export default NotFoundPage;