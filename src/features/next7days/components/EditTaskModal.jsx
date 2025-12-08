import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export const EditTaskModal = ({ item, onClose, onSave, isSaving = false }) => {
    const [content, setContent] = useState(item?.content || '');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('12:00');
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);

    useEffect(() => {
        if (item?.scheduledAt) {
            const date = new Date(item.scheduledAt);
            setSelectedDate(date);
            setCurrentMonth(date);
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            setSelectedTime(timeStr);
        }
    }, [item]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showTimePicker && !e.target.closest('.time-picker-container')) {
                setShowTimePicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showTimePicker]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        const [hours, minutes] = selectedTime.split(':');
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const day = selectedDate.getDate();
        const scheduledAt = new Date(year, month, day, parseInt(hours), parseInt(minutes), 0, 0);

        onSave({
            itemId: item.id,
            updates: {
                content: content.trim(),
                scheduledAt: scheduledAt.toISOString()
            }
        });
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek };
    };

    const formatMonthYear = (date) => {
        const month = date.toLocaleDateString('es-ES', { month: 'long' });
        const year = date.getFullYear();
        return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
    };

    const isSameDay = (date1, date2) => {
        return date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear();
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const handleDateClick = (day) => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        setSelectedDate(newDate);
    };

    const isPastDate = (day) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);
        return date < today;
    };

    const generateTimeOptions = () => {
        const times = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 60) {
                const period = hour >= 12 ? 'PM' : 'AM';
                const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const timeDisplay = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
                times.push({ value: time24, display: timeDisplay });
            }
        }
        return times;
    };

    const timeOptions = generateTimeOptions();

    const handleTimeSelect = (timeValue) => {
        setSelectedTime(timeValue);
        setShowTimePicker(false);
    };

    const getTimeDisplay = (time24) => {
        const [hours, minutes] = time24.split(':');
        const hour = parseInt(hours);
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${displayHour}:${minutes} ${period}`;
    };

    const renderCalendar = () => {
        const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
        const days = [];

        const emptyDays = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1; // Lunes = 0
        for (let i = 0; i < emptyDays; i++) {
            days.push(<div key={`empty-${i}`} className="aspect-square" />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const isSelected = isSameDay(date, selectedDate);
            const isPast = isPastDate(day);

            days.push(
                <button
                    key={day}
                    type="button"
                    onClick={() => !isPast && handleDateClick(day)}
                    disabled={isPast}
                    className={`aspect-square flex items-center justify-center rounded-full text-sm transition-colors ${isPast
                        ? 'text-white/20 cursor-not-allowed'
                        : isSelected
                            ? 'bg-[#76FF72] text-black font-semibold'
                            : 'text-white hover:bg-white/10'
                        }`}
                >
                    {day}
                </button>
            );
        }

        return days;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", duration: 0.3 }}
                className="border border-border rounded-lg p-6 w-full max-w-md relative"
                style={{ background: '#0F1521' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Editar tarea</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        type="button"
                    >
                        <X className="w-5 h-5 text-white/70" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-medium mb-2 uppercase" style={{ color: '#FFFFFF' }}>
                            Tarea
                        </label>
                        <input
                            type="text"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg text-sm text-white focus:outline-none"
                            style={{ border: '1px solid #FFFFFF', background: '#0F1521' }}
                            placeholder="¿Qué necesitas hacer?"
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium mb-2 uppercase" style={{ color: '#FFFFFF' }}>
                                Fecha
                            </label>
                            <input
                                type="text"
                                value={selectedDate.toLocaleDateString('es-ES', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                })}
                                readOnly
                                className="w-full px-3 py-2 rounded-lg text-sm text-white cursor-default"
                                style={{ border: '1px solid #FFFFFF', background: '#0F1521' }}
                            />
                        </div>
                        <div className="relative time-picker-container">
                            <label className="block text-xs font-medium mb-2 uppercase" style={{ color: '#FFFFFF' }}>
                                Hora
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowTimePicker(!showTimePicker)}
                                className="w-full px-3 py-2 rounded-lg text-sm text-white focus:outline-none text-left flex items-center justify-between"
                                style={{ border: '1px solid #FFFFFF', background: '#0F1521' }}
                            >
                                <span>{getTimeDisplay(selectedTime)}</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {showTimePicker && (
                                <div
                                    className="absolute z-50 rounded-lg mt-1 overflow-y-auto"
                                    style={{
                                        border: '1px solid #FFFFFF',
                                        width: '100%',
                                        maxHeight: '196px',
                                        background: '#0F1521'
                                    }}
                                >
                                    {timeOptions.map((time) => (
                                        <button
                                            key={time.value}
                                            type="button"
                                            onClick={() => handleTimeSelect(time.value)}
                                            className="w-full px-3 py-2 text-left text-sm transition-colors text-white hover:bg-white/5"
                                            style={{
                                                color: '#FFFFFF',
                                                borderBottom: '1px dotted rgba(255, 255, 255, 0.2)'
                                            }}
                                        >
                                            {time.display}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                onClick={handlePrevMonth}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5 text-white" />
                            </button>
                            <h4 className="text-sm font-medium capitalize" style={{ color: '#FFFFFF' }}>
                                {formatMonthYear(currentMonth)}
                            </h4>
                            <button
                                type="button"
                                onClick={handleNextMonth}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <ChevronRight className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center">
                            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
                                <div key={index} className="text-xs font-medium py-2" style={{ color: '#FFFFFF' }}>
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {renderCalendar()}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving || !content.trim()}
                            className="px-[18px] py-4 rounded-[48px] font-medium text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ background: '#76FF72', minWidth: '145px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        >
                            {isSaving ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Guardando...
                                </>
                            ) : 'Listo'}
                        </button>
                    </div>
                </form>

                {isSaving && (
                    <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center backdrop-blur-sm">
                        <div className="bg-[#0F1521] rounded-lg p-6 flex flex-col items-center gap-3 border border-white/10">
                            <svg className="animate-spin h-8 w-8 text-[#76FF72]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="text-white text-sm font-medium">Guardando cambios...</p>
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};
