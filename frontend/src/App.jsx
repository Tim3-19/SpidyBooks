import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'

import Home from './pages/Home'
import Navbar from './componenets/Navbar/Navbar'
import Footer from './componenets/Footer/Footer'
import AllBooks from './pages/AllBooks'
import LogIn from './pages/LogIn'
import SignUp from './pages/SignUp'
import Cart from './pages/Cart'
import BookDetails from './componenets/ViewDetails/BookDetails'
import Profile from './pages/Profile'
import Favourite from './componenets/Profile/Favourite'
import UserOrderHistory from './componenets/Profile/UserOrderHistory'
import Settings from './componenets/Profile/Settings'
import Maintenance from './componenets/Maintenance'

// Admin Components
import AdminLayout from './componenets/Admin/AdminLayout'
import AdminDashboard from './componenets/Admin/AdminDashboard'
import AdminBooks from './componenets/Admin/AdminBooks'
import AdminOrders from './componenets/Admin/AdminOrders'
import AdminUsers from './componenets/Admin/AdminUsers'
import AdminRevenue from './componenets/Admin/AdminRevenue'
import AdminPendingOrders from './componenets/Admin/AdminPendingOrders'

const App = () => {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/settings");
        if (res.data && res.data.data) {
          setIsMaintenance(res.data.data.maintenanceMode);
        }
      } catch (err) {
        console.error("Failed to fetch settings", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
    // Poll every 30 seconds to auto-recover if maintenance is turned off
    const interval = setInterval(fetchSettings, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  // If maintenance mode is active and user is NOT an admin, lock them out
  if (isMaintenance && role !== "admin") {
    return <Maintenance />;
  }

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/all-books" element={<AllBooks />} />
        <Route path="/logIn" element={<LogIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/view-book-details/:id" element={<BookDetails />} />

        <Route path="/profile" element={<Profile />}>
          <Route index element={<Favourite />} />
          <Route path="orderHistory" element={<UserOrderHistory />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="books" element={<AdminBooks />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="revenue" element={<AdminRevenue />} />
          <Route path="pending-orders" element={<AdminPendingOrders />} />
          <Route path="profile" element={<Settings />} />
        </Route>
      </Routes>

      <Footer />
    </>
  )
}


export default App
