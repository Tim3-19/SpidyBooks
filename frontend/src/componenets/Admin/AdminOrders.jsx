import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../Loader/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Eye, X } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State for Order Details
  const [selectedOrder, setSelectedOrder] = useState(null);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/all-orders`, { headers });
      setOrders(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/update-status/${orderId}`, { status: newStatus }, { headers });
      // Update local state directly to feel snappy
      setOrders(orders.map(order => order._id === orderId ? { ...order, orderstatus: newStatus } : order));
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Delivered": return "text-green-400 bg-green-500/10 border-green-500/20";
      case "Cancelled": return "text-red-400 bg-red-500/10 border-red-500/20";
      case "Out for delivery": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      default: return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    }
  };

  return (
    <div className="text-zinc-100 relative">
      <div className="mb-8 border-b border-zinc-800 pb-4">
        <h1 className="text-3xl font-bold text-yellow-100">Order Management</h1>
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
                  <th className="p-4 text-zinc-400 font-medium">Customer</th>
                  <th className="p-4 text-zinc-400 font-medium">Book</th>
                  <th className="p-4 text-zinc-400 font-medium">Date</th>
                  <th className="p-4 text-zinc-400 font-medium">Status</th>
                  <th className="p-4 text-zinc-400 font-medium text-center">Details</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4 font-mono text-sm text-zinc-500">{order._id.substring(0, 8)}...</td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-zinc-200">{order.user?.username || "Unknown"}</p>
                        <p className="text-xs text-zinc-500">{order.user?.email}</p>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-yellow-500">
                      {order.book?.title || "Unknown Book"} 
                      {order.quantity > 1 && <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">x{order.quantity}</span>}
                    </td>
                    <td className="p-4 text-zinc-400 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="relative inline-block w-40">
                        <select 
                          className={`w-full appearance-none outline-none border rounded-lg px-3 py-1.5 text-sm font-semibold cursor-pointer transition-colors ${getStatusColor(order.orderstatus)}`}
                          value={order.orderstatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        >
                          <option value="Order Placed" className="bg-zinc-900 text-yellow-400">Order Placed</option>
                          <option value="Out for delivery" className="bg-zinc-900 text-blue-400">Out for delivery</option>
                          <option value="Delivered" className="bg-zinc-900 text-green-400">Delivered</option>
                          <option value="Cancelled" className="bg-zinc-900 text-red-400">Cancelled</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <ChevronDown size={14} className="opacity-70" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-zinc-400 hover:text-yellow-400 bg-zinc-800/50 hover:bg-yellow-400/10 rounded-lg transition-colors inline-block"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-zinc-500">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="flex justify-between items-center p-6 border-b border-zinc-800 bg-zinc-950">
                <h2 className="text-xl font-bold text-yellow-500">Order Details</h2>
                <button onClick={() => setSelectedOrder(null)} className="text-zinc-400 hover:text-zinc-100 transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                  <img src={selectedOrder.book?.url} alt="book cover" className="w-16 h-24 object-cover rounded shadow-md" />
                  <div>
                    <h3 className="text-lg font-bold text-zinc-100">{selectedOrder.book?.title}</h3>
                    <p className="text-zinc-400 text-sm">By {selectedOrder.book?.author}</p>
                    <div className="flex gap-4 items-center mt-2">
                      <p className="text-yellow-500 font-bold">₹{selectedOrder.book?.price}</p>
                      <p className="text-zinc-400 text-sm bg-zinc-800 px-2 py-0.5 rounded">Qty: {selectedOrder.quantity || 1}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                  <h3 className="text-sm font-bold text-zinc-500 mb-3 uppercase tracking-wider">Customer Information</h3>
                  <div className="space-y-2">
                    <p><span className="text-zinc-400">Name:</span> <span className="font-medium">{selectedOrder.user?.username}</span></p>
                    <p><span className="text-zinc-400">Email:</span> <span className="font-medium">{selectedOrder.user?.email}</span></p>
                    <div className="mt-3 pt-3 border-t border-zinc-800/50">
                      <p className="text-zinc-400 mb-1">Shipping Address:</p>
                      <p className="font-medium bg-zinc-900 p-3 rounded text-sm">{selectedOrder.user?.address || "No address provided."}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                  <span className="text-zinc-400">Order Placed On:</span>
                  <span className="font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;
