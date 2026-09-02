import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { bookingService } from '../../services/bookingService';
import { AiOutlinePlus, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import { toast } from 'react-toastify';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await bookingService.getAllBookings(user?.salonId || '');
      setBookings(response.data.bookings);
    } catch (error) {
      toast.error('فشل تحميل المواعيد');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async (bookingId) => {
    try {
      await bookingService.confirmBooking(bookingId);
      toast.success('✅ تم تأكيد الموعد');
      fetchBookings();
    } catch (error) {
      toast.error('فشل التأكيد');
    }
  };

  const handleComplete = async (bookingId) => {
    try {
      await bookingService.completeBooking(bookingId);
      toast.success('✅ تم إنهاء الموعد');
      fetchBookings();
    } catch (error) {
      toast.error('فشل الإنهاء');
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">📅 جدولة المواعيد</h1>
        <button className="flex items-center space-x-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">
          <AiOutlinePlus />
          <span>موعد جديد</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center">جاري التحميل...</div>
        ) : bookings.length === 0 ? (
          <div className="p-8 text-center text-gray-500">لا توجد مواعيد</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-right text-gray-700 font-semibold">الكود</th>
                <th className="px-6 py-3 text-right text-gray-700 font-semibold">العميل</th>
                <th className="px-6 py-3 text-right text-gray-700 font-semibold">الخدمة</th>
                <th className="px-6 py-3 text-right text-gray-700 font-semibold">الموعد</th>
                <th className="px-6 py-3 text-right text-gray-700 font-semibold">الحالة</th>
                <th className="px-6 py-3 text-right text-gray-700 font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3 font-mono text-sm">{booking.bookingCode}</td>
                  <td className="px-6 py-3">{booking.clientId?.fullName}</td>
                  <td className="px-6 py-3">{booking.serviceId?.name}</td>
                  <td className="px-6 py-3">{new Date(booking.startTime).toLocaleString('ar-SA')}</td>
                  <td className="px-6 py-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[booking.status]}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 flex space-x-2">
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => handleConfirm(booking._id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <AiOutlineCheck />
                      </button>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleComplete(booking._id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <AiOutlineCheck />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;