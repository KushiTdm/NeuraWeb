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
      if (Array.isArray(response.data)) {
        setAvailableSlots(response.data);
      } else {
        console.error('API response is not an array:', response.data);
        generateMockSlots();
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
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
          available: Math.random() > 0.3,
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
      fetchAvailableSlots();
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
        weekday: 'short', 
        month: 'short', 
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 snap-y snap-mandatory overflow-y-auto">
      {/* Section principale - Pleine hauteur avec snap */}
      <section className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-16 pb-8 snap-start">
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col justify-center" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
          {/* Titre compact */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              {t('booking.title')}
            </h1>
            <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('booking.subtitle')}
            </p>
          </div>

          {/* Contenu principal - Grid avec hauteurs calculées */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 flex-1 overflow-hidden">
            
            {/* Available Time Slots */}
            <div className="order-2 lg:order-1 flex flex-col min-h-0">
              <div className="flex items-center space-x-2 mb-3">
                <Calendar className="text-primary-600" size={18} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('booking.select')}
                </h3>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 flex-1 overflow-hidden">
                {/* Container avec scroll snap pour les créneaux */}
                <div className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent pr-2 -mr-2">
                  <div className="space-y-2">
                    {Array.isArray(availableSlots) && availableSlots.length > 0 ? (
                      availableSlots.map((slot) => {
                        const { date, time } = formatDateTime(slot.datetime);
                        const isSelected = selectedSlot === slot.id;
                        
                        return (
                          <button
                            key={slot.id}
                            onClick={() => slot.available && handleSlotSelect(slot.id)}
                            disabled={!slot.available}
                            className={`w-full p-3 rounded-lg border-2 text-left transition-all snap-start ${
                              isSelected
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                : slot.available
                                ? 'border-gray-200 dark:border-gray-600 hover:border-primary-300 bg-white dark:bg-gray-800 hover:shadow-md'
                                : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 opacity-50 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="min-w-0 flex-1">
                                <p className={`font-medium text-sm ${
                                  isSelected ? 'text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-white'
                                }`}>
                                  {date}
                                </p>
                                <div className="flex items-center space-x-1 mt-1">
                                  <Clock size={12} className={
                                    isSelected ? 'text-primary-600' : 'text-gray-500 dark:text-gray-400'
                                  } />
                                  <span className={`text-xs ${
                                    isSelected ? 'text-primary-600' : 'text-gray-500 dark:text-gray-400'
                                  }`}>
                                    {time}
                                  </span>
                                </div>
                              </div>
                              <div className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-3 ${
                                slot.available
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                              }`}>
                                {slot.available ? t('booking.available') : t('booking.booked')}
                              </div>
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400 h-full flex flex-col justify-center snap-start">
                        <Calendar size={40} className="mx-auto mb-3 opacity-50" />
                        <p>{t('booking.no.slots') || 'No available slots at the moment.'}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="order-1 lg:order-2 flex flex-col min-h-0">
              <div className="flex items-center space-x-2 mb-3">
                <User className="text-primary-600" size={18} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('booking.info.title')}
                </h3>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('contact.name')}
                      </label>
                      <input
                        type="text"
                        id="name"
                        {...register('name', { required: t('common.name.required') })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all text-sm"
                        placeholder="John Doe"
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all text-sm"
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('booking.phone')}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        {...register('phone')}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all text-sm"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('booking.discuss')}
                      </label>
                      <textarea
                        id="message"
                        rows={3}
                        {...register('message')}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all resize-vertical text-sm"
                        placeholder={t('booking.discuss.placeholder')}
                      />
                    </div>

                    {/* Créneau sélectionné */}
                    {selectedSlot && (
                      <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-3">
                        <h4 className="font-medium text-primary-800 dark:text-primary-200 mb-1 flex items-center text-sm">
                          <Calendar size={14} className="mr-1" />
                          {t('booking.selected')}
                        </h4>
                        {(() => {
                          const slot = availableSlots.find(s => s.id === selectedSlot);
                          if (slot) {
                            const { date, time } = formatDateTime(slot.datetime);
                            return (
                              <p className="text-primary-700 dark:text-primary-300 text-xs">
                                {date} {t('booking.meeting.time')} {time}
                              </p>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    )}

                    {/* Bouton de soumission */}
                    <button
                      type="submit"
                      disabled={isSubmitting || !selectedSlot}
                      className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl text-sm"
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Calendar size={16} />
                          <span>{t('booking.book')}</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section footer avec snap pour le scroll */}
      <section className="snap-start">
        {/* Le footer sera ici via le Layout */}
      </section>
    </div>
  );
};

export default BookingPage;