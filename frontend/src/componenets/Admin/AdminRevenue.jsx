import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../Loader/Loader';

const AdminRevenue = () => {
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/all-order`, { headers });
        // Filter only delivered orders for revenue calculation
        const delivered = response.data.data.filter(order => order.orderstatus === "Delivered");
        setDeliveredOrders(delivered);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const totalRevenue = deliveredOrders.reduce((sum, order) => sum + ((order.book?.price || 0) * (order.quantity || 1)), 0);

  return (
    <div className="text-zinc-100">
      <div className="mb-8 border-b border-zinc-800 pb-4 flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-bold text-yellow-100">Revenue Breakdown</h1>
            <p className="text-zinc-400 mt-2">Showing all successfully delivered orders.</p>
        </div>
        <div className="text-right">
            <p className="text-zinc-500 text-sm font-semibold uppercase tracking-wider">Total Revenue</p>
            <p className="text-4xl font-bold text-green-400">₹{totalRevenue}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader /></div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-950 border-b border-zinc-800">
                  <th className="p-4 text-zinc-400 font-medium">Customer Name</th>
                  <th className="p-4 text-zinc-400 font-medium">Customer Email</th>
                  <th className="p-4 text-zinc-400 font-medium">Book Delivered</th>
                  <th className="p-4 text-zinc-400 font-medium">Date Delivered</th>
                  <th className="p-4 text-zinc-400 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {deliveredOrders.map((order) => (
                  <tr key={order._id} className="border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4 font-bold text-zinc-200">{order.user?.username || "Unknown User"}</td>
                    <td className="p-4 text-zinc-500">{order.user?.email || "Unknown Email"}</td>
                    <td className="p-4 font-medium text-yellow-500">
                      {order.book?.title || "Unknown Book"}
                      {order.quantity > 1 && <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">x{order.quantity}</span>}
                    </td>
                    <td className="p-4 text-zinc-400 text-sm">{new Date(order.updatedAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right font-bold text-green-400">
                      ₹{(order.book?.price || 0) * (order.quantity || 1)}
                    </td>
                  </tr>
                ))}
                {deliveredOrders.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-zinc-500">No revenue data found.</td>
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

export default AdminRevenue;
