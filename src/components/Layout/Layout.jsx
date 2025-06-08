import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header';
import { Toaster } from 'react-hot-toast';

export default function Layout() {
  const location = useLocation();
  const hideHeaderRoutes = ['/login'];
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {shouldShowHeader && <Header />}
      <main className={shouldShowHeader ? 'pt-0' : ''}>
        <Outlet />
      </main>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#4ade80',
            },
          },
          error: {
            duration: 4000,
            theme: {
              primary: '#ef4444',
            },
          },
        }}
      />
    </div>
  );
}