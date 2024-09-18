import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
// import ArticleList from './ArticleList';
// import ArticleDetail from './ArticleDetail';
import SearchBar from './SearchBar';
// import SearchResults from './SearchResults';
// import AllArticles from './AllArticles'; 
// import LoginScreen from './LoginScreen'; 
import './App.css';
// import AllHistory from './AllHistory';


const ArticleList = lazy(() => import('./ArticleList'));
const ArticleDetail = lazy(() => import('./ArticleDetail'));
const SearchResults = lazy(() => import('./SearchResults'));
const AllArticles = lazy(() => import('./AllArticles'));
const LoginScreen = lazy(() => import('./LoginScreen'));
const AllHistory = lazy(() => import('./AllHistory'));

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
         
          <ConditionalSearchBar /> 
          <Suspense fallback={<div>Loading...</div>}>
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
    </Router>
  );
}

function ConditionalSearchBar() {
  const location = useLocation();
  const isLoginRoute = location.pathname === '/login';

  return !isLoginRoute ? <SearchBar /> : null;
}

export default App;