import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Clock } from 'lucide-react';

export const TaskNotifications = ({ items = [] }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const checkUpcomingTasks = () => {
            const now = new Date();
            const upcomingAlerts = [];

            items.forEach(item => {
                if (item.scheduledAt && !item.isCompleted) {
                    const scheduledDate = new Date(item.scheduledAt);
                    const timeDiff = scheduledDate.getTime() - now.getTime();
                    const minutesDiff = Math.floor(timeDiff / (1000 * 60));

                    // Alertas: 15 minutos antes, 5 minutos antes, y cuando llega la hora
                    if (minutesDiff === 15 || minutesDiff === 5 || (minutesDiff <= 0 && minutesDiff > -1)) {
                        const notificationId = `${item.id}-${minutesDiff}`;

                        // Verificar si ya existe esta notificación
                        const exists = notifications.some(n => n.id === notificationId);
                        if (!exists) {
                            upcomingAlerts.push({
                                id: notificationId,
                                itemId: item.id,
                                content: item.content,
                                scheduledAt: scheduledDate,
                                minutesLeft: minutesDiff,
                                listName: item.list?.name || 'Personal'
                            });
                        }
                    }
                }
            });

            if (upcomingAlerts.length > 0) {
                setNotifications(prev => [...prev, ...upcomingAlerts]);
            }
        };

        // Verificar cada minuto
        const interval = setInterval(checkUpcomingTasks, 60000);
        checkUpcomingTasks(); // Verificar inmediatamente

        return () => clearInterval(interval);
    }, [items, notifications]);

    const dismissNotification = (notificationId) => {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
    };

    const getNotificationMessage = (minutesLeft) => {
        if (minutesLeft <= 0) {
            return '¡Es hora!';
        } else if (minutesLeft === 5) {
            return 'En 5 minutos';
        } else if (minutesLeft === 15) {
            return 'En 15 minutos';
        }
        return `En ${minutesLeft} minutos`;
    };

    const getNotificationColor = (minutesLeft) => {
        if (minutesLeft <= 0) {
            return 'bg-red-500 border-red-600';
        } else if (minutesLeft === 5) {
            return 'bg-orange-500 border-orange-600';
        }
        return 'bg-blue-500 border-blue-600';
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
            <AnimatePresence>
                {notifications.map((notification) => (
                    <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 100, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={`${getNotificationColor(notification.minutesLeft)} border-2 rounded-lg p-4 shadow-lg`}
                    >
                        <div className="flex items-start gap-3">
                            {/* Icon */}
                            <div className="flex-shrink-0">
                                {notification.minutesLeft <= 0 ? (
                                    <Bell className="w-5 h-5 text-white animate-bounce" />
                                ) : (
                                    <Clock className="w-5 h-5 text-white" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-semibold text-white uppercase tracking-wide">
                                        {getNotificationMessage(notification.minutesLeft)}
                                    </span>
                                    <button
                                        onClick={() => dismissNotification(notification.id)}
                                        className="flex-shrink-0 p-0.5 hover:bg-white/20 rounded transition-colors"
                                        type="button"
                                    >
                                        <X className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                                <p className="text-sm font-medium text-white line-clamp-2">
                                    {notification.content}
                                </p>
                                <div className="flex items-center gap-2 mt-2 text-xs text-white/80">
                                    <span>{notification.listName}</span>
                                    <span>•</span>
                                    <span>
                                        {notification.scheduledAt.toLocaleTimeString('es-ES', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
