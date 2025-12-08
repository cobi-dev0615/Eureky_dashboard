import { Plus } from 'lucide-react';
import { useTheme } from '@/shared/contexts/AppContext';

export const TaskInput = ({
  value,
  onChange,
  onSubmit,
  onListSelectorToggle,
  showListSelector,
  lists,
  selectedListId,
  onListSelect,
  isLoading,
}) => {
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  
  return (
    <form onSubmit={onSubmit} className="w-full mt-3 px-4 pb-3 flex-shrink-0">
      <div className="relative flex items-center gap-2 px-3 py-2 bg-card rounded-lg w-full border border-border">
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0" />
        ) : (
          <Plus className="w-4 h-4 flex-shrink-0" style={{ color: '#444358' }} />
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Agregar tarea"
          className="flex-1 bg-transparent text-sm focus:outline-none min-w-0 placeholder:text-[#444358]"
          style={{ color: isDarkTheme ? '#FFFFFF' : '#050912' }}
          disabled={isLoading}
        />
        {value.length > 0 && (
          <div className="relative">
            <button
              type="button"
              onClick={onListSelectorToggle}
              className="p-1 hover:bg-accent/10 rounded transition-colors"
            >
              <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {showListSelector && value.length > 1 && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(200, 200, 220, 0.3) transparent' }}>
                <div className="p-2">
                  <button
                    type="button"
                    onClick={() => onListSelect(null)}
                    className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-accent/10 transition-colors ${!selectedListId ? 'bg-accent/20' : ''
                      }`}
                  >
                    Lista por defecto
                  </button>
                  {lists.map((list) => (
                    <button
                      key={list.id}
                      type="button"
                      onClick={() => onListSelect(list.id)}
                      className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-accent/10 transition-colors ${selectedListId === list.id ? 'bg-accent/20' : ''
                        }`}
                    >
                      {list.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </form>
  );
};
