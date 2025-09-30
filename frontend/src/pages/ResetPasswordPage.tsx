// frontend/src/pages/ResetPasswordPage.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';

interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const { isDark } = useTheme();

  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: '',
    color: ''
  });

  const { register, handleSubmit, formState: { errors }, watch } = useForm<ResetPasswordFormData>();
  const newPassword = watch('newPassword');

  // Vérifier si le token est présent
  useEffect(() => {
    if (!token) {
      toast.error('Token de réinitialisation manquant');
      navigate('/login');
    }
  }, [token, navigate]);

  // Calculer la force du mot de passe
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength({ score: 0, label: '', color: '' });
      return;
    }

    let score = 0;
    
    // Longueur
    if (newPassword.length >= 8) score++;
    if (newPassword.length >= 12) score++;
    
    // Majuscule
    if (/[A-Z]/.test(newPassword)) score++;
    
    // Minuscule
    if (/[a-z]/.test(newPassword)) score++;
    
    // Chiffre
    if (/\d/.test(newPassword)) score++;
    
    // Caractère spécial
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;

    let label = '';
    let color = '';
    
    if (score <= 2) {
      label = 'Faible';
      color = 'text-error-600 dark:text-error-400';
    } else if (score <= 4) {
      label = 'Moyen';
      color = 'text-warning-600 dark:text-warning-400';
    } else {
      label = 'Fort';
      color = 'text-success-600 dark:text-success-400';
    }

    setPasswordStrength({ score, label, color });
  }, [newPassword]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Token manquant');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/perform-reset', {
        token,
        newPassword: data.newPassword,
      });

      setResetSuccess(true);
      toast.success('Mot de passe réinitialisé avec succès !');
      
      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      const errorMessage = error.response?.data?.error || 'Erreur lors de la réinitialisation';
      toast.error(errorMessage);
      
      // Si le token est invalide/expiré, rediriger vers la demande
      if (errorMessage.includes('Invalid') || errorMessage.includes('expired')) {
        setTimeout(() => {
          navigate('/request-password-reset');
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return null;
  }

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
            Nouveau mot de passe
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Créez un mot de passe sécurisé pour votre compte
          </p>
        </div>

        {!resetSuccess ? (
          <div className="card">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="newPassword"
                    {...register('newPassword', { 
                      required: 'Le mot de passe est requis',
                      minLength: {
                        value: 8,
                        message: 'Le mot de passe doit contenir au moins 8 caractères'
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
                      }
                    })}
                    className="input-field pl-10 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
                {/* Indicateur de force du mot de passe */}
                {newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Force du mot de passe</span>
                      <span className={`text-xs font-medium ${passwordStrength.color}`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength.score <= 2
                            ? 'bg-error-500'
                            : passwordStrength.score <= 4
                            ? 'bg-warning-500'
                            : 'bg-success-500'
                        }`}
                        style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-error-600">{errors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    {...register('confirmPassword', { 
                      required: 'Veuillez confirmer le mot de passe',
                      validate: (value) => value === newPassword || 'Les mots de passe ne correspondent pas'
                    })}
                    className="input-field pl-10 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-error-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Critères de sécurité */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Le mot de passe doit contenir :
                </p>
                <div className="space-y-1 text-sm">
                  <div className={`flex items-center space-x-2 ${newPassword && newPassword.length >= 8 ? 'text-success-600' : 'text-gray-500'}`}>
                    {newPassword && newPassword.length >= 8 ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    <span>Au moins 8 caractères</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${newPassword && /[A-Z]/.test(newPassword) ? 'text-success-600' : 'text-gray-500'}`}>
                    {newPassword && /[A-Z]/.test(newPassword) ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    <span>Une lettre majuscule</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${newPassword && /[a-z]/.test(newPassword) ? 'text-success-600' : 'text-gray-500'}`}>
                    {newPassword && /[a-z]/.test(newPassword) ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    <span>Une lettre minuscule</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${newPassword && /\d/.test(newPassword) ? 'text-success-600' : 'text-gray-500'}`}>
                    {newPassword && /\d/.test(newPassword) ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    <span>Un chiffre</span>
                  </div>
                </div>
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
                    <Lock size={20} />
                    <span>Réinitialiser le mot de passe</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="card">
            <div className="text-center space-y-4">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Mot de passe réinitialisé !
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400">
                Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Redirection automatique dans 3 secondes...
              </p>

              <Link 
                to="/login" 
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <Lock size={20} />
                <span>Se connecter maintenant</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;