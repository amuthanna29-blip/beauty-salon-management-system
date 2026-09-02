import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  AiFillDashboard,
  AiOutlineTeam,
  AiOutlineSchedule,
  AiOutlineShoppingCart,
  AiOutlineDollar,
  AiOutlineBarChart,
  AiOutlineSetting,
} from 'react-icons/ai';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <AiFillDashboard />, roles: ['admin', 'manager', 'staff'] },
    { path: '/clients', label: 'العملاء', icon: <AiOutlineTeam />, roles: ['admin', 'manager', 'staff'] },
    { path: '/services', label: 'الخدمات', icon: <AiOutlineShoppingCart />, roles: ['admin', 'manager'] },
    { path: '/bookings', label: 'المواعيد', icon: <AiOutlineSchedule />, roles: ['admin', 'manager', 'staff'] },
    { path: '/payments', label: 'المدفوعات', icon: <AiOutlineDollar />, roles: ['admin', 'manager'] },
    { path: '/reports', label: 'التقارير', icon: <AiOutlineBarChart />, roles: ['admin', 'manager'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role));

  return (
    <aside className="w-64 bg-gradient-to-b from-pink-600 to-pink-800 text-white min-h-screen">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-8">💄 Beauty Salon</h2>
        <nav className="space-y-2">
          {filteredMenu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                location.pathname === item.path
                  ? 'bg-white text-pink-600'
                  : 'hover:bg-pink-700'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;