import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { DocumentProvider } from './context/DocumentContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './Pages/Home';
import Authenticate from './Pages/Authenticate';
import Dashboard from './Pages/Dashboard';
import Settings from './Pages/Settings';
import Pro from './Pages/Pro';
import API from './Pages/API';
import { NotFound } from './Pages/NotFound';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <DocumentProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Authenticate />} />
              <Route path="pro" element={<Pro />} />
              <Route path="api" element={<API />} />
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </DocumentProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;