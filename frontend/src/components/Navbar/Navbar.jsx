import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineMenu, AiOutlineClose, AiOutlineLogout, AiOutlineUser } from 'react-icons/ai';
import { logout } from '../redux/slices/authSlice';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-pink-600">💅 Salon Manager</h1>
        
        <div className="hidden md:flex items-center space-x-4">
          <span className="text-gray-700">{user?.fullName}</span>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            <AiOutlineLogout />
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded"
          >
            <AiOutlineLogout />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;