'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RoleModal from '../components/auth/RoleModal';
import UserDashboard from '../components/dashboards/UserDashboard';
import ManagerDashboard from '../components/dashboards/ManagerDashboard';
// import AdminDashboard from '../components/dashboards/AdminDashboard';

export default function Home() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const handleLogin = (role, username) => {
    setUserRole(role);
    setUser(username);
    setActiveModal(null);
    setShowDropdown(false);
  };

  const handleLogout = () => {
    setUser(null);
    setUserRole(null);
  };

  const openModal = (role) => {
    setActiveModal(role);
    setShowDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  // Show appropriate dashboard based on user role
  if (user && userRole) {
    switch (userRole) {
      case 'user':
        return <UserDashboard user={user} onLogout={handleLogout} />;
      case 'manager':
        return <ManagerDashboard user={user} onLogout={handleLogout} />;
      // case 'admin':
      //   return <AdminDashboard user={user} onLogout={handleLogout} />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 relative overflow-hidden">
      {/* Hero Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source src="/assets/hero.mp4" type="video/mp4" />
        </video>
        {/* Video Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-gray-900/50 to-black/40"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-xl"
        />
      </div>



      <div className="relative z-20 flex items-center justify-center min-h-screen p-8">
        <AnimatePresence mode="wait">
          <motion.main
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center max-w-lg mx-auto mt-32"
          >


            {/* Bottom Login Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="w-full"
            >
              <div className="relative dropdown-container">
                {/* Modern Glassmorphism Login Button */}
                <motion.button
                  onClick={() => setShowDropdown(!showDropdown)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-6 px-10 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-bold text-lg rounded-3xl 
                             hover:bg-white/15 hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 
                             transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]
                             flex items-center justify-center space-x-4 group"
                >
                  <motion.div
                    animate={{ 
                      y: [-8, 8, -8],
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ 
                      duration: 2.5, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="text-5xl filter drop-shadow-[0_0_15px_rgba(139,92,246,0.8)] hover:drop-shadow-[0_0_25px_rgba(139,92,246,1)]"
                  >
                  
                  </motion.div>
                  <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                    Login As
                  </span>
                  <motion.svg
                    animate={{ rotate: showDropdown ? 180 : 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="w-6 h-6 text-white/70 group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </motion.button>

                {/* Enhanced Dropdown Menu */}
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -20, scale: 0.9, filter: "blur(10px)" }}
                      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -20, scale: 0.9, filter: "blur(10px)" }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="absolute top-full mt-4 w-full backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 
                                 shadow-[0_20px_60px_rgba(0,0,0,0.4)] z-50 overflow-hidden"
                    >
                      {[
                                                { 
                          role: 'manager', 
                          title: 'Manager', 
                          description: 'Manage inventory & run analytics', 
                          icon: '⚡',
                          gradient: 'from-green-500/20 to-emerald-500/20',
                          hoverGradient: 'hover:from-green-500/30 hover:to-emerald-500/30',
                          iconBg: 'bg-gradient-to-br from-green-500/30 to-emerald-500/30'
                        },
                        { 
                          role: 'user', 
                          title: 'User', 
                          description: 'Browse products & view inventory', 
                          icon: '👤',
                          gradient: 'from-blue-500/20 to-cyan-500/20',
                          hoverGradient: 'hover:from-blue-500/30 hover:to-cyan-500/30',
                          iconBg: 'bg-gradient-to-br from-blue-500/30 to-cyan-500/30'
                        }

                        // { 
                        //   role: 'admin', 
                        //   title: 'Admin', 
                        //   description: 'Full system administration', 
                        //   icon: '👑',
                        //   gradient: 'from-purple-500/20 to-pink-500/20',
                        //   hoverGradient: 'hover:from-purple-500/30 hover:to-pink-500/30',
                        //   iconBg: 'bg-gradient-to-br from-purple-500/30 to-pink-500/30'
                        // }
                      ].map((item, index) => (
                        <motion.button
                          key={item.role}
                          initial={{ opacity: 0, x: -30, filter: "blur(5px)" }}
                          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => openModal(item.role)}
                          className={`w-full p-6 text-left border-b border-white/10 last:border-b-0 transition-all duration-400 
                                     ${item.gradient} ${item.hoverGradient} backdrop-blur-sm
                                     flex items-center space-x-5 group relative overflow-hidden`}
                        >
                          {/* Animated Background Glow */}
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1, opacity: 1 }}
                            className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"
                          />
                          
                          <motion.div 
                            className={`w-14 h-14 ${item.iconBg} rounded-2xl flex items-center justify-center text-2xl 
                                       backdrop-blur-sm border border-white/20 group-hover:border-white/40 transition-all duration-300
                                       shadow-lg group-hover:shadow-xl relative z-10`}
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            {item.icon}
                          </motion.div>
                          
                          <div className="relative z-10">
                            <div className="text-white font-bold text-lg mb-1 group-hover:text-white transition-colors">
                              {item.title}
                            </div>
                            {/* <div className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors">
                              {item.description}
                            </div> */}
                          </div>
                          
                          <motion.div
                            initial={{ x: -10, opacity: 0 }}
                            whileHover={{ x: 0, opacity: 1 }}
                            className="ml-auto text-white/60 group-hover:text-white/80 transition-colors relative z-10"
                          >
                            →
                          </motion.div>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>


          </motion.main>
        </AnimatePresence>
      </div>

      {/* Role Modals */}
      <RoleModal 
        isOpen={activeModal === 'user'} 
        onClose={() => setActiveModal(null)} 
        role="user" 
        onLogin={handleLogin} 
      />
      <RoleModal 
        isOpen={activeModal === 'manager'} 
        onClose={() => setActiveModal(null)} 
        role="manager" 
        onLogin={handleLogin} 
      />
      {/* <RoleModal 
        isOpen={activeModal === 'admin'} 
        onClose={() => setActiveModal(null)} 
        role="admin" 
        onLogin={handleLogin} 
      /> */}
    </div>
  );
}
