import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar'; // Ensure this is used if needed
import SearchBar from './SearchBar';
import './App.css';

const ArticleList = lazy(() => import('./ArticleList'));
const ArticleDetail = lazy(() => import('./ArticleDetail'));
const SearchResults = lazy(() => import('./SearchResults'));
const AllArticles = lazy(() => import('./AllArticles'));
const LoginScreen = lazy(() => import('./LoginScreen'));
const AllHistory = lazy(() => import('./AllHistory'));

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

function MainContent() {
  const location = useLocation();

  return (
    <div className="app-container">
      <ConditionalSidebar />
      <div className={location.pathname === '/login'? "login-main-content":"main-content"}>
        <ConditionalSearchBar />
        <Suspense fallback={<div className='display-flex'>
            <svg height="200" width="200">
            <circle id="c3" cx="100" cy="100" r="50" stroke="#3474ef" stroke-width="5" fill="transparent" />
            </svg>
          </div >}>
          <Routes>
            <Route path="/" element={<ArticleList />} />
            <Route path="/articles/:id" element={<ArticleDetail />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/allarticles" element={<AllArticles />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/history" element={<AllHistory />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

function ConditionalSidebar() {
  const location = useLocation();
  const isLoginRoute = location.pathname === '/login';

  return !isLoginRoute ? <Sidebar /> : null;
}

function ConditionalSearchBar() {
  const location = useLocation();
  const isLoginRoute = location.pathname === '/login';

  return !isLoginRoute ? <SearchBar /> : null;
}

export default App;