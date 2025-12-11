import { useMemo, useState, useEffect, useRef } from 'react';
import { useAllUserItems, useAddItemToDefaultList, useToggleItemCompletion, useDeleteItem, useUpdateItem, listItemsKeys } from '@/features/lists/hooks/useListItemsQuery';
import { useLists } from '@/features/lists/hooks/useListsQuery';
import { Check, Plus, MoreVertical, X, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { startOfToday, startOfTomorrow, endOfTomorrow, addDays, isSameDay, isAfter, isBefore } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/shared/contexts/AppContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ListIcon } from '@/components/ListIcon';
import { EditIcon } from '@/components/EditIcon';
import { DeleteIcon } from '@/components/DeleteIcon';
import { EditTaskModal } from '@/components/EditTaskModal';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export const TareasSection = () => {
  const { theme } = useTheme();
  
  // Fetch all incomplete tasks
  const { data: allItems = [], isLoading, isFetching } = useAllUserItems({
    isCompleted: false,
    limit: 500
  });

  // Fetch lists to get list names
  const { data: lists = [] } = useLists({
    status: 'ACTIVE',
    includeItems: false
  });

  const toggleMutation = useToggleItemCompletion();
  const deleteMutation = useDeleteItem();
  const updateMutation = useUpdateItem();
  const addItemMutation = useAddItemToDefaultList();
  const [newTaskContent, setNewTaskContent] = useState('');
  const [itemToEdit, setItemToEdit] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({
    'Hoy': true,
    'Mañana': true,
    'Próximos': true,
    'Algún día': true,
  });
  const [isDragDropLoading, setIsDragDropLoading] = useState(false);
  const [loadingItemId, setLoadingItemId] = useState(null);
  const [pendingToastMessage, setPendingToastMessage] = useState(null);
  const wasFetchingRef = useRef(false);
  
  // Combine loading states: mutation pending, query fetching, or our custom drag-drop loading
  const isAnyLoading = isDragDropLoading || updateMutation.isPending || isFetching;
  
  // Show toast after query finishes fetching
  useEffect(() => {
    if (wasFetchingRef.current && !isFetching && pendingToastMessage) {
      toast.success(pendingToastMessage, {
        duration: 2000,
      });
      setPendingToastMessage(null);
    }
    wasFetchingRef.current = isFetching;
  }, [isFetching, pendingToastMessage]);

  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskContent.trim()) return;

    // Set scheduledAt to current time (same as createdAt)
    const now = new Date().toISOString();
    
      addItemMutation.mutate(
        { 
          content: newTaskContent.trim(),
          scheduledAt: now
        },
        {
          onSuccess: () => {
            setNewTaskContent('');
            // Note: Query invalidation is already handled by useAddItemToDefaultList hook
          }
        }
      );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTask(e);
    }
  };

  // Handle drag and drop to update scheduledAt
  const handleDragStart = (e, item) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({ itemId: item.id, currentCategory: getItemCategory(item) }));
    // Add visual feedback
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    // Reset opacity after drag ends
    e.currentTarget.style.opacity = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const getItemCategory = (item) => {
    if (!item.scheduledAt) return 'Algún día';
    
    const today = startOfToday();
    const tomorrow = startOfTomorrow();
    const tomorrowEnd = endOfTomorrow();
    const upcomingEnd = addDays(today, 30);
    const scheduledDate = new Date(item.scheduledAt);

    if (isSameDay(scheduledDate, today)) return 'Hoy';
    if (isSameDay(scheduledDate, tomorrow)) return 'Mañana';
    if (isAfter(scheduledDate, tomorrowEnd) && (isBefore(scheduledDate, upcomingEnd) || isSameDay(scheduledDate, upcomingEnd))) return 'Próximos';
    return 'Algún día';
  };

  const handleDrop = (e, targetCategory) => {
    e.preventDefault();
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const { itemId, currentCategory } = data;

      // Don't update if dropped in the same category
      if (currentCategory === targetCategory) return;

      const item = allItems.find(i => i.id === itemId);
      if (!item) return;

      // Set loading state
      setIsDragDropLoading(true);
      setLoadingItemId(itemId);

      let newScheduledAt = null;

      // Calculate new scheduledAt based on target category
      const today = startOfToday();
      switch (targetCategory) {
        case 'Hoy':
          newScheduledAt = today.toISOString();
          break;
        case 'Mañana':
          newScheduledAt = startOfTomorrow().toISOString();
          break;
        case 'Próximos':
          // Set to 7 days from today as default
          newScheduledAt = addDays(today, 7).toISOString();
          break;
        case 'Algún día':
          newScheduledAt = null;
          break;
        default:
          setIsDragDropLoading(false);
          setLoadingItemId(null);
          return;
      }

      // Update the item
      updateMutation.mutate(
        {
          id: itemId,
          content: item.content || item.title,
          priority: item.priority || 'medium',
          scheduledAt: newScheduledAt
        },
        {
          onSuccess: () => {
            // The mutation hook already invalidates queries, which will trigger a refetch
            // We reset our custom loading state, but keep overlay visible via isFetching
            setIsDragDropLoading(false);
            setLoadingItemId(null);
            // Store toast message to show after query finishes fetching
            setPendingToastMessage(`Tarea movida a ${targetCategory}`);
            wasFetchingRef.current = true; // Mark that we expect fetching to start
          },
          onError: (error) => {
            console.error('Error al mover tarea:', error);
            // Reset loading state on error
            setIsDragDropLoading(false);
            setLoadingItemId(null);
            toast.error('Error al mover la tarea');
          },
        }
      );
    } catch (error) {
      console.error('Error parsing drag data:', error);
      setIsDragDropLoading(false);
      setLoadingItemId(null);
    }
  };

  // Get list name for an item
  const getListName = (item) => {
    if (!item.listId) return 'Personal';
    const list = lists.find(l => l.id === item.listId);
    return list?.name || 'Personal';
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

  const handleDelete = (itemId) => {
    deleteMutation.mutate(itemId);
  };

  const handleEdit = (item) => {
    setItemToEdit(item);
  };

  const handleSaveEdit = ({ itemId, updates }) => {
    const originalItem = allItems.find(item => item.id === itemId);

    updateMutation.mutate(
      {
        id: itemId,
        content: updates.content,
        priority: originalItem?.priority || 'medium',
        scheduledAt: updates.scheduledAt
      },
      {
        onSuccess: () => {
          setItemToEdit(null);
          toast.success('Tarea editada con éxito', {
            duration: 2000,
          });
        },
        onError: (error) => {
          console.error('Error al editar tarea:', error);
          toast.error('Error al editar la tarea');
        },
      }
    );
  };

  const TaskItem = ({ item }) => {
    const listName = getListName(item);
    const isLight = theme === "light";
    const isItemLoading = loadingItemId === item.id;
    
    return (
      <div
        draggable={!item.isCompleted && !isAnyLoading}
        onDragStart={(e) => handleDragStart(e, item)}
        onDragEnd={handleDragEnd}
        className={cn(
          "flex items-center gap-3 py-3 transition-all relative",
          item.isCompleted && "opacity-60",
          (!item.isCompleted && !isAnyLoading) && "cursor-move hover:opacity-80",
          isAnyLoading && "pointer-events-none",
          item.isCompleted 
            ? isLight ? "text-[#6B6B80]" : "text-[#312E52]"
            : isLight ? "text-[#050912]" : "text-white",
        )}
      >
        {/* Loading indicator for this specific item */}
        {isItemLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded z-10">
            <RefreshCw 
              className={cn(
                "w-5 h-5 animate-spin",
                theme === "light" ? "text-[#050912]" : "text-white"
              )} 
            />
          </div>
        )}
        <div
          onClick={(e) => handleToggle(item.id, e)}
          className={cn("w-4 h-4 rounded-full border-[1px] flex items-center justify-center cursor-pointer flex-shrink-0",
            item.isCompleted 
              ? isLight ? "border-[#6B6B80] bg-[#6B6B80]" : "border-[#312E52] bg-[#312E52]"
              : isLight ? "border-[#050912] bg-white" : "border-white bg-[#0F1521]",
          )}
          
        >
          {item.isCompleted && (
            <Check className={cn(
              "w-3 h-3",
              isLight ? "text-white" : "text-[#0F1521]"
            )} />
          )}
        </div>
        <div className="flex-1 min-w-0">
        <p className={cn(
            "text-[16px] font-medium tracking-[0.5px] text-foreground mb-0.5",
            item.isCompleted && (isLight ? "line-through text-[#6B6B80]" : "line-through text-[#444358]")
          )}
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {item.content || item.title}
          </p>
          <p className="text-[10px] font-normal " style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {listName}
          </p>
        </div>
        {!item.isCompleted ? (<DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 hover:bg-transparent flex-shrink-0 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="mt-5 w-[131px] p-0 bg-card rounded-[8px] border-0 shadow-[0px_4px_4px_-1px_rgba(12,12,13,0.1),0px_4px_4px_-1px_rgba(12,12,13,0.05)]" sideOffset={8}>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(item);
              }}
              className="px-4 py-3 text-[16px] leading-[1.5] hover:bg-accent cursor-pointer border-b border-border rounded-none"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <EditIcon size={16} className="w-4 h-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item.id);
              }}
              className="px-4 py-3 text-[16px] leading-[1.5] hover:bg-accent cursor-pointer"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <DeleteIcon size={16} className="w-4 h-4 mr-2" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>) : (<X className='w-4 h-4' />)}
      </div>
    );
  };

  const CategorySection = ({ title, tasks }) => {
    const isExpanded = expandedCategories[title] ?? true;
    const [isDragOver, setIsDragOver] = useState(false);
    
    return (
      <>
        <div 
          className="py-3"
          onDragOver={(e) => {
            if (!isAnyLoading) {
              handleDragOver(e);
              setIsDragOver(true);
            }
          }}
          onDragLeave={(e) => {
            // Only set drag over to false if we're leaving the entire category section
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setIsDragOver(false);
            }
          }}
          onDrop={(e) => {
            if (!isAnyLoading) {
              handleDrop(e, title);
              setIsDragOver(false);
            }
          }}
        >
          <button
            onClick={() => toggleCategory(title)}
            className="flex items-center justify-between w-full"
          >
            <h3 className="text-[16px] leading-[1.5] font-semibold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {title}
            </h3>
            
          </button>
          {isExpanded && (
            <div 
              className={cn(
                "mt-2 space-y-0 transition-colors",
                isDragOver && "bg-opacity-20",
                isDragOver && (theme === "light" ? "bg-blue-100" : "bg-blue-900")
              )}
            >
              {tasks.length !== 0 ? (
                tasks.map((item) => (
                  <TaskItem key={item.id} item={item} />
                ))
              ) : (
                isDragOver && (
                  <div className={cn(
                    "py-8 text-center text-sm",
                    theme === "light" ? "text-[#6B6B80]" : "text-[#444358]"
                  )}>
                    Suelta aquí para mover la tarea
                  </div>
                )
              )}
            </div>
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
      className="flex flex-col py-[48px] px-[23px] lg:pt-[94px] lg:px-[120px]"
    >
      {/* Title */}
      <h1
        className=""
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '20px',
          fontWeight: 500,
          lineHeight: '150%',
          letterSpacing: '-0.2px', // -1% of 20px
          color: theme === "light" ? '#050912' : '#FFFFFF',
          opacity: 1,
        }}
      >
        Mis tareas
      </h1>

      {/* Categories Card */}
      <div 
        className="bg-card rounded-[8px] border mb-8 mt-[24px] sm:w-[497px] sm:mt-[16px] overflow-y-auto tasks-card-scrollbar relative"
        style={{
          opacity: 1,
          borderColor: theme === "light" ? '#E5E5E5' : '#34324a',
          backgroundColor: theme === "light" ? '#FFFFFF' : '#0F1521',
          padding: '16px 17px 16px 17px',
          position: 'relative',
          maxHeight: 'calc(100vh - 230px)',
        }}
      >
        {/* Loading Overlay */}
        {isAnyLoading && (
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-[8px]"
            style={{
              backgroundColor: theme === "light" 
                ? 'rgba(255, 255, 255, 0.8)' 
                : 'rgba(15, 21, 33, 0.8)'
            }}
          >
            <div className="flex flex-col items-center gap-3">
              <RefreshCw 
                className={cn(
                  "w-8 h-8 animate-spin",
                  theme === "light" ? "text-[#050912]" : "text-white"
                )} 
              />
              <p 
                className={cn(
                  "text-sm font-medium",
                  theme === "light" ? "text-[#050912]" : "text-white"
                )}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Moviendo tarea...
              </p>
            </div>
          </div>
        )}
        <div className='absolute top-8 right-8 block lg:hidden'>
          <Plus 
            className='w-[16px] h-[16px] flex-shrink-0' 
            style={{ color: theme === "light" ? '#050912' : '#FFFFFF' }}
          />
        </div>
        <CategorySection title="Hoy" tasks={categorizedTasks.hoy} />
        <div className={cn("h-px", theme === "light" ? "bg-[#E5E5E5]" : "bg-[#34324a]")} />
        <CategorySection title="Mañana" tasks={categorizedTasks.manana} />
        <div className={cn("h-px", theme === "light" ? "bg-[#E5E5E5]" : "bg-[#34324a]")} />
        <CategorySection title="Próximos" tasks={categorizedTasks.proximos} />
        <div className={cn("h-px", theme === "light" ? "bg-[#E5E5E5]" : "bg-[#34324a]")} />
        <CategorySection title="Algún día" tasks={categorizedTasks.algunDia} />

        {/* Add Task Input */}
        <form onSubmit={handleAddTask} className="mt-4 hidden lg:block">
          <div 
            className="flex items-center gap-2 px-4 py-2 rounded-[10px] border"
            style={{
              borderColor: theme === "light" ? '#D1D1D1' : '#444358',
              backgroundColor: 'transparent',
            }}
          >
            <Plus className="w-[16px] h-[16px] flex-shrink-0" style={{ color: theme === "light" ? '#6B6B80' : '#444358' }} />
            <input
              type="text"
              value={newTaskContent}
              onChange={(e) => setNewTaskContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Agregar tarea"
              required
              className={cn("flex-1 bg-transparent border-0 outline-none text-[16px] leading-[1.5] font-normal focus-visible:ring-0",
                theme === "light" ? "placeholder:text-[#6B6B80]" : "placeholder:text-[#444358]"
              )}
              style={{ 
                fontFamily: "'DM Sans', sans-serif",
                color: theme === "light" ? '#050912' : 'white'
              }}
              disabled={addItemMutation.isPending}
            />
          </div>
        </form>
      </div>

      {/* Edit Task Modal */}
      <AnimatePresence>
        {itemToEdit && (
          <EditTaskModal
            item={itemToEdit}
            onClose={() => setItemToEdit(null)}
            onSave={handleSaveEdit}
            isSaving={updateMutation.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
