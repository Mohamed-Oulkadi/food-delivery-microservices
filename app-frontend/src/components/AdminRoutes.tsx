import { Route, Routes } from "react-router-dom";
import { AdminPage } from "../pages/AdminPage";
import { DashboardView } from "../pages/admin/DashboardView";
import { ClientsView } from "../pages/admin/ClientsView";
import { RestaurantsView } from "../pages/admin/RestaurantsView";
import { LivreursView } from "../pages/admin/LivreursView";
import { AdminProvider } from "../contexts/AdminProvider";

export const AdminRoutes = () => {
  return (
    <AdminProvider>
      <Routes>
        <Route path="/" element={<AdminPage />}>
          <Route path="dashboard" element={<DashboardView />} />
          <Route path="clients" element={<ClientsView />} />
          <Route path="restaurants" element={<RestaurantsView />} />
          <Route path="livreurs" element={<LivreursView />} />
        </Route>
      </Routes>
    </AdminProvider>
  );
};