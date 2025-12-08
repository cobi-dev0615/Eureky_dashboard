import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';

export const ChangeListModal = ({ item, lists = [], onClose, onChangeList, isChanging = false }) => {
    const handleListSelect = (listId) => {
        if (listId !== item.listId) {
            onChangeList({ itemId: item.id, newListId: listId });
        }
    };

    const currentList = lists.find(list => list.id === item.listId);

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
                className="border border-white/10 rounded-lg p-6 w-full max-w-md relative"
                style={{ background: '#0F1521' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Cambiar lista</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        type="button"
                    >
                        <X className="w-5 h-5 text-white/70" />
                    </button>
                </div>

                {/* Tarea actual */}
                <div className="mb-4 p-3 bg-[#1C273E] rounded-lg border border-white/10">
                    <p className="text-sm text-white/70 mb-1">Tarea:</p>
                    <p className="text-white font-medium">{item.content}</p>
                    {currentList && (
                        <p className="text-xs text-white/50 mt-2">
                            Lista actual: <span className="text-white/70">{currentList.name || currentList.title}</span>
                        </p>
                    )}
                </div>

                {/* Lista de listas */}
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {lists.map((list) => (
                        <button
                            key={list.id}
                            onClick={() => handleListSelect(list.id)}
                            disabled={isChanging || list.id === item.listId}
                            className={`w-full p-3 rounded-lg border transition-all text-left ${list.id === item.listId
                                    ? 'bg-[#76FF72]/10 border-[#76FF72] cursor-default'
                                    : 'bg-[#1C273E] border-white/10 hover:border-white/30 hover:bg-[#1C273E]/80'
                                } ${isChanging ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-white font-medium">{list.name || list.title}</p>
                                    {list.description && (
                                        <p className="text-xs text-white/50 mt-1">{list.description}</p>
                                    )}
                                </div>
                                {list.id === item.listId && (
                                    <Check className="w-5 h-5 text-[#76FF72] flex-shrink-0 ml-2" />
                                )}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Overlay de carga */}
                {isChanging && (
                    <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center backdrop-blur-sm">
                        <div className="bg-[#0F1521] rounded-lg p-6 flex flex-col items-center gap-3 border border-white/10">
                            <svg className="animate-spin h-8 w-8 text-[#76FF72]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="text-white text-sm font-medium">Cambiando lista...</p>
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};
