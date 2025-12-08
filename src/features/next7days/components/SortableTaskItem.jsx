import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { List, MoreVertical } from 'lucide-react';
import { useTheme } from '@/shared/contexts/AppContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const SortableTaskItem = ({ item, onToggle, onDelete, onEdit, onViewList, isToggling }) => {
    const { theme } = useTheme();
    const isDarkTheme = theme === 'dark';
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: isDragging
            ? `${CSS.Transform.toString(transform)} rotate(-3deg)`
            : CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handCursor = `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8.84442 5.7C9.25962 5.7 9.59562 6.036 9.59562 6.45V9C9.59562 9.2387 9.69044 9.46761 9.85922 9.6364C10.028 9.80518 10.2569 9.9 10.4956 9.9C10.7343 9.9 10.9632 9.80518 11.132 9.6364C11.3008 9.46761 11.3956 9.2387 11.3956 9V4.65C11.3956 4.55151 11.415 4.45398 11.4527 4.36299C11.4904 4.27199 11.5456 4.18931 11.6153 4.11967C11.6849 4.05003 11.7676 3.99478 11.8586 3.95709C11.9496 3.9194 12.0471 3.9 12.1456 3.9C12.2441 3.9 12.3416 3.9194 12.4326 3.95709C12.5236 3.99478 12.6063 4.05003 12.6759 4.11967C12.7456 4.18931 12.8008 4.27199 12.8385 4.36299C12.8762 4.45398 12.8956 4.55151 12.8956 4.65V8.4C12.8956 8.6387 12.9904 8.86761 13.1592 9.0364C13.328 9.20518 13.5569 9.3 13.7956 9.3C14.0343 9.3 14.2632 9.20518 14.432 9.0364C14.6008 8.86761 14.6956 8.6387 14.6956 8.4V5.8488C14.6958 5.64989 14.7749 5.45919 14.9157 5.31865C15.0565 5.17811 15.2473 5.09924 15.4462 5.0994C15.6451 5.09956 15.8358 5.17873 15.9764 5.31949C16.1169 5.46026 16.1958 5.65109 16.1956 5.85V9C16.1956 9.2387 16.2904 9.46761 16.4592 9.6364C16.628 9.80518 16.8569 9.9 17.0956 9.9C17.3343 9.9 17.5632 9.80518 17.732 9.6364C17.9008 9.46761 17.9956 9.2387 17.9956 9V7.8C17.9956 7.72044 18.0272 7.64413 18.0835 7.58787C18.1397 7.53161 18.2161 7.5 18.2956 7.5H18.7456C19.1596 7.5 19.4956 7.836 19.4956 8.25V13.8L19.5004 13.8924C19.4764 15.9996 18.6844 17.5212 17.5528 18.5268C16.3876 19.5624 14.8084 20.1 13.2004 20.1C10.0852 20.1 7.92042 18.0504 6.17562 15.1428L6.14562 15.0948C5.75235 14.4949 5.37107 13.8871 5.00202 13.272C4.32042 12.1488 5.02362 10.7232 6.29562 10.524V12C6.29562 12.2387 6.39044 12.4676 6.55922 12.6364C6.728 12.8052 6.95692 12.9 7.19562 12.9C7.43431 12.9 7.66323 12.8052 7.83201 12.6364C8.0008 12.4676 8.09562 12.2387 8.09562 12V6.45C8.09562 6.036 8.43042 5.7 8.84442 5.7Z' fill='white'/%3E%3C/svg%3E") 12 12, grab`;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
        >
            <div
                className="group relative w-full rounded-lg transition-all py-2 px-4 hover:opacity-90"
                style={{
                    cursor: handCursor,
                    backgroundColor: 'var(--task-bg)'
                }}
                {...listeners}
            >
                <div className="flex items-center gap-3 w-full">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onToggle(item.id);
                        }}
                        className="flex-shrink-0"
                        type="button"
                        disabled={isToggling}
                    >
                        <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${item.isCompleted
                                ? 'border-gray-500 bg-gray-500'
                                : 'hover:border-primary bg-transparent'
                                }`}
                            style={{ borderColor: item.isCompleted ? undefined : (isDarkTheme ? '#FFFFFF' : '#050912'), borderWidth: '1.5px' }}
                        >
                            {isToggling ? (
                                <svg
                                    className="w-3 h-3 text-white animate-spin"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                            ) : item.isCompleted ? (
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
                            ) : null}
                        </div>
                    </button>

                    <div className="flex-1 flex flex-row md:flex-row md:items-start gap-2">
                        <div className="flex-1 flex flex-col gap-1 min-w-0">
                            {/* Título de la lista - oculto en mobile */}
                            <div className="hidden md:block text-[10px] uppercase tracking-wide font-medium whitespace-nowrap" style={{ color: '#888899' }}>
                                MIS LISTAS &gt; {item.list?.title || 'PERSONAL'}
                            </div>
                            {/* Contenido de la tarea */}
                            <span
                                className={`text-md leading-snug ${item.isCompleted
                                    ? 'line-through text-gray-500'
                                    : 'text-foreground'
                                    }`}
                            >
                                {item.content}
                            </span>
                            {/* Hora específica - Desktop: 3ra fila */}
                            {item.scheduledAt && (() => {
                                const date = new Date(item.scheduledAt);
                                const hours = date.getHours();
                                const minutes = date.getMinutes();
                                if (hours !== 0 || minutes !== 0) {
                                    const period = hours >= 12 ? 'PM' : 'AM';
                                    const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
                                    const timeStr = `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
                                    return (
                                        <span className="hidden md:block text-xs text-white/70 mt-1">
                                            {timeStr}
                                        </span>
                                    );
                                }
                                return null;
                            })()}
                        </div>
                        {/* Hora específica - Mobile: 2da columna */}
                        {item.scheduledAt && (() => {
                            const date = new Date(item.scheduledAt);
                            const hours = date.getHours();
                            const minutes = date.getMinutes();
                            if (hours !== 0 || minutes !== 0) {
                                const period = hours >= 12 ? 'PM' : 'AM';
                                const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
                                const timeStr = `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
                                return (
                                    <span className="md:hidden text-xs text-white/70 flex-shrink-0">
                                        {timeStr}
                                    </span>
                                );
                            }
                            return null;
                        })()}
                    </div>

                    {item.isCompleted ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(item.id);
                            }}
                            className="flex-shrink-0 p-1 hover:bg-destructive/10 rounded transition-colors"
                            type="button"
                        >
                            <svg className="w-4 h-4 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex-shrink-0 p-1 hover:bg-accent/10 rounded transition-colors"
                                    type="button"
                                >
                                    <MoreVertical className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                side="bottom"
                                sideOffset={5}
                                className="w-32 border-border z-50 p-0"
                                style={{ backgroundColor: 'var(--dropdown-bg, #ffffff)' }}
                            >
                                <DropdownMenuItem
                                    onClick={() => onViewList && onViewList(item)}
                                    className="hover:bg-accent/10 cursor-pointer focus:bg-accent/10 py-3 px-3"
                                    style={{ borderBottom: '1px solid #34324A' }}
                                >
                                    <List className="w-4 h-4 mr-2" />
                                    Lista
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => onEdit && onEdit(item)}
                                    className="hover:bg-accent/10 cursor-pointer focus:bg-accent/10 py-3 px-3"
                                    style={{ borderBottom: '1px solid #34324A' }}
                                >
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        />
                                    </svg>
                                    Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => onDelete(item.id)}
                                    className="text-destructive focus:text-destructive hover:bg-accent/10 cursor-pointer focus:bg-accent/10 py-3 px-3"
                                >
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                    Eliminar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </div>
    );
};
