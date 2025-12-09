import { useMemo, useState } from 'react';
import { useAllUserItems, useAddItemToDefaultList, useToggleItemCompletion } from '@/features/lists/hooks/useListItemsQuery';
import { Check, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { startOfToday, startOfTomorrow, endOfTomorrow, addDays, isSameDay, isAfter, isBefore } from 'date-fns';

export const CalendarioSectionView = () => {
  // Fetch all incomplete tasks
  const { data: allItems = [], isLoading } = useAllUserItems({
    isCompleted: false,
    limit: 500
  });

  const toggleMutation = useToggleItemCompletion();
  const addItemMutation = useAddItemToDefaultList();
  const [newTaskContent, setNewTaskContent] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({
    'Hoy': true,
    'Mañana': true,
    'Próximos': true,
    'Algún día': true,
  });

  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskContent.trim()) return;

    addItemMutation.mutate(
      { content: newTaskContent.trim() },
      {
        onSuccess: () => {
          setNewTaskContent('');
        }
      }
    );
  };

  // Categorize tasks by date
  const categorizedTasks = useMemo(() => {
    const today = startOfToday();
    const tomorrow = startOfTomorrow();
    const tomorrowEnd = endOfTomorrow();
    const upcomingEnd = addDays(today, 30); // Next 30 days for "Próximos"

    const hoy = [];
    const manana = [];
    const proximos = [];
    const algunDia = [];

    allItems.forEach((item) => {
      if (!item.scheduledAt) {
        algunDia.push(item);
        return;
      }

      const scheduledDate = new Date(item.scheduledAt);

      if (isSameDay(scheduledDate, today)) {
        hoy.push(item);
      } else if (isSameDay(scheduledDate, tomorrow)) {
        manana.push(item);
      } else if (isAfter(scheduledDate, tomorrowEnd) && (isBefore(scheduledDate, upcomingEnd) || isSameDay(scheduledDate, upcomingEnd))) {
        proximos.push(item);
      } else {
        // Tasks scheduled beyond 30 days or in the past go to "Algún día"
        algunDia.push(item);
      }
    });

    return { hoy, manana, proximos, algunDia };
  }, [allItems]);

  const handleToggle = (itemId, e) => {
    e.stopPropagation();
    toggleMutation.mutate(itemId);
  };

  const TaskItem = ({ item }) => {
    return (
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 hover:bg-[#1C273E] transition-colors cursor-pointer",
          item.isCompleted && "opacity-60"
        )}
      >
        <div
          onClick={(e) => handleToggle(item.id, e)}
          className="w-4 h-4 rounded-full border-[1.5px] border-foreground flex items-center justify-center cursor-pointer flex-shrink-0"
        >
          {item.isCompleted && <Check className="w-3 h-3" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-[16px] leading-[1.5] font-normal",
            item.isCompleted && "line-through text-[#444358]"
          )}
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {item.content || item.title}
          </p>
        </div>
      </div>
    );
  };

  const CategorySection = ({ title, tasks }) => {
    const isExpanded = expandedCategories[title] ?? true;
    
    return (
      <>
        <div className="py-3">
          <button
            onClick={() => toggleCategory(title)}
            className="flex items-center justify-between w-full"
          >
            <h3 className="text-[16px] leading-[1.5] font-semibold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {title}
            </h3>
            {tasks.length > 0 && (
              isExpanded ? (
                <ChevronUp className="w-4 h-4 text-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-foreground" />
              )
            )}
          </button>
          {isExpanded && tasks.length > 0 && (
            <div className="mt-2 space-y-0">
              {tasks.map((item) => (
                <TaskItem key={item.id} item={item} />
              ))}
            </div>
          )}
          {isExpanded && tasks.length === 0 && (
            <p className="text-[14px] text-[#444358] mt-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Sin tareas
            </p>
          )}
        </div>
      </>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4 lg:px-0">
        <div className="text-muted-foreground">Cargando tareas...</div>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col min-h-[calc(100vh-80px)] lg:min-h-[calc(100vh-48px)] py-[48px] px-[23px] sm:pt-[94px] sm:px-[120px]"
    >
      {/* Title */}
      <h1
        className="px-4 lg:px-0"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '20px',
          fontWeight: 500,
          lineHeight: '150%',
          letterSpacing: '-0.2px', // -1% of 20px
          color: '#FFFFFF',
          opacity: 1,
        }}
      >
        Mis tareas
      </h1>

      {/* Categories Card */}
      <div 
        className="bg-card rounded-[8px] border border-[#34324a] mb-8 mt-[24px] sm:w-[497px] sm:mt-[16px]"
        style={{
          opacity: 1,
          borderColor: '#0F1521',
          backgroundColor: '#0F1521',
          padding: '16px 17px 16px 17px',
          position: 'relative'
        }}
      >
        <div className='absolute top-8 right-8 block sm:hidden'>
          <Plus className='w-[16px] h-[16px] flex-shrink-0' />
        </div>
        <CategorySection title="Hoy" tasks={categorizedTasks.hoy} />
        <div className="h-px bg-[#34324a] " />
        <CategorySection title="Mañana" tasks={categorizedTasks.manana} />
        <div className="h-px bg-[#34324a] " />
        <CategorySection title="Próximos" tasks={categorizedTasks.proximos} />
        <div className="h-px bg-[#34324a] " />
        <CategorySection title="Algún día" tasks={categorizedTasks.algunDia} />

        {/* Add Task Input */}
        <form onSubmit={handleAddTask} className="mt-4 hidden sm:block">
          <div 
            className="flex items-center gap-2 px-4 py-2 rounded-[10px] border"
            style={{
              borderColor: '#444358',
              backgroundColor: 'transparent',
            }}
          >
            <Plus className="w-[16px] h-[16px] flex-shrink-0" style={{ color: '#444358' }} />
            <input
              type="text"
              value={newTaskContent}
              onChange={(e) => setNewTaskContent(e.target.value)}
              placeholder="Agregar tarea"
              className="flex-1 bg-transparent border-0 outline-none text-[16px] leading-[1.5] font-normal placeholder:text-[#444358] focus-visible:ring-0"
              style={{ 
                fontFamily: "'DM Sans', sans-serif",
                color: '#444358'
              }}
              disabled={addItemMutation.isPending}
            />
          </div>
        </form>
      </div>

    </div>
  );
};

