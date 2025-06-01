import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { currentTheme } = useTheme();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/blog', label: 'Blog' }
  ];

  return (
    <header className="w-full backdrop-blur-sm">
      <nav className="container-width py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-sm rounded-lg transition-colors relative ${
                  activeTab === item.path
                    ? 'text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.label}
                {activeTab === item.path && (
                  <motion.div
                    className="absolute inset-0 rounded-lg -z-10"
                    style={{ backgroundColor: currentTheme.nav.bubble }}
                    layoutId="bubble"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;