import { Routes, Route, Navigate } from 'react-router-dom';
import {
  DashboardView,
  ClientsView,
  RestaurantsView,
  LivreursView,
} from '../pages/AdminViews';
import { AdminLayout } from '../pages/AdminLayout';

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardView />} />
        <Route path="clients" element={<ClientsView />} />
        <Route path="restaurants" element={<RestaurantsView />} />
        <Route path="livreurs" element={<LivreursView />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
};

