import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Home from './pages/Home'
import Facilities from './pages/Facilities'
import Trainers from './pages/Trainers'
import Plans from './pages/Plans'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import MyMembership from './pages/MyMembership'
import NotFound from './pages/NotFound'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminTrainers from './pages/admin/AdminTrainers'
import AdminFacilities from './pages/admin/AdminFacilities'
import AdminPlans from './pages/admin/AdminPlans'
import AdminMemberships from './pages/admin/AdminMemberships'
import AdminEnquiries from './pages/admin/AdminEnquiries'

export default function App() {
  const location = useLocation()
  // Hide Navbar/Footer on admin routes — AdminLayout has its own sidebar nav
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      {!isAdminRoute && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/trainers" element={<Trainers />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected (user) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/my-membership" element={<MyMembership />} />
          </Route>

          {/* Admin */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="trainers" element={<AdminTrainers />} />
              <Route path="facilities" element={<AdminFacilities />} />
              <Route path="plans" element={<AdminPlans />} />
              <Route path="memberships" element={<AdminMemberships />} />
              <Route path="enquiries" element={<AdminEnquiries />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  )
}
