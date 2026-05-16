import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../Loader/Loader';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPendingOrders = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/all-orders`, { headers });
        // Filter orders that are NOT delivered and NOT cancelled
        const pending = response.data.data.filter(order => order.orderstatus === "Order Placed" || order.orderstatus === "Out for delivery");
        setPendingOrders(pending);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="text-zinc-100">
      <div className="mb-8 border-b border-zinc-800 pb-4">
        <h1 className="text-3xl font-bold text-yellow-100">Pending Orders</h1>
        <p className="text-zinc-400 mt-2">Orders that are currently placed or out for delivery.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader /></div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-950 border-b border-zinc-800">
                  <th className="p-4 text-zinc-400 font-medium">Order ID</th>
                  <th className="p-4 text-zinc-400 font-medium">Customer Name</th>
                  <th className="p-4 text-zinc-400 font-medium">Book</th>
                  <th className="p-4 text-zinc-400 font-medium">Status</th>
                  <th className="p-4 text-zinc-400 font-medium text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingOrders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr 
                      className="border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors cursor-pointer"
                      onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                    >
                      <td className="p-4 font-mono text-sm text-zinc-500">{order._id.substring(0, 8)}...</td>
                      <td className="p-4 font-bold text-zinc-200">{order.user?.username || "Unknown User"}</td>
                      <td className="p-4 font-medium text-yellow-500">{order.book?.title || "Unknown Book"}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          order.orderstatus === "Out for delivery" 
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20" 
                          : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                        }`}>
                          {order.orderstatus}
                        </span>
                      </td>
                      <td className="p-4 text-center text-zinc-400 text-sm">
                        {expandedOrder === order._id ? "Collapse" : "Expand"}
                      </td>
                    </tr>
                    <AnimatePresence>
                      {expandedOrder === order._id && (
                        <motion.tr 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-zinc-900/50 border-b border-zinc-800/50"
                        >
                          <td colSpan="5" className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                                <h3 className="text-sm font-bold text-zinc-500 mb-3 uppercase">Shipping Details</h3>
                                <p className="mb-2"><span className="text-zinc-400">Email:</span> {order.user?.email}</p>
                                <p className="mb-2"><span className="text-zinc-400">Address:</span> {order.user?.address || "No address"}</p>
                                <p><span className="text-zinc-400">Ordered On:</span> {new Date(order.createdAt).toLocaleString()}</p>
                              </div>
                              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex items-center gap-4">
                                <img src={order.book?.url} alt="cover" className="w-16 h-24 object-cover rounded shadow" />
                                <div>
                                  <h3 className="font-bold text-zinc-200">{order.book?.title}</h3>
                                  <p className="text-sm text-zinc-500 mb-2">By {order.book?.author}</p>
                                  <p className="font-bold text-yellow-500">₹{order.book?.price}</p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
                {pendingOrders.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-zinc-500">No pending orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPendingOrders;
