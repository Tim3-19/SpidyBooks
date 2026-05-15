import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../Loader/Loader';
import { motion } from 'framer-motion';
import { Users, BookOpen, CircleDollarSign, Clock, Settings, ShieldAlert } from 'lucide-react';

import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/admin/stats", { headers });
        setStatsData(response.data.data);
        
        const settingsRes = await axios.get("http://localhost:5000/api/v1/settings");
        if (settingsRes.data && settingsRes.data.data) {
          setMaintenanceMode(settingsRes.data.data.maintenanceMode);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="h-[60vh] flex items-center justify-center"><Loader /></div>;
  }

  const statCards = [
    { title: "Total Users", value: statsData?.totalUsers || 0, icon: <Users size={24} className="text-blue-400" />, bg: "bg-blue-400/10 border-blue-400/20", link: "/admin/users" },
    { title: "Total Books", value: statsData?.totalBooks || 0, icon: <BookOpen size={24} className="text-green-400" />, bg: "bg-green-400/10 border-green-400/20", link: "/admin/books" },
    { title: "Delivered Revenue", value: `₹${statsData?.totalRevenue || 0}`, icon: <CircleDollarSign size={24} className="text-yellow-400" />, bg: "bg-yellow-400/10 border-yellow-400/20", link: "/admin/revenue" },
    { title: "Pending Orders", value: statsData?.pendingOrdersCount || 0, icon: <Clock size={24} className="text-orange-400" />, bg: "bg-orange-400/10 border-orange-400/20", link: "/admin/pending-orders" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const toggleMaintenance = async () => {
  // 1. Optimistic UI (Optional): You could disable the button here to prevent double-clicks
  try {
    const newMode = !maintenanceMode;
    
    // 2. Use an environment variable for your URL
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    
    const res = await axios.put(
      `${API_URL}/api/v1/settings/maintenance`, 
      { maintenanceMode: newMode }, 
      { headers }
    );

    // 3. Update local state
    setMaintenanceMode(res.data.data.maintenanceMode);

    // 4. Global Event
    window.dispatchEvent(new Event('maintenanceChanged'));

    // 5. Replace alert with a console log or a toast for better UX
    console.log(`Maintenance set to: ${newMode}`);
    
  } catch (err) {
    console.error("Maintenance Toggle Error:", err);
    // Provide a clear fallback error message
    const errorMsg = err.response?.data?.message || "Server connection failed";
    alert(`Error: ${errorMsg}`);
  }
};

  return (
    <div className="text-zinc-100 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-zinc-800 pb-4 gap-4">
        <h1 className="text-3xl font-bold text-yellow-100">App Health Overview</h1>
        
        {/* Maintenance Mode Toggle */}
        <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${maintenanceMode ? 'bg-red-500/10 border-red-500/30' : 'bg-zinc-900 border-zinc-800'}`}>
          <ShieldAlert className={maintenanceMode ? 'text-red-400' : 'text-zinc-500'} size={20} />
          <span className={`font-semibold ${maintenanceMode ? 'text-red-400' : 'text-zinc-400'}`}>
            Maintenance Mode
          </span>
          <button 
            onClick={toggleMaintenance}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${maintenanceMode ? 'bg-red-500' : 'bg-zinc-600'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {statCards.map((stat, idx) => (
          <motion.div 
            key={idx}
            variants={itemVariants}
          >
            <Link to={stat.link} className={`p-6 rounded-2xl border backdrop-blur-md flex items-center gap-4 shadow-lg hover:scale-[1.05] transition-transform block ${stat.bg}`}>
              <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                {stat.icon}
              </div>
              <div>
                <p className="text-zinc-400 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-zinc-100 mt-1">{stat.value}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-yellow-500 mb-6 flex items-center gap-2">
            <Clock size={20} /> Recent Orders
          </h2>
          {statsData?.recentOrders?.length === 0 ? (
             <p className="text-zinc-500 text-center py-4">No recent orders</p>
          ) : (
            <div className="space-y-4">
              {statsData?.recentOrders?.map(order => (
                <div key={order._id} className="flex justify-between items-center p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                  <div>
                    <p className="font-medium text-zinc-200">{order.book?.title || "Unknown Book"}</p>
                    <p className="text-sm text-zinc-500">by {order.user?.username || "Unknown User"}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.orderstatus === "Delivered" ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                    order.orderstatus === "Cancelled" ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                    order.orderstatus === "Out for delivery" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" :
                    "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  }`}>
                    {order.orderstatus}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Users */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-yellow-500 mb-6 flex items-center gap-2">
            <Users size={20} /> New Signups
          </h2>
          {statsData?.recentUsers?.length === 0 ? (
             <p className="text-zinc-500 text-center py-4">No recent users</p>
          ) : (
            <div className="space-y-4">
              {statsData?.recentUsers?.map(user => (
                <div key={user._id} className="flex items-center gap-4 p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                  <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full border border-zinc-700 object-cover" />
                  <div>
                    <p className="font-medium text-zinc-200">{user.username}</p>
                    <p className="text-sm text-zinc-500">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
