import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Loader from '../Loader/Loader'

const UserOrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState([])
  const [loading, setLoading] = useState(true)

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  
  }
  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/order-history",
          { headers }
          
        );
        setOrderHistory(response.data.data || []); 
      } catch (error) {
        console.error("Error fetching:", error);
      } finally {
        setLoading(false);
      }
  } 
      fetch();
      }, [])
 
  
  
  return (
    <div className="w-full min-h-[60vh] bg-zinc-900 text-zinc-100 px-4 md:px-8 py-6 rounded-xl border border-zinc-800/60 shadow-lg">
      <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-yellow-100">
        My Orders
      </h2>

      {loading && (
        <div className="flex items-center justify-center my-10">
          <Loader />
        </div>
      )}

      {!loading && orderHistory.length === 0 && (
        <div className="flex flex-col items-center justify-center h-40 text-zinc-400">
          <p className="text-lg">You have not placed any orders yet.</p>
          <p className="text-sm mt-2">
            Browse the collection and start your reading journey!
          </p>
        </div>
      )}

      {!loading && orderHistory.length > 0 && (
        <div className="mt-4 space-y-4">
          {orderHistory.map((order) => (
            <div
              key={order._id}
              className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center bg-zinc-800/80 rounded-lg p-4 border border-zinc-700/60"
            >
              <div>
                <h3 className="text-lg font-semibold text-zinc-100">
                  {order.book?.title || "Book removed"}
                </h3>
                <p className="text-sm text-zinc-400">
                  by {order.book?.author || "Unknown"}
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  Ordered on{" "}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>

              <div className="flex flex-col items-start md:items-end gap-1">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/50">
                  {order.orderstatus || "Order Placed"}
                </span>
                {order.book?.price && (
                  <span className="mt-1 text-base font-semibold text-yellow-100">
                    ₹ {order.book.price}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserOrderHistory