import { Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/auth/Register/Register";
import Login from "./pages/auth/Login/Login";

import Dashboard from "./pages/Dashboard/Dashboard";
import CreateEvent from "./pages/Events/CreateEvent/CreateEvent";
import Events from "./pages/Events/Events/Events";
import EventDetails from "./pages/EventDetails/EventDetails";
import DashboardLayout from "./layouts/DashboardLayout/DashboardLayout";
import Favorites from "./pages/Favorites/Favorites";
import MyTickets from "./pages/MyTickets/MyTickets";
import Analytics from "./pages/Analytics/Analytics";
import Messages from "./pages/Messages/Messages";
import Settings from "./pages/Settings/Settings";

import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Dashboard Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/tickets" element={<MyTickets />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
