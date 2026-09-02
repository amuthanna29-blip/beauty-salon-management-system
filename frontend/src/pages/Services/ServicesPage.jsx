import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { serviceService } from '../../services/serviceService';
import { toast } from 'react-toastify';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const response = await serviceService.getAllServices(user?.salonId || '');
      setServices(response.data.services);
    } catch (error) {
      toast.error('فشل تحميل الخدمات');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد؟')) {
      try {
        await serviceService.deleteService(id);
        toast.success('✅ تم حذف الخدمة');
        fetchServices();
      } catch (error) {
        toast.error('فشل الحذف');
      }
    }
  };

  const categories = {
    hair: '💇 الشعر',
    makeup: '💄 المكياج',
    nails: '💅 الأظافر',
    massage: '💆 المساج',
    skincare: '✨ العناية بالبشرة',
    waxing: '🪶 الإزالة'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">💇 إدارة الخدمات</h1>
        <button className="flex items-center space-x-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">
          <AiOutlinePlus />
          <span>خدمة جديدة</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center py-8">جاري التحميل...</div>
        ) : services.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">لا توجد خدمات</div>
        ) : (
          services.map((service) => (
            <div key={service._id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{service.name}</h3>
                  <p className="text-pink-600 font-semibold">{categories[service.category]}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="text-yellow-600 hover:text-yellow-800">
                    <AiOutlineEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <AiOutlineDelete />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">{service.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-600">${service.price}</span>
                <span className="text-gray-500 text-sm">{service.duration} دقيقة</span>
              </div>
              {service.rating > 0 && (
                <div className="mt-3 text-yellow-500">⭐ {service.rating.toFixed(1)}</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ServicesPage;