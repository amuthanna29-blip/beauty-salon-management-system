import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import { clientService } from '../../services/clientService';
import { fetchClientsStart, fetchClientsSuccess, fetchClientsFailure } from '../../redux/slices/clientSlice';
import { toast } from 'react-toastify';

const ClientsPage = () => {
  const dispatch = useDispatch();
  const { clients, isLoading } = useSelector((state) => state.clients);
  const { user } = useSelector((state) => state.auth);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    dispatch(fetchClientsStart());
    try {
      // Note: salonId should come from user or context in production
      const response = await clientService.getAllClients(user?.salonId || '');
      dispatch(fetchClientsSuccess(response.data.clients));
    } catch (error) {
      dispatch(fetchClientsFailure(error.message));
      toast.error('فشل تحميل العملاء');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من الحذف؟')) {
      try {
        await clientService.deleteClient(id);
        toast.success('✅ تم حذف العميل بنجاح');
        fetchClients();
      } catch (error) {
        toast.error('فشل حذف العميل');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">👥 إدارة العملاء</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
        >
          <AiOutlinePlus />
          <span>عميل جديد</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow">
          <p className="text-gray-100">إجمالي العملاء</p>
          <p className="text-3xl font-bold">{clients.length}</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg shadow">
          <p className="text-gray-100">عملاء نشطين</p>
          <p className="text-3xl font-bold">{clients.filter(c => c.isActive).length}</p>
        </div>
        <div className="bg-purple-500 text-white p-6 rounded-lg shadow">
          <p className="text-gray-100">إجمالي الإنفاق</p>
          <p className="text-3xl font-bold">${clients.reduce((sum, c) => sum + (c.totalSpent || 0), 0)}</p>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center">جاري التحميل...</div>
        ) : clients.length === 0 ? (
          <div className="p-8 text-center text-gray-500">لا توجد بيانات عملاء</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-right text-gray-700 font-semibold">الاسم</th>
                <th className="px-6 py-3 text-right text-gray-700 font-semibold">الهاتف</th>
                <th className="px-6 py-3 text-right text-gray-700 font-semibold">البريد</th>
                <th className="px-6 py-3 text-right text-gray-700 font-semibold">الزيارات</th>
                <th className="px-6 py-3 text-right text-gray-700 font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3">{client.fullName}</td>
                  <td className="px-6 py-3">{client.phone}</td>
                  <td className="px-6 py-3">{client.email}</td>
                  <td className="px-6 py-3">{client.totalVisits}</td>
                  <td className="px-6 py-3 flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <AiOutlineEye />
                    </button>
                    <button className="text-yellow-600 hover:text-yellow-800">
                      <AiOutlineEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(client._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <AiOutlineDelete />
                    </button>
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

export default ClientsPage;