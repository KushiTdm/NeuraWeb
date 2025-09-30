// frontend/src/pages/RequestPasswordResetPage.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, User, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';

interface RequestResetFormData {
  email: string;
}

const RequestPasswordResetPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [userType, setUserType] = useState<'client' | 'admin'>('client');
  const { isDark } = useTheme();
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RequestResetFormData>();
  const email = watch('email');

  const onSubmit = async (data: RequestResetFormData) => {
    setIsLoading(true);
    try {
      await api.post('/auth/request-reset', {
        email: data.email,
        userType,
      });

      setEmailSent(true);
      toast.success('Email de réinitialisation envoyé !');
    } catch (error: any) {
      console.error('Password reset request error:', error);
      
      // Même en cas d'erreur, on affiche le message de succès pour la sécurité
      setEmailSent(true);
      toast.success('Si cet email existe, un lien de réinitialisation a été envoyé.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Bouton retour */}
          <Link 
            to="/" 
            className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" />
            Retour à l'accueil
          </Link>
          
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center mb-8">
            <img 
              src={isDark ? "/assets/neurawebW.png" : "/assets/neurawebB.png"}
              alt="NeuraWeb Logo" 
              className="h-14 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div 
              className="h-14 w-14 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center"
              style={{ display: 'none' }}
            >
              <span className="text-white font-bold text-lg">NW</span>
            </div>
          </Link>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Mot de passe oublié ?
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        {!emailSent ? (
          <div className="card">
            {/* User Type Selection */}
            <div className="flex space-x-4 mb-6">
              <button
                type="button"
                onClick={() => setUserType('client')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg border-2 transition-colors ${
                  userType === 'client'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                }`}
              >
                <User size={20} />
                <span>Client</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType('admin')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg border-2 transition-colors ${
                  userType === 'admin'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                }`}
              >
                <Shield size={20} />
                <span>Admin</span>
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    {...register('email', { 
                      required: 'L\'email est requis',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Format d\'email invalide'
                      }
                    })}
                    className="input-field pl-10"
                    placeholder={userType === 'admin' ? 'admin@neuraweb.tech' : 'votre@email.com'}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Mail size={20} />
                    <span>Envoyer le lien</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link 
                to="/login" 
                className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                <ArrowLeft size={16} className="mr-1" />
                Retour à la connexion
              </Link>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>ℹ️ Information :</strong><br />
                Vous recevrez un email avec un lien de réinitialisation valable pendant 1 heure.
              </p>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="text-center space-y-4">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20">
                <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Email envoyé !
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400">
                Si un compte existe avec l'adresse <strong>{email}</strong>, vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.
              </p>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  <strong>⚠️ Important :</strong><br />
                  • Vérifiez votre boîte de réception et vos spams<br />
                  • Le lien expire dans 1 heure<br />
                  • N'utilisez le lien qu'une seule fois
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <Link 
                  to="/login" 
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <ArrowLeft size={20} />
                  <span>Retour à la connexion</span>
                </Link>
                
                <button
                  onClick={() => setEmailSent(false)}
                  className="w-full btn-outline text-sm"
                >
                  Renvoyer un email
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestPasswordResetPage;