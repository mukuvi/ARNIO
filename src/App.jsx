import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { DocumentProvider } from './context/DocumentContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Authenticate from './pages/Authenticate';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Pro from './pages/Pro';
import API from './pages/API';
import { NotFound } from './pages/NotFound';
import { Toaster } from 'react-hot-toast';

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
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </DocumentProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;