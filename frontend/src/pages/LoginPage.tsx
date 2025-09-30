// frontend/src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, User, Shield, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [userType, setUserType] = useState<'client' | 'admin'>('client');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const { register: registerField, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password, userType);
      toast.success(t('login.success'));
      navigate(userType === 'admin' ? '/admin' : from);
    } catch (error: any) {
      toast.error(error.message);
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
            {t('login.signin.title')}
          </h2>
          
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('login.signin.description') || 'Connectez-vous avec vos identifiants'}
          </p>
        </div>

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
              <span>{t('login.client')}</span>
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
              <span>{t('login.admin')}</span>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('login.email')}
              </label>
              <input
                type="email"
                id="email"
                {...registerField('email', { 
                  required: t('common.email.required'),
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: t('common.email.invalid')
                  }
                })}
                className="input-field"
                placeholder={userType === 'admin' ? t('login.email.placeholder.admin') : t('login.email.placeholder.client')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('login.password')}
                </label>
                <Link 
                  to="/request-password-reset" 
                  className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <input
                type="password"
                id="password"
                {...registerField('password', { 
                  required: t('common.password.required')
                })}
                className="input-field"
                placeholder={userType === 'admin' ? t('login.password.placeholder.admin') : t('login.password.placeholder.client')}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-error-600">{errors.password.message}</p>
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
                  <LogIn size={20} />
                  <span>{t('login.signin.button')}</span>
                </>
              )}
            </button>
          </form>

          {userType === 'client' && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
                <strong>Nouveau client ?</strong><br />
                Contactez-nous pour obtenir vos identifiants de connexion.
              </p>
              <div className="mt-3 text-center">
                <Link 
                  to="/contact" 
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Nous contacter
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;