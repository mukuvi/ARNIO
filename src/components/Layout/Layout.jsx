import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header';

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
    </div>
  );
}