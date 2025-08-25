// frontend/src/pages/BookingPage.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  selectedSlot: string;
}

interface TimeSlot {
  id: string;
  datetime: string;
  available: boolean;
}

const BookingPage: React.FC = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<BookingFormData>();

  useEffect(() => {
    fetchAvailableSlots();
  }, []);

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true);
      const response = await api.get('/booking/slots');
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('Error fetching slots:', error);
      // Generate mock slots for demo
      generateMockSlots();
    } finally {
      setLoading(false);
    }
  };

  const generateMockSlots = () => {
    const slots: TimeSlot[] = [];
    const now = new Date();
    
    // Generate slots for next 7 days
    for (let day = 1; day <= 7; day++) {
      const date = new Date(now);
      date.setDate(date.getDate() + day);
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      // Generate time slots (9 AM to 5 PM)
      for (let hour = 9; hour < 17; hour += 2) {
        const slotDate = new Date(date);
        slotDate.setHours(hour, 0, 0, 0);
        
        slots.push({
          id: `slot_${day}_${hour}`,
          datetime: slotDate.toISOString(),
          available: Math.random() > 0.3, // 70% availability
        });
      }
    }
    
    setAvailableSlots(slots);
  };

  const onSubmit = async (data: BookingFormData) => {
    if (!selectedSlot) {
      toast.error(t('booking.slot.select.error'));
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/booking', { ...data, selectedSlot });
      toast.success(t('booking.success'));
      setSelectedSlot('');
      fetchAvailableSlots(); // Refresh slots
    } catch (error) {
      toast.error(t('common.error'));
      console.error('Booking error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
    };
  };

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlot(slotId);
    setValue('selectedSlot', slotId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('booking.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('booking.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Time Slots */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-6">
              <Calendar className="text-primary-600" size={24} />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('booking.select')}
              </h3>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {availableSlots.map((slot) => {
                const { date, time } = formatDateTime(slot.datetime);
                const isSelected = selectedSlot === slot.id;
                
                return (
                  <button
                    key={slot.id}
                    onClick={() => slot.available && handleSlotSelect(slot.id)}
                    disabled={!slot.available}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : slot.available
                        ? 'border-gray-200 dark:border-gray-600 hover:border-primary-300 bg-white dark:bg-gray-800'
                        : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${
                          isSelected ? 'text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-white'
                        }`}>
                          {date}
                        </p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Clock size={14} className={
                            isSelected ? 'text-primary-600' : 'text-gray-500 dark:text-gray-400'
                          } />
                          <span className={`text-sm ${
                            isSelected ? 'text-primary-600' : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {time}
                          </span>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        slot.available
                          ? 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                      }`}>
                        {slot.available ? t('booking.available') : t('booking.booked')}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Booking Form */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-6">
              <User className="text-primary-600" size={24} />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('booking.info.title')}
              </h3>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('contact.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name', { required: t('common.name.required') })}
                  className="input-field"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-error-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('contact.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email', { 
                    required: t('common.email.required'),
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: t('common.email.invalid')
                    }
                  })}
                  className="input-field"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('booking.phone')}
                </label>
                <input
                  type="tel"
                  id="phone"
                  {...register('phone')}
                  className="input-field"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('booking.discuss')}
                </label>
                <textarea
                  id="message"
                  rows={4}
                  {...register('message')}
                  className="input-field"
                  placeholder={t('booking.discuss.placeholder')}
                />
              </div>

              {selectedSlot && (
                <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
                  <h4 className="font-medium text-primary-800 dark:text-primary-200 mb-2">
                    {t('booking.selected')}
                  </h4>
                  {(() => {
                    const slot = availableSlots.find(s => s.id === selectedSlot);
                    if (slot) {
                      const { date, time } = formatDateTime(slot.datetime);
                      return (
                        <p className="text-primary-700 dark:text-primary-300">
                          {date} {t('booking.meeting.time')} {time}
                        </p>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !selectedSlot}
                className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Calendar size={20} />
                    <span>{t('booking.book')}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;