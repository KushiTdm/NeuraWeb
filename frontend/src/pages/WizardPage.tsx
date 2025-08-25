import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useWizardStore } from '../stores/wizardStore';
import { wizardApi } from '../utils/api';
import StepWizard from '../components/Wizard/StepWizard';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

const WizardPage: React.FC = () => {
  const { user, isValidatedClient } = useAuth();
  const { loadFromServer, isSubmitted } = useWizardStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isValidatedClient) {
      loadWizardData();
    }
  }, [isValidatedClient]);

  const loadWizardData = async () => {
    try {
      const response = await wizardApi.getResponses();
      loadFromServer(response.data.data);
    } catch (error) {
      console.error('Error loading wizard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: { pathname: '/wizard' } }} replace />;
  }

  // Show validation pending message
  if (user.type === 'client' && !user.isValidated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="card max-w-md w-full text-center">
          <div className="w-16 h-16 bg-warning-100 dark:bg-warning-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="text-warning-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Account Validation Pending
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your account is currently being reviewed by our admin team. You'll be able to access the project wizard once your account is validated.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This usually takes 24-48 hours. You'll receive an email notification once approved.
          </p>
        </div>
      </div>
    );
  }

  // Redirect non-clients
  if (user.type !== 'client') {
    return <Navigate to="/admin" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading wizard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Project Brief Wizard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Help us understand your project requirements by completing this comprehensive questionnaire.
          </p>
          
          {isSubmitted && (
            <div className="mt-6 inline-flex items-center space-x-2 bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-300 px-4 py-2 rounded-lg">
              <CheckCircle size={20} />
              <span className="font-medium">Project brief submitted successfully!</span>
            </div>
          )}
        </div>

        {/* Wizard Component */}
        <StepWizard />
      </div>
    </div>
  );
};

export default WizardPage;