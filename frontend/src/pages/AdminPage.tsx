// frontend/src/pages/AdminPage.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Lock, LogOut, FileText, Users, Calendar, Eye, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';

interface LoginFormData {
  email: string;
  password: string;
}

interface Quote {
  id: string;
  name: string;
  email: string;
  serviceType: string;
  options: string[];
  estimatedPrice: number;
  status: string;
  createdAt: string;
  message?: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  status: string;
}

interface Booking {
  id: string;
  name: string;
  email: string;
  phone?: string;
  selectedSlot: string;
  message?: string;
  createdAt: string;
  status: string;
}

const AdminPage: React.FC = () => {
  const { t } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'quotes' | 'contacts' | 'bookings'>('quotes');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsLoggedIn(true);
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [quotesRes, contactsRes, bookingsRes] = await Promise.all([
        api.get('/admin/quotes'),
        api.get('/admin/contacts'),
        api.get('/admin/bookings'),
      ]);
      
      setQuotes(quotesRes.data);
      setContacts(contactsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      // Set mock data for demo
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    // Mock data for demo purposes
    setQuotes([
      {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@example.com',
        serviceType: 'showcase',
        options: ['design', 'maintenance'],
        estimatedPrice: 4800,
        status: 'pending',
        createdAt: new Date().toISOString(),
        message: 'Need a professional website for my restaurant business.',
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@techstartup.com',
        serviceType: 'ecommerce',
        options: ['design', 'support'],
        estimatedPrice: 7700,
        status: 'reviewing',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        message: 'Looking for a complete e-commerce solution for our tech products.',
      },
    ]);

    setContacts([
      {
        id: '1',
        name: 'Mike Davis',
        email: 'mike.davis@company.com',
        message: 'Interested in automation solutions for our workflow.',
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Emma Wilson',
        email: 'emma.wilson@startup.io',
        message: 'Need help integrating AI into our existing platform.',
        status: 'completed',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ]);

    setBookings([
      {
        id: '1',
        name: 'Robert Chen',
        email: 'robert@business.com',
        phone: '+1 (555) 987-6543',
        selectedSlot: new Date(Date.now() + 86400000).toISOString(),
        message: 'Want to discuss AI integration for our customer service.',
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const onLogin = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const response = await api.post('/admin/login', data);
      localStorage.setItem('adminToken', response.data.token);
      setIsLoggedIn(true);
      toast.success(t('admin.login.success'));
      fetchData();
    } catch (error) {
      // For demo purposes, allow login with admin@neuraweb.com / admin123
      if (data.email === 'admin@neuraweb.com' && data.password === 'admin123') {
        localStorage.setItem('adminToken', 'demo_token');
        setIsLoggedIn(true);
        toast.success(t('admin.login.success'));
        setMockData();
      } else {
        toast.error(t('admin.login.error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    setQuotes([]);
    setContacts([]);
    setBookings([]);
    toast.success(t('admin.logout.success'));
  };

  const updateStatus = async (type: string, id: string, status: string) => {
    try {
      await api.patch(`/admin/${type}/${id}/status`, { status });
      toast.success(t('admin.status.update.success'));
      fetchData();
    } catch (error) {
      toast.error(t('admin.status.update.error'));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300';
      case 'reviewing':
        return 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300';
      case 'completed':
      case 'confirmed':
        return 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300';
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="card max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-primary-600" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('admin.title')}
            </h1>
          </div>

          <form onSubmit={handleSubmit(onLogin)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('admin.email')}
              </label>
              <input
                type="email"
                id="email"
                {...register('email', { required: t('common.email.required') })}
                className="input-field"
                placeholder="admin@neuraweb.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('admin.password')}
              </label>
              <input
                type="password"
                id="password"
                {...register('password', { required: t('common.password.required') })}
                className="input-field"
                placeholder="admin123"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-error-600">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <span>{t('admin.login')}</span>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
              <strong>{t('admin.demo.title')}</strong><br />
              {t('admin.demo.email')}<br />
              {t('admin.demo.password')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('admin.title')}
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <LogOut size={20} />
            <span>{t('admin.logout')}</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('quotes')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'quotes'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="inline mr-2" size={16} />
              {t('admin.quotes')} ({quotes.length})
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'contacts'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="inline mr-2" size={16} />
              {t('admin.contacts')} ({contacts.length})
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bookings'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calendar className="inline mr-2" size={16} />
              {t('admin.meetings')} ({bookings.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">{t('common.loading')}</p>
          </div>
        ) : (
          <>
            {/* Quotes Tab */}
            {activeTab === 'quotes' && (
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  {t('admin.quotes')}
                </h3>
                <div className="space-y-4">
                  {quotes.map((quote) => (
                    <div key={quote.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {quote.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {quote.email}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(quote.status)}`}>
                            {t(`admin.status.${quote.status}`)}
                          </span>
                          <button
                            onClick={() => setSelectedItem(quote)}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">{t('admin.service')}</span>{' '}
                          <span className="font-medium">{t(`quote.service.${quote.serviceType}`)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">{t('admin.price')}</span>{' '}
                          <span className="font-medium">${quote.estimatedPrice.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex space-x-2">
                        <select
                          value={quote.status}
                          onChange={(e) => updateStatus('quotes', quote.id, e.target.value)}
                          className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
                        >
                          <option value="pending">{t('admin.status.pending')}</option>
                          <option value="reviewing">{t('admin.status.reviewing')}</option>
                          <option value="completed">{t('admin.status.completed')}</option>
                        </select>
                      </div>
                    </div>
                  ))}
                  {quotes.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      {t('admin.no.quotes')}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Contacts Tab */}
            {activeTab === 'contacts' && (
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  {t('admin.contacts')}
                </h3>
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <div key={contact.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {contact.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {contact.email}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(contact.status)}`}>
                            {t(`admin.status.${contact.status}`)}
                          </span>
                          <button
                            onClick={() => setSelectedItem(contact)}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {contact.message.substring(0, 100)}...
                      </p>
                      <div className="flex space-x-2">
                        <select
                          value={contact.status}
                          onChange={(e) => updateStatus('contacts', contact.id, e.target.value)}
                          className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
                        >
                          <option value="pending">{t('admin.status.pending')}</option>
                          <option value="reviewing">{t('admin.status.reviewing')}</option>
                          <option value="completed">{t('admin.status.completed')}</option>
                        </select>
                      </div>
                    </div>
                  ))}
                  {contacts.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      {t('admin.no.contacts')}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  {t('admin.meetings')}
                </h3>
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {booking.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {booking.email}
                            {booking.phone && ` • ${booking.phone}`}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status === 'confirmed' ? t('admin.status.confirmed') : t(`admin.status.${booking.status}`)}
                          </span>
                          <button
                            onClick={() => setSelectedItem(booking)}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <strong>{t('booking.meeting.time')}</strong>{' '}
                        {new Date(booking.selectedSlot).toLocaleString()}
                      </p>
                      <div className="mt-2 flex space-x-2">
                        <select
                          value={booking.status}
                          onChange={(e) => updateStatus('bookings', booking.id, e.target.value)}
                          className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
                        >
                          <option value="pending">{t('admin.status.pending')}</option>
                          <option value="confirmed">{t('admin.status.confirmed')}</option>
                          <option value="completed">{t('admin.status.completed')}</option>
                        </select>
                      </div>
                    </div>
                  ))}
                  {bookings.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      {t('admin.no.meetings')}
                    </p>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t('admin.details')}
                  </h3>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('contact.name')}
                    </label>
                    <p className="text-gray-900 dark:text-white">{selectedItem.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('contact.email')}
                    </label>
                    <p className="text-gray-900 dark:text-white">{selectedItem.email}</p>
                  </div>
                  {selectedItem.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('booking.phone')}
                      </label>
                      <p className="text-gray-900 dark:text-white">{selectedItem.phone}</p>
                    </div>
                  )}
                  {selectedItem.serviceType && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('quote.service')}
                      </label>
                      <p className="text-gray-900 dark:text-white">{t(`quote.service.${selectedItem.serviceType}`)}</p>
                    </div>
                  )}
                  {selectedItem.estimatedPrice && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('quote.estimate')}
                      </label>
                      <p className="text-gray-900 dark:text-white">${selectedItem.estimatedPrice.toLocaleString()}</p>
                    </div>
                  )}
                  {selectedItem.selectedSlot && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('booking.meeting.time')}
                      </label>
                      <p className="text-gray-900 dark:text-white">{new Date(selectedItem.selectedSlot).toLocaleString()}</p>
                    </div>
                  )}
                  {selectedItem.message && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('contact.message')}
                      </label>
                      <p className="text-gray-900 dark:text-white">{selectedItem.message}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Date de création
                    </label>
                    <p className="text-gray-900 dark:text-white">{new Date(selectedItem.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;