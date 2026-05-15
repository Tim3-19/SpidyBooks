import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../Loader/Loader';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../../store/auth';

const Settings = () => {
  const [values, setValues] = useState({ 
    username: "", 
    email: "", 
    address: "", 
    avatar: "", 
    password: "" 
  });
  const [profileData, setProfileData] = useState();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState({
    username: false,
    email: false,
    address: false,
    avatar: false,
    password: false
  });
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/get-information`,
          { headers }
        );
        setProfileData(response.data);
        setValues({
          username: response.data.username || "",
          email: response.data.email || "",
          address: response.data.address || "",
          avatar: response.data.avatar || "",
          password: "" 
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching:", error);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const toggleEdit = (field) => {
    setEditing(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleFieldUpdate = async (field) => {
    try {
      const payload = {};
      payload[field] = values[field];
      
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/update-profile`,
        payload,
        { headers }
      );

      if (field === 'password' && response.data.passwordChanged) {
        alert("Password changed successfully. Please log in again.");
        localStorage.clear();
        navigate("/logIn");
        return;
      }

      setMessage(response.data.message || `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`);
      setTimeout(() => setMessage(""), 3000);
      toggleEdit(field);
      
      if (field !== 'password') {
        setProfileData({ ...profileData, [field]: values[field] });
      }

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  const renderField = (field, label, type = "text", placeholder = "") => {
    const isEditing = editing[field];
    
    return (
      <div className='flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-zinc-950/50 border border-zinc-800 rounded-xl mb-4 hover:border-zinc-700 transition-colors'>
        <div className='flex-1 w-full md:w-auto pr-4'>
          <h3 className="text-zinc-500 text-sm font-semibold uppercase tracking-wider mb-2">{label}</h3>
          
          {!isEditing ? (
            <p className="text-zinc-100 font-medium text-lg truncate">
              {field === 'password' ? '••••••••' : profileData[field] || <span className="text-zinc-600 italic">Not provided</span>}
            </p>
          ) : (
            field === 'address' ? (
              <textarea 
                className='w-full bg-zinc-900 border border-zinc-700 text-zinc-100 p-3 rounded-lg outline-none focus:border-[#fde047] resize-y shadow-inner'
                rows="3"
                name={field}
                value={values[field]}
                onChange={handleChange}
                placeholder={placeholder}
              />
            ) : (
              <input 
                type={type}
                className='w-full bg-zinc-900 border border-zinc-700 text-zinc-100 p-3 rounded-lg outline-none focus:border-[#fde047] shadow-inner'
                name={field}
                value={values[field]}
                onChange={handleChange}
                placeholder={placeholder}
              />
            )
          )}
        </div>

        <div className='mt-4 md:mt-0 flex gap-3 self-end md:self-center'>
          {!isEditing ? (
            <button 
              onClick={() => {
                setValues({...values, [field]: field === 'password' ? '' : profileData[field]});
                toggleEdit(field);
              }}
              className='px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-semibold transition-all active:scale-95 border border-zinc-700'
            >
              Update
            </button>
          ) : (
            <>
              <button 
                onClick={() => handleFieldUpdate(field)}
                className='px-5 py-2.5 bg-gradient-to-r from-[#fde047] to-yellow-500 hover:from-yellow-400 hover:to-yellow-600 text-black rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(253,224,71,0.3)] hover:shadow-[0_0_20px_rgba(253,224,71,0.5)] active:scale-95'
              >
                Save
              </button>
              <button 
                onClick={() => toggleEdit(field)}
                className='px-5 py-2.5 bg-transparent border border-zinc-600 text-zinc-400 hover:text-zinc-200 hover:border-zinc-400 rounded-lg text-sm font-medium transition-all active:scale-95'
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {loading ? (
        <div className='w-full h-full flex items-center justify-center min-h-[60vh]'>
          <Loader />
        </div>
      ) : (
        profileData && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='h-full p-4 md:p-8 text-zinc-100 flex flex-col items-center'
          >
            <div className="w-full max-w-4xl bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 blur-[100px] rounded-full pointer-events-none" />
              
              <h1 className='text-3xl md:text-4xl font-bold text-yellow-100 mb-8 border-b border-zinc-800 pb-4 relative z-10'>
                Account Settings
              </h1>

              {message && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-500/20 border border-green-500 text-green-400 p-4 rounded-xl mb-6 text-center font-medium relative z-10"
                >
                  {message}
                </motion.div>
              )}

              <div className="flex flex-col gap-2 relative z-10">
                {renderField('username', 'Username', 'text', 'Enter new username')}
                {renderField('email', 'Email Address', 'email', 'Enter new email')}
                {renderField('password', 'Password', 'password', 'Enter new password')}
                {renderField('address', 'Shipping Address', 'text', 'Enter your complete address')}
                {/* Optional: avatar update */}
                {renderField('avatar', 'Avatar URL', 'text', 'Enter image URL')}
              </div>
              
              {/* Admin Logout Button */}
              {role === 'admin' && (
                <div className='mt-10 pt-8 border-t border-zinc-800 flex justify-center relative z-10'>
                  <button 
                    onClick={() => {
                      localStorage.clear();
                      dispatch(authActions.logout());
                      navigate("/");
                    }}
                    className='group flex items-center gap-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500 rounded-xl px-8 py-3 font-bold transition-all duration-300'
                  >
                    <span>Log Out from Admin</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )
      )}
    </>
  );
};

export default Settings;