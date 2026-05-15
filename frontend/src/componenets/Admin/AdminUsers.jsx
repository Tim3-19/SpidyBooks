import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../Loader/Loader';
import { Shield, ShieldAlert, Trash2 } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get-all-users`, { headers });
      setUsers(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (window.confirm(`Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`)) {
      try {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/update-role/${userId}`, { role: newRole }, { headers });
        // Update local state
        setUsers(users.map(user => user._id === userId ? { ...user, role: newRole } : user));
      } catch (error) {
        console.error(error);
        alert("Failed to update user role");
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("WARNING: This will permanently delete the user account. Are you sure?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/delete-user/${userId}`, { headers });
        setUsers(users.filter(user => user._id !== userId));
      } catch (error) {
        console.error(error);
        alert("Failed to delete user");
      }
    }
  };

  return (
    <div className="text-zinc-100">
      <div className="mb-8 border-b border-zinc-800 pb-4">
        <h1 className="text-3xl font-bold text-yellow-100">User Management</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader /></div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-950 border-b border-zinc-800">
                  <th className="p-4 text-zinc-400 font-medium">Avatar</th>
                  <th className="p-4 text-zinc-400 font-medium">User Details</th>
                  <th className="p-4 text-zinc-400 font-medium">Address</th>
                  <th className="p-4 text-zinc-400 font-medium">Role</th>
                  <th className="p-4 text-zinc-400 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4">
                      <img 
                        src={user.avatar || "https://cdn-icons-png.flaticon.com/128/3135/3135715.png"} 
                        alt={user.username} 
                        className="w-12 h-12 rounded-full object-cover border border-zinc-700" 
                      />
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-zinc-100">{user.username}</p>
                      <p className="text-sm text-zinc-500">{user.email}</p>
                      <p className="text-xs text-zinc-600 mt-1">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="p-4 text-zinc-400 text-sm max-w-xs truncate" title={user.address}>
                      {user.address || "Not provided"}
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                        user.role === 'admin' 
                        ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' 
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}>
                        {user.role === 'admin' ? <Shield size={12} /> : <ShieldAlert size={12} />}
                        {user.role.toUpperCase()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-3">
                        <button 
                          onClick={() => handleRoleChange(user._id, user.role)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.role === 'admin'
                            ? 'text-yellow-500 hover:bg-yellow-500/10'
                            : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
                          }`}
                          title={user.role === 'admin' ? "Demote to User" : "Promote to Admin"}
                        >
                          {user.role === 'admin' ? <ShieldAlert size={18} /> : <Shield size={18} />}
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-zinc-500">No users found.</td>
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

export default AdminUsers;
