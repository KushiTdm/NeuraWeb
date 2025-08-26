import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Users, 
  Activity, 
  FileText, 
  BarChart3, 
  Shield, 
  Trash2, 
  CheckCircle, 
  Clock,
  Globe,
  Calendar,
  TrendingUp,
  UserCheck,
  AlertCircle,
  Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

interface ClientWithStats {
  id: string;
  name: string;
  email: string;
  isValidated: boolean;
  createdAt: string;
  lastConnection?: string;
  wizardProgress: number;
  totalSessions: number;
}

interface ClientSession {
  id: string;
  ipAddress: string;
  userAgent?: string;
  loggedAt: string;
  client: {
    name: string;
    email: string;
  };
}

interface PlatformStats {
  totalClients: number;
  validatedClients: number;
  pendingClients: number;
  totalSessions: number;
  wizardCompletionRate: number;
  recentRegistrations: number;
  activeClientsToday: number;
}

const AdminDashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'clients' | 'sessions' | 'wizards' | 'stats'>('stats');
  const [clients, setClients] = useState<ClientWithStats[]>([]);
  const [sessions, setSessions] = useState<ClientSession[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [clientFilter, setClientFilter] = useState<'all' | 'validated' | 'pending'>('all');

  // Redirect if not admin
  if (!isAuthenticated || user?.type !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="card max-w-md w-full text-center">
          <div className="w-16 h-16 bg-error-100 dark:bg-error-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="text-error-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Admin privileges required to access this dashboard.
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [clientsRes, sessionsRes, statsRes] = await Promise.all([
        api.get('/admin/dashboard/clients'),
        api.get('/admin/dashboard/sessions'),
        api.get('/admin/dashboard/stats'),
      ]);
      
      setClients(clientsRes.data.data);
      setSessions(sessionsRes.data.data);
      setStats(statsRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const validateClient = async (clientId: string) => {
    try {
      await api.patch(`/admin/dashboard/clients/${clientId}/validate`);
      toast.success('Client validated successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to validate client');
    }
  };

  const deleteClient = async (clientId: string) => {
    if (!confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/admin/dashboard/clients/${clientId}`);
      toast.success('Client deleted successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to delete client');
    }
  };

  const exportWizardData = () => {
    const wizardData = clients
      .filter(client => client.wizardProgress > 0)
      .map(client => ({
        name: client.name,
        email: client.email,
        wizardProgress: client.wizardProgress,
        isValidated: client.isValidated,
        createdAt: client.createdAt,
      }));

    const dataStr = JSON.stringify(wizardData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `wizard-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const filteredClients = clients.filter(client => {
    if (clientFilter === 'validated') return client.isValidated;
    if (clientFilter === 'pending') return !client.isValidated;
    return true;
  });

  const getProgressColor = (progress: number) => {
    if (progress === 0) return 'bg-gray-200 dark:bg-gray-700';
    if (progress < 50) return 'bg-warning-500';
    if (progress < 100) return 'bg-primary-500';
    return 'bg-success-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor platform activity and manage clients
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'stats', label: 'Statistics', icon: BarChart3 },
              { id: 'clients', label: 'Clients', icon: Users },
              { id: 'sessions', label: 'Sessions', icon: Activity },
              { id: 'wizards', label: 'Wizards', icon: FileText },
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Statistics Tab */}
        {activeTab === 'stats' && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                    <Users className="text-primary-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Clients</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalClients}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-success-100 dark:bg-success-900 rounded-lg flex items-center justify-center">
                    <UserCheck className="text-success-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Validated</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.validatedClients}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-warning-100 dark:bg-warning-900 rounded-lg flex items-center justify-center">
                    <Clock className="text-warning-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingClients}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900 rounded-lg flex items-center justify-center">
                    <Activity className="text-secondary-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sessions</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSessions}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Wizard Completion</h3>
                  <TrendingUp className="text-primary-600" size={20} />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">
                    {stats.wizardCompletionRate}%
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">Completion Rate</p>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
                  <Calendar className="text-success-600" size={20} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">New registrations (7d)</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{stats.recentRegistrations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Active today</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{stats.activeClientsToday}</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Platform Health</h3>
                  <CheckCircle className="text-success-600" size={20} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">All systems operational</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Database connected</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Email service active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Clients Tab */}
        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <select
                  value={clientFilter}
                  onChange={(e) => setClientFilter(e.target.value as any)}
                  className="input-field w-auto"
                >
                  <option value="all">All Clients</option>
                  <option value="validated">Validated</option>
                  <option value="pending">Pending Validation</option>
                </select>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Showing {filteredClients.length} of {clients.length} clients
              </div>
            </div>

            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Wizard Progress
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Sessions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Last Connection
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredClients.map((client) => (
                      <tr key={client.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {client.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {client.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            client.isValidated
                              ? 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300'
                              : 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300'
                          }`}>
                            {client.isValidated ? 'Validated' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                              <div
                                className={`h-2 rounded-full ${getProgressColor(client.wizardProgress)}`}
                                style={{ width: `${client.wizardProgress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {client.wizardProgress}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {client.totalSessions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {client.lastConnection 
                            ? new Date(client.lastConnection).toLocaleDateString()
                            : 'Never'
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          {!client.isValidated && (
                            <button
                              onClick={() => validateClient(client.id)}
                              className="text-success-600 hover:text-success-900"
                              title="Validate Client"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => deleteClient(client.id)}
                            className="text-error-600 hover:text-error-900"
                            title="Delete Client"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Client Sessions
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Last 100 sessions
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Browser
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Login Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {sessions.map((session) => (
                    <tr key={session.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {session.client.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {session.client.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Globe size={16} className="text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900 dark:text-white">
                            {session.ipAddress}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {session.userAgent ? (
                          <span title={session.userAgent}>
                            {session.userAgent.split(' ')[0]}...
                          </span>
                        ) : (
                          'Unknown'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(session.loggedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Wizards Tab */}
        {activeTab === 'wizards' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Wizard Progress Overview
              </h3>
              <button
                onClick={exportWizardData}
                className="btn-primary flex items-center space-x-2"
              >
                <Download size={16} />
                <span>Export Data</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="card text-center">
                <div className="text-2xl font-bold text-primary-600 mb-2">
                  {clients.filter(c => c.wizardProgress > 0).length}
                </div>
                <p className="text-gray-600 dark:text-gray-300">Started Wizards</p>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-success-600 mb-2">
                  {clients.filter(c => c.wizardProgress === 100).length}
                </div>
                <p className="text-gray-600 dark:text-gray-300">Completed Wizards</p>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-warning-600 mb-2">
                  {clients.filter(c => c.wizardProgress > 0 && c.wizardProgress < 100).length}
                </div>
                <p className="text-gray-600 dark:text-gray-300">In Progress</p>
              </div>
            </div>

            <div className="card">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Started
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {clients
                      .filter(client => client.wizardProgress > 0)
                      .map((client) => (
                        <tr key={client.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {client.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {client.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                                <div
                                  className={`h-2 rounded-full ${getProgressColor(client.wizardProgress)}`}
                                  style={{ width: `${client.wizardProgress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                {client.wizardProgress}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              client.wizardProgress === 100
                                ? 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300'
                                : client.wizardProgress > 50
                                ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300'
                                : 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300'
                            }`}>
                              {client.wizardProgress === 100 ? 'Completed' : 'In Progress'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(client.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;