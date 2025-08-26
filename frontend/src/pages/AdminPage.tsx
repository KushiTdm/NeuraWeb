// frontend/src/pages/AdminPage.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Lock, LogOut, FileText, Users, Calendar, Eye, UserCheck, Briefcase, X, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
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
  const { user, logout, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'quotes' | 'contacts' | 'bookings' | 'clients' | 'wizards'>('quotes');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [wizards, setWizards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Redirect if not admin
  if (!isAuthenticated || user?.type !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="card max-w-md w-full text-center">
          <div className="w-16 h-16 bg-error-100 dark:bg-error-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-error-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You need admin privileges to access this page.
          </p>
          <Link to="/login" className="btn-primary">
            Login as Admin
          </Link>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (isAuthenticated && user?.type === 'admin') {
      fetchData();
    }
  }, [isAuthenticated, user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [quotesRes, contactsRes, bookingsRes, clientsRes, wizardsRes] = await Promise.all([
        api.get('/admin/quotes'),
        api.get('/admin/contacts'),
        api.get('/admin/bookings'),
        api.get('/admin/clients'),
        api.get('/admin/wizards'),
      ]);
      
      setQuotes(quotesRes.data.data);
      setContacts(contactsRes.data.data);
      setBookings(bookingsRes.data.data);
      setClients(clientsRes.data.data);
      setWizards(wizardsRes.data.data);
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

  const validateClient = async (clientId: string) => {
    try {
      await api.patch(`/admin/clients/${clientId}/validate`);
      toast.success('Client validated successfully');
      fetchData();
    } catch (error) {
      toast.error('Error validating client');
    }
  };

  const updateStatus = async (type: string, id: string, status: string) => {
    try {
      await api.patch(`/admin/${type}/${id}/status`, { status });
      toast.success('Status updated successfully');
      fetchData();
    } catch (error) {
      toast.error('Error updating status');
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('admin.title')}
            </h1>
            <div className="flex space-x-4 mt-2">
              <Link
                to="/admin/dashboard"
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                <BarChart3 size={16} />
                <span>Advanced Dashboard</span>
              </Link>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <LogOut size={20} />
            <span>Logout</span>
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
            <button
              onClick={() => setActiveTab('clients')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'clients'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <UserCheck className="inline mr-2" size={16} />
              Clients ({clients.length})
            </button>
            <button
              onClick={() => setActiveTab('wizards')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'wizards'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Briefcase className="inline mr-2" size={16} />
              Project Briefs ({wizards.length})
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
                  Quote Requests
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
                          <span className="text-gray-500 dark:text-gray-400">Service:</span>{' '}
                          <span className="font-medium">{t(`quote.service.${quote.serviceType}`)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Price:</span>{' '}
                          <span className="font-medium">${quote.estimatedPrice.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex space-x-2">
                        <select
                          value={quote.status}
                          onChange={(e) => updateStatus('quotes', quote.id, e.target.value)}
                          className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewing">Reviewing</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  ))}
                  {quotes.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      No quote requests yet.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Contacts Tab */}
            {activeTab === 'contacts' && (
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Contact Messages
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
                          <option value="pending">Pending</option>
                          <option value="reviewing">Reviewing</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  ))}
                  {contacts.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      No contact messages yet.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Booked Meetings
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
                            {booking.status === 'confirmed' ? 'Confirmed' : t(`admin.status.${booking.status}`)}
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
                        <strong>Meeting Time:</strong>{' '}
                        {new Date(booking.selectedSlot).toLocaleString()}
                      </p>
                      <div className="mt-2 flex space-x-2">
                        <select
                          value={booking.status}
                          onChange={(e) => updateStatus('bookings', booking.id, e.target.value)}
                          className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  ))}
                  {bookings.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      No booked meetings yet.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Clients Tab */}
            {activeTab === 'clients' && (
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Client Management
                </h3>
                <div className="space-y-4">
                  {clients.map((client) => (
                    <div key={client.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {client.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {client.email}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            client.isValidated 
                              ? 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300'
                              : 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300'
                          }`}>
                            {client.isValidated ? 'Validated' : 'Pending'}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        <span>Wizard Responses: {client._count?.wizardResponses || 0}</span>
                      </div>
                      {!client.isValidated && (
                        <button
                          onClick={() => validateClient(client.id)}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          Validate Client
                        </button>
                      )}
                    </div>
                  ))}
                  {clients.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      No clients registered yet.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Wizards Tab */}
            {activeTab === 'wizards' && (
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Project Briefs
                </h3>
                <div className="space-y-4">
                  {wizards.map((wizard, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {wizard.client.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {wizard.client.email}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            wizard.isCompleted
                              ? 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300'
                              : 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300'
                          }`}>
                            {wizard.isCompleted ? 'Completed' : 'In Progress'}
                          </span>
                          <button
                            onClick={() => setSelectedItem(wizard)}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        <span>Steps completed: {wizard.responses.filter((r: any) => !r.isDraft).length}/9</span>
                        <span className="ml-4">Last updated: {new Date(wizard.lastUpdated).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                  {wizards.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      No project briefs submitted yet.
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
                    Details
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                    <p className="text-gray-900 dark:text-white">{selectedItem.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <p className="text-gray-900 dark:text-white">{selectedItem.email}</p>
                  </div>
                  {selectedItem.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                      <p className="text-gray-900 dark:text-white">{selectedItem.phone}</p>
                    </div>
                  )}
                  {selectedItem.serviceType && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Service Type</label>
                      <p className="text-gray-900 dark:text-white">{t(`quote.service.${selectedItem.serviceType}`)}</p>
                    </div>
                  )}
                  {selectedItem.estimatedPrice && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Estimated Price</label>
                      <p className="text-gray-900 dark:text-white">${selectedItem.estimatedPrice.toLocaleString()}</p>
                    </div>
                  )}
                  {selectedItem.selectedSlot && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Meeting Time</label>
                      <p className="text-gray-900 dark:text-white">{new Date(selectedItem.selectedSlot).toLocaleString()}</p>
                    </div>
                  )}
                  {selectedItem.message && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                      <p className="text-gray-900 dark:text-white">{selectedItem.message}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Created At</label>
                    <p className="text-gray-900 dark:text-white">{new Date(selectedItem.createdAt).toLocaleString()}</p>
                  </div>
                  {selectedItem.responses && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project Brief Responses</label>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {selectedItem.responses.map((response: any) => (
                          <div key={response.step} className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-sm">Step {response.step}</span>
                              <span className={`px-2 py-1 rounded text-xs ${
                                response.isDraft 
                                  ? 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300'
                                  : 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300'
                              }`}>
                                {response.isDraft ? 'Draft' : 'Completed'}
                              </span>
                            </div>
                            <pre className="text-xs text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                              {JSON.stringify(response.data, null, 2)}
                            </pre>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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