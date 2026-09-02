import React from 'react';
import { useSelector } from 'react-redux';
import { AiOutlineUser, AiOutlineDollar, AiOutlineCalendar, AiOutlineBarChart } from 'react-icons/ai';

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);

  const stats = [
    { title: 'إجمالي العملاء', value: '245', icon: <AiOutlineUser />, color: 'bg-blue-500' },
    { title: 'الإيرادات اليومية', value: '$2,450', icon: <AiOutlineDollar />, color: 'bg-green-500' },
    { title: 'المواعيد اليوم', value: '18', icon: <AiOutlineCalendar />, color: 'bg-purple-500' },
    { title: 'الأداء', value: '95%', icon: <AiOutlineBarChart />, color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-pink-600 to-pink-800 text-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-2">مرحباً بك، {user?.firstName}! 👋</h1>
        <p className="text-pink-100">إدارة صالون التجميل الخاص بك بكل سهولة وكفاءة</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} text-white p-4 rounded-full text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings and Top Services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📅 المواعيد القادمة</h2>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-semibold text-gray-800">أحمد محمد</p>
                  <p className="text-sm text-gray-500">قص الشعر - 10:30 ص</p>
                </div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">مؤكد</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Services */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">⭐ الخدمات الأكثر طلباً</h2>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between border-b pb-3">
                <p className="font-semibold text-gray-800">معالجة الشعر</p>
                <div className="text-right">
                  <p className="font-bold text-pink-600">45</p>
                  <p className="text-xs text-gray-500">هذا الشهر</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;