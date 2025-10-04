// frontend/src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import QuotePage from './pages/QuotePage';
import BookingPage from './pages/BookingPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import WizardPage from './pages/WizardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import RequestPasswordResetPage from './pages/RequestPasswordResetPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ServicePage from './pages/ServicePage';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <div className="App">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/request-password-reset" element={<RequestPasswordResetPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/*" element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/services" element={<ServicePage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/quote" element={<QuotePage />} />
                    <Route path="/booking" element={<BookingPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/admin/dashboard" element={<AdminDashboardPage />} /> 
                    <Route path="/wizard" element={<WizardPage />} />
                  </Routes>
                </Layout>
              } />
            </Routes>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                className: 'dark:bg-gray-800 dark:text-white',
              }}
            />
          </div>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;