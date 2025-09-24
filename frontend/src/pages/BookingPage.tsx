import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, User, CheckCircle, ChevronLeft, ChevronRight, Mail, Phone, MessageSquare, ArrowRight } from 'lucide-react';
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
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [daySlots, setDaySlots] = useState<DaySlots[]>([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<BookingFormData>();

  const steps = [
    { id: 'date', title: t('booking.step.date') || 'Choisir une date', icon: Calendar },
    { id: 'time', title: t('booking.step.time') || 'Sélectionner l\'heure', icon: Clock },
    { id: 'info', title: t('booking.step.info') || 'Vos informations', icon: User },
    { id: 'confirm', title: t('booking.step.confirm') || 'Confirmation', icon: CheckCircle }
  ];

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
    
    for (let day = 1; day <= 7; day++) {
      const date = new Date(now);
      date.setDate(date.getDate() + day);
      
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
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
      toast.error(t('booking.slot.select.error') || 'Veuillez sélectionner un créneau');
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
        toast.success(response.data.message || t('booking.success') || 'Réservation confirmée !');
        setCurrentStep(3);
        fetchAvailableSlots();
      } else {
        toast.error(response.data.error || 'Erreur lors de la réservation');
      }
    } catch (error: any) {
      console.error('❌ Booking error details:', error);
      console.error('❌ Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.error || error.message || t('common.error') || 'Une erreur est survenue';
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
    setCurrentStep(1);
    setSelectedSlot('');
  };

  const handleSlotSelect = (slotId: string) => {
    console.log('🎯 Selecting slot:', slotId);
    setSelectedSlot(slotId);
    setValue('selectedSlot', slotId);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return selectedDay !== '';
      case 1: return selectedSlot !== '';
      case 2: return true; // La validation du formulaire se fait dans onSubmit
      default: return true;
    }
  };

  const getSelectedDayData = () => {
    return daySlots.find(day => day.date === selectedDay);
  };

  const getSelectedSlotData = () => {
    return availableSlots.find(slot => slot.id === selectedSlot);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">{t('common.loading') || 'Chargement...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 pt-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('booking.title') || 'Réserver un rendez-vous'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('booking.subtitle') || 'Choisissez votre créneau préféré et remplissez vos informations'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  index <= currentStep 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                }`}>
                  <step.icon size={20} />
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium transition-colors duration-300 ${
                    index <= currentStep ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 md:w-16 h-0.5 mx-4 transition-colors duration-300 ${
                    index < currentStep ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 md:p-8">
            
            {/* Step 0: Date Selection */}
            {currentStep === 0 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                  {t('booking.select.day') || 'Sélectionnez un jour'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {daySlots.length > 0 ? (
                    daySlots.map((day) => {
                      const availableCount = day.slots.filter(slot => slot.available).length;
                      const isSelected = selectedDay === day.date;
                      
                      return (
                        <button
                          key={day.date}
                          onClick={() => handleDaySelect(day.date)}
                          disabled={availableCount === 0}
                          className={`p-4 rounded-xl border-2 text-left transition-all duration-200 transform hover:scale-105 ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                              : availableCount > 0
                              ? 'border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:shadow-md'
                              : 'border-gray-200 dark:border-gray-600 opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex flex-col items-center text-center">
                            <h3 className={`font-bold text-lg ${
                              isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'
                            }`}>
                              {day.displayDate}
                            </h3>
                            <p className={`text-sm capitalize ${
                              isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {day.weekday}
                            </p>
                            <div className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                              availableCount > 0
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                            }`}>
                              {availableCount > 0 
                                ? `${availableCount} ${t('booking.slots.available') || 'créneaux disponibles'}` 
                                : t('booking.slots.full') || 'Complet'}
                            </div>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                      <Calendar size={40} className="mx-auto mb-3 opacity-50" />
                      <p>{t('booking.no.days') || 'Aucun jour disponible'}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 1: Time Selection */}
            {currentStep === 1 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  {t('booking.select.time') || 'Choisissez votre heure'}
                </h2>
                {selectedDay && (
                  <>
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center bg-blue-100 dark:bg-blue-900/20 px-4 py-2 rounded-lg">
                        <Calendar size={16} className="text-blue-600 mr-2" />
                        <span className="text-blue-700 dark:text-blue-300 font-medium">
                          {getSelectedDayData()?.displayDate} - {getSelectedDayData()?.weekday}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-80 overflow-y-auto">
                      {getSelectedDayData()?.slots.map((slot) => {
                        const isSelected = selectedSlot === slot.id;
                        const time = formatTime(slot.datetime);
                        
                        return (
                          <button
                            key={slot.id}
                            onClick={() => slot.available && handleSlotSelect(slot.id)}
                            disabled={!slot.available}
                            className={`p-4 rounded-xl border-2 text-center transition-all duration-200 transform hover:scale-105 ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                                : slot.available
                                ? 'border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:shadow-md'
                                : 'border-gray-200 dark:border-gray-600 opacity-50 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex flex-col items-center">
                              <Clock size={20} className={`mb-2 ${
                                isSelected ? 'text-blue-600' : slot.available ? 'text-gray-500 dark:text-gray-400' : 'text-gray-300'
                              }`} />
                              <span className={`font-medium ${
                                isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'
                              }`}>
                                {time}
                              </span>
                              <div className={`mt-1 px-2 py-0.5 rounded text-xs ${
                                slot.available
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                  : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                              }`}>
                                {slot.available 
                                  ? t('booking.time.available') || 'Disponible' 
                                  : t('booking.time.taken') || 'Pris'}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 2: Information Form */}
            {currentStep === 2 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                  {t('booking.info.title') || 'Vos Informations'}
                </h2>
                <div className="max-w-lg mx-auto space-y-6">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <User size={16} className="mr-2" />
                      {t('contact.name') || 'Nom complet'} *
                    </label>
                    <input
                      type="text"
                      {...register('name', { required: t('common.name.required') || 'Le nom est requis' })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Mail size={16} className="mr-2" />
                      {t('contact.email') || 'Email'} *
                    </label>
                    <input
                      type="email"
                      {...register('email', { 
                        required: t('common.email.required') || 'L\'email est requis',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: t('common.email.invalid') || 'Email invalide'
                        }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Phone size={16} className="mr-2" />
                      {t('booking.phone') || 'Téléphone'}
                    </label>
                    <input
                      type="tel"
                      {...register('phone')}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <MessageSquare size={16} className="mr-2" />
                      {t('booking.discuss') || 'Message (optionnel)'}
                    </label>
                    <textarea
                      rows={4}
                      {...register('message')}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all resize-vertical"
                      placeholder={t('booking.discuss.placeholder') || 'Dites-nous ce que vous aimeriez discuter...'}
                    />
                  </div>

                  {/* Récapitulatif de la sélection */}
                  {selectedSlot && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-3 flex items-center">
                        <Calendar size={16} className="mr-2" />
                        {t('booking.selected') || 'Créneau sélectionné'}
                      </h4>
                      {(() => {
                        const selectedSlotData = getSelectedSlotData();
                        const selectedDayData = getSelectedDayData();
                        if (selectedSlotData && selectedDayData) {
                          return (
                            <div className="text-blue-700 dark:text-blue-300">
                              <p className="font-medium">{selectedDayData.displayDate} - {selectedDayData.weekday}</p>
                              <p className="text-sm mt-1">{formatTime(selectedSlotData.datetime)}</p>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <div className="animate-fade-in text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {t('booking.success') || 'Réservation confirmée !'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Votre rendez-vous a été confirmé avec succès !
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 max-w-md mx-auto">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Récapitulatif</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{getSelectedDayData()?.displayDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Heure:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{getSelectedSlotData() && formatTime(getSelectedSlotData()!.datetime)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          {currentStep < 3 && (
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 md:px-8">
              <div className="flex justify-between items-center">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} className="mr-1" />
                  {t('booking.previous') || 'Précédent'}
                </button>

                {currentStep < 2 ? (
                  <button
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                  >
                    {t('booking.next') || 'Suivant'}
                    <ChevronRight size={20} className="ml-1" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={!canProceed() || isSubmitting}
                    className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    ) : (
                      <CheckCircle size={20} className="mr-2" />
                    )}
                    {t('booking.book') || 'Confirmer la réservation'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BookingPage;
