import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { subtasksService } from '@/shared/services/subtasks';

export const SubtasksModal = ({ item, onClose }) => {
    const [subtasks, setSubtasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubtasks = async () => {
            try {
                setLoading(true);
                const data = await subtasksService.getSubtasks(item.id);
                setSubtasks(data || []);
            } catch (error) {
                console.error('Error fetching subtasks:', error);
            } finally {
                setLoading(false);
            }
        };

        if (item?.id) {
            fetchSubtasks();
        }
    }, [item?.id]);

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-card border border-border rounded-lg w-full max-w-md max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <div>
                        <h3 className="text-lg font-semibold">{item.content}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                            {item.list?.name || 'PERSONAL'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-accent/10 rounded transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : subtasks.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>No hay subtareas</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {subtasks.map((subtask) => (
                                <div
                                    key={subtask.id}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border"
                                >
                                    <div
                                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${subtask.isCompleted
                                                ? 'border-gray-500 bg-gray-500'
                                                : 'border-white'
                                            }`}
                                        style={{ borderWidth: '1px' }}
                                    >
                                        {subtask.isCompleted && (
                                            <svg
                                                className="w-3 h-3 text-white"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={3}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                    <span
                                        className={`text-sm flex-1 ${subtask.isCompleted
                                                ? 'line-through text-gray-500'
                                                : 'text-foreground'
                                            }`}
                                    >
                                        {subtask.content}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
