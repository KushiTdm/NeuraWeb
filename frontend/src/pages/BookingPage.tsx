// BookingPage.tsx - Version améliorée avec sélection jour/créneaux
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, User, ChevronLeft, ChevronRight } from 'lucide-react';
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

interface DaySlots {
  date: string;
  displayDate: string;
  weekday: string;
  slots: TimeSlot[];
}

const BookingPage: React.FC = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [daySlots, setDaySlots] = useState<DaySlots[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<'day' | 'time'>('day');
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<BookingFormData>();

  useEffect(() => {
    fetchAvailableSlots();
  }, []);

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching slots from API...');
      
      const response = await api.get('/booking/availability');
      console.log('📡 API Response:', response.data);

      let slots: TimeSlot[] = [];

      if (response.data && response.data.success && response.data.data && response.data.data.slots) {
        console.log('✅ Found slots:', response.data.data.slots);
        slots = response.data.data.slots;
      } else if (Array.isArray(response.data)) {
        console.log('📋 Legacy API format detected');
        slots = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        console.log('📋 Alternative API format detected');
        slots = response.data.data;
      } else {
        console.error('❌ Unexpected API response structure:', response.data);
        console.log('🎭 Generating mock slots...');
        slots = generateMockSlots();
      }

      setAvailableSlots(slots);
      organizeDaySlots(slots);
    } catch (error) {
      console.error('❌ Error fetching slots:', error);
      console.log('🎭 Generating mock slots due to error...');
      const mockSlots = generateMockSlots();
      setAvailableSlots(mockSlots);
      organizeDaySlots(mockSlots);
    } finally {
      setLoading(false);
    }
  };

  const generateMockSlots = (): TimeSlot[] => {
    console.log('🎭 Generating mock slots...');
    const slots: TimeSlot[] = [];
    const now = new Date();
    
    // Generate slots for next 7 days
    for (let day = 1; day <= 7; day++) {
      const date = new Date(now);
      date.setDate(date.getDate() + day);
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      // Generate time slots (9 AM, 11 AM, 2 PM, 4 PM)
      const hours = [9, 11, 14, 16];
      hours.forEach(hour => {
        const slotDate = new Date(date);
        slotDate.setHours(hour, 0, 0, 0);
        
        slots.push({
          id: `slot_${day}_${hour}`,
          datetime: slotDate.toISOString(),
          available: Math.random() > 0.3,
        });
      });
    }
    
    console.log('✅ Generated mock slots:', slots.length);
    return slots;
  };

  const organizeDaySlots = (slots: TimeSlot[]) => {
    const groupedByDate = new Map<string, TimeSlot[]>();
    
    slots.forEach(slot => {
      const date = new Date(slot.datetime);
      const dateKey = date.toDateString();
      
      if (!groupedByDate.has(dateKey)) {
        groupedByDate.set(dateKey, []);
      }
      groupedByDate.get(dateKey)!.push(slot);
    });

    const daySlots: DaySlots[] = Array.from(groupedByDate.entries())
      .map(([dateKey, daySlots]) => {
        const date = new Date(dateKey);
        return {
          date: dateKey,
          displayDate: date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          }),
          weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
          slots: daySlots.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setDaySlots(daySlots);
  };

  const onSubmit = async (data: BookingFormData) => {
    console.log('🚀 Form submission started');
    console.log('📝 Form data:', data);
    console.log('🎯 Selected slot ID:', selectedSlot);

    if (!selectedSlot) {
      toast.error(t('booking.slot.select.error'));
      return;
    }

    const selectedSlotData = availableSlots.find(slot => slot.id === selectedSlot);
    console.log('🔍 Found slot data:', selectedSlotData);

    if (!selectedSlotData) {
      toast.error('Slot sélectionné invalide');
      console.error('❌ Selected slot not found in available slots');
      return;
    }

    const testDate = new Date(selectedSlotData.datetime);
    if (isNaN(testDate.getTime())) {
      toast.error('Format de date invalide');
      console.error('❌ Invalid datetime format:', selectedSlotData.datetime);
      return;
    }

    setIsSubmitting(true);
    try {
      const bookingData = {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        datetime: selectedSlotData.datetime,
        phone: data.phone?.trim() || undefined,
        message: data.message?.trim() || undefined,
      };

      console.log('📡 Sending to API:', bookingData);

      const response = await api.post('/booking/create', bookingData);
      
      console.log('✅ Booking response:', response.data);
      
      if (response.data.success) {
        toast.success(response.data.message || t('booking.success'));
        // Reset form
        setSelectedSlot('');
        setSelectedDay('');
        setCurrentStep('day');
        setValue('name', '');
        setValue('email', '');
        setValue('phone', '');
        setValue('message', '');
        // Refresh slots
        fetchAvailableSlots();
      } else {
        toast.error(response.data.error || 'Erreur lors de la réservation');
      }
    } catch (error: any) {
      console.error('❌ Booking error details:', error);
      console.error('❌ Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.error || error.message || t('common.error');
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (dateTime: string) => {
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) {
      return 'Invalid Time';
    }
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleDaySelect = (dayKey: string) => {
    setSelectedDay(dayKey);
    setCurrentStep('time');
    setSelectedSlot(''); // Reset slot selection when changing day
  };

  const handleSlotSelect = (slotId: string) => {
    console.log('🎯 Selecting slot:', slotId);
    setSelectedSlot(slotId);
    setValue('selectedSlot', slotId);
  };

  const handleBackToDay = () => {
    setCurrentStep('day');
    setSelectedSlot('');
  };

  const getSelectedDayData = () => {
    return daySlots.find(day => day.date === selectedDay);
  };

  const getSelectedSlotData = () => {
    return availableSlots.find(slot => slot.id === selectedSlot);
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
      <section className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-16 pb-8 snap-start">
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col justify-center" style={{ maxHeight: 'calc(100vh - 4rem)' }}>

          {/* Titre */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              {t('booking.title')}
            </h1>
            <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('booking.subtitle')}
            </p>
          </div>

          {/* Contenu principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 flex-1 overflow-hidden">
            
            {/* Sélection Date/Heure */}
            <div className="order-2 lg:order-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="text-primary-600" size={18} />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {currentStep === 'day' ? t('booking.select.day') || 'Choisir un jour' : t('booking.select.time') || 'Choisir un créneau'}
                  </h3>
                </div>
                {currentStep === 'time' && (
                  <button
                    onClick={handleBackToDay}
                    className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    <ChevronLeft size={16} />
                    <span className="text-sm">Retour</span>
                  </button>
                )}
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent pr-2 -mr-2">
                  
                  {/* Étape 1: Sélection du jour */}
                  {currentStep === 'day' && (
                    <div className="space-y-3">
                      {daySlots.length > 0 ? (
                        daySlots.map((day) => {
                          const availableCount = day.slots.filter(slot => slot.available).length;
                          const isSelected = selectedDay === day.date;
                          
                          return (
                            <button
                              key={day.date}
                              onClick={() => handleDaySelect(day.date)}
                              disabled={availableCount === 0}
                              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                                isSelected
                                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                  : availableCount > 0
                                  ? 'border-gray-200 dark:border-gray-600 hover:border-primary-300 bg-white dark:bg-gray-800 hover:shadow-md'
                                  : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 opacity-50 cursor-not-allowed'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className={`font-semibold text-lg ${
                                    isSelected ? 'text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-white'
                                  }`}>
                                    {day.displayDate}
                                  </h4>
                                  <p className={`text-sm mt-1 ${
                                    isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
                                  }`}>
                                    {day.weekday}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    availableCount > 0
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                      : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                                  }`}>
                                    {availableCount > 0 ? `${availableCount} créneaux` : 'Complet'}
                                  </div>
                                  {availableCount > 0 && (
                                    <ChevronRight size={16} className={`mt-1 mx-auto ${
                                      isSelected ? 'text-primary-600' : 'text-gray-400'
                                    }`} />
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })
                      ) : (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                          <Calendar size={40} className="mx-auto mb-3 opacity-50" />
                          <p>Aucun jour disponible pour le moment</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Étape 2: Sélection de l'heure */}
                  {currentStep === 'time' && selectedDay && (
                    <div className="space-y-3">
                      {(() => {
                        const dayData = getSelectedDayData();
                        if (!dayData) return null;

                        return (
                          <>
                            {/* En-tête du jour sélectionné */}
                            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3 mb-4">
                              <h4 className="font-semibold text-primary-800 dark:text-primary-200">
                                {dayData.displayDate} - {dayData.weekday}
                              </h4>
                              <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">
                                Sélectionnez votre créneau préféré
                              </p>
                            </div>

                            {/* Créneaux disponibles */}
                            {dayData.slots.map((slot) => {
                              const isSelected = selectedSlot === slot.id;
                              const time = formatTime(slot.datetime);
                              
                              return (
                                <button
                                  key={slot.id}
                                  onClick={() => slot.available && handleSlotSelect(slot.id)}
                                  disabled={!slot.available}
                                  className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                                    isSelected
                                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                      : slot.available
                                      ? 'border-gray-200 dark:border-gray-600 hover:border-primary-300 bg-white dark:bg-gray-800 hover:shadow-md'
                                      : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 opacity-50 cursor-not-allowed'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <Clock size={18} className={
                                        isSelected ? 'text-primary-600' : slot.available ? 'text-gray-500 dark:text-gray-400' : 'text-gray-300'
                                      } />
                                      <span className={`font-medium ${
                                        isSelected ? 'text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-white'
                                      }`}>
                                        {time}
                                      </span>
                                    </div>
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      slot.available
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                        : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                                    }`}>
                                      {slot.available ? 'Libre' : 'Pris'}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Formulaire de réservation */}
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
                        {t('contact.name')} *
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
                        {t('contact.email')} *
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

                    {/* Récapitulatif de la sélection */}
                    {selectedSlot && (
                      <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-3">
                        <h4 className="font-medium text-primary-800 dark:text-primary-200 mb-2 flex items-center text-sm">
                          <Calendar size={14} className="mr-1" />
                          {t('booking.selected')}
                        </h4>
                        {(() => {
                          const selectedSlotData = getSelectedSlotData();
                          const selectedDayData = getSelectedDayData();
                          if (selectedSlotData && selectedDayData) {
                            return (
                              <div className="text-primary-700 dark:text-primary-300 text-sm">
                                <p className="font-medium">{selectedDayData.displayDate} - {selectedDayData.weekday}</p>
                                <p className="text-xs mt-1">{formatTime(selectedSlotData.datetime)}</p>
                              </div>
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
    </div>
  );
};

export default BookingPage;