import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage/Home';
import NotFoundPage from './pages/NotFoundPage/NotFound';
import AppStyles from './App.module.css';
function App() {
  return (
    <div className={AppStyles.app}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App;