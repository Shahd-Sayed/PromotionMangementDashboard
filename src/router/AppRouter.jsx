import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../Pages/Login";
import Dashboard from "../Pages/Dashboard";
import DashboardLayout from "../layouts/DashboardLayout";
import Category from "../Pages/Category";
import Product from "../Pages/Product";
import Promotion from "../Pages/promotion";
import ApplyPromotion from "../Pages/ApplyPromotion";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
        <Route path="adminDashboard" element={<Dashboard />} />
        <Route path="category" element={<Category />} />
        <Route path="product" element={<Product />} />
        <Route path="promotion" element={<Promotion />} />
        <Route
          path="applyPromotion/:promotionId"
          element={<ApplyPromotion />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default AppRouter;
