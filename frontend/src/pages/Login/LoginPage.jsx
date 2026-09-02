import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const response = await api.post('/auth/login', formData);
      dispatch(loginSuccess({
        token: response.data.token,
        user: response.data.user
      }));
      toast.success('✅ تم تسجيل الدخول بنجاح!');
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || 'فشل تسجيل الدخول';
      dispatch(loginFailure(message));
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-pink-800 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-pink-600 mb-8">💅 Beauty Salon</h1>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">تسجيل الدخول</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">كلمة المرور</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-pink-600 text-white font-semibold py-3 rounded-lg hover:bg-pink-700 transition disabled:bg-gray-400"
          >
            {isLoading ? 'جاري التحميل...' : 'دخول'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          حساب تجريبي: admin@salon.com / 123456
        </p>
      </div>
    </div>
  );
};

export default LoginPage;