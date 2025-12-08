import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export const EditTaskModal = ({ item, onClose, onSave, isSaving = false }) => {
    const [content, setContent] = useState(item?.content || '');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('12:00');
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        if (item?.scheduledAt) {
            const date = new Date(item.scheduledAt);
            setSelectedDate(date);
            setCurrentMonth(date);
            const timeStr = date.toTimeString().slice(0, 5);
            setSelectedTime(timeStr);
        }
    }, [item]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        const [hours, minutes] = selectedTime.split(':');
        const scheduledAt = new Date(selectedDate);
        scheduledAt.setHours(parseInt(hours), parseInt(minutes), 0, 0);

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
                className="border border-border rounded-lg p-6 w-full max-w-md"
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
                            className="w-full px-3 py-2 bg-[#1C273E] rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#76FF72] focus:border-transparent"
                            style={{ border: '1px solid #FFFFFF' }}
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
                                className="w-full px-3 py-2 bg-[#1C273E] rounded-lg text-sm text-white cursor-default"
                                style={{ border: '1px solid #FFFFFF' }}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-2 uppercase" style={{ color: '#FFFFFF' }}>
                                Hora
                            </label>
                            <input
                                type="time"
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                className="w-full px-3 py-2 bg-[#1C273E] rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#76FF72] focus:border-transparent"
                                style={{ border: '1px solid #FFFFFF' }}
                            />
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
                            className="px-[18px] rounded-[48px] font-medium text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            style={{ background: '#76FF72', minWidth: '145px', height: '40px', gap: '6px' }}
                        >
                            {isSaving ? 'Guardando...' : 'Listo'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};
