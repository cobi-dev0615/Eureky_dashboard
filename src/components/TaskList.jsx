import { MoreVertical, Check } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { ListIcon } from "./ListIcon";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useAllUserItems, useListItems, useToggleItemCompletion, useDeleteItem, useUpdateItem } from "@/features/lists/hooks/useListItemsQuery";
import { useLists } from "@/features/lists/hooks/useListsQuery";
import { cn } from "@/lib/utils";
import { EditTaskModal } from "./EditTaskModal";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export const TaskList = ({ listId = null, filterByListName = null }) => {
  // State for list selection modal
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch all user items or items for a specific list
  const { data: allItems = [], isLoading: isLoadingAll } = useAllUserItems({
    isCompleted: false,
    limit: 100
  });

  const { data: listItems = [], isLoading: isLoadingList } = useListItems(listId, {
    includeSubtasks: true,
    limit: 100
  });

  // Fetch lists to get list names
  const { data: lists = [] } = useLists({
    status: 'ACTIVE',
    includeItems: false
  });

  // Mutations
  const toggleMutation = useToggleItemCompletion();
  const deleteMutation = useDeleteItem();
  const updateMutation = useUpdateItem();

  // Estado del modal
  const [itemToEdit, setItemToEdit] = useState(null);

  // Determine which items to display
  const items = listId ? listItems : allItems;
  const isLoading = listId ? isLoadingList : isLoadingAll;

  // Filter by list name if provided
  const filteredItems = filterByListName
    ? items.filter(item => {
      const itemList = lists.find(l => l.id === item.listId);
      return itemList?.name === filterByListName;
    })
    : items;

  // Get list name for an item
  const getListName = (item) => {
    if (!item.listId) return 'Personal';
    const list = lists.find(l => l.id === item.listId);
    return list?.name || 'Personal';
  };

  const handleToggle = (itemId) => {
    toggleMutation.mutate(itemId);
  };

  const handleDelete = (itemId) => {
    deleteMutation.mutate(itemId);
  };

  const handleEdit = (item) => {
    setItemToEdit(item);
  };

  const handleSaveEdit = ({ itemId, updates }) => {
    const originalItem = filteredItems.find(item => item.id === itemId);

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

  const handleChangeList = (item) => {
    console.log("Change list for item:", item);
    setSelectedItem(item);
    setIsListModalOpen(true);
  };

  const handleSelectList = (targetListId) => {
    if (!selectedItem) return;

    // Don't update if the list is already the same
    if (selectedItem.listId === targetListId) {
      setIsListModalOpen(false);
      setSelectedItem(null);
      return;
    }

    // Update the item with the new listId
    updateMutation.mutate(
      {
        id: selectedItem.id,
        listId: targetListId || null, // Ensure null is sent for default list
      },
      {
        onSuccess: () => {
          setIsListModalOpen(false);
          setSelectedItem(null);
        },
        onError: (error) => {
          // Error notification is handled by the mutation hook
          console.error('Error updating item list:', error);
        },
      }
    );
  };

  return (
    <>
      <section className="mb-8 px-6 lg:px-0">
        <h2 className="lg:text-[20px] text-[16px] font-medium mb-4 tracking-[-0.2px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Tareas</h2>
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Cargando tareas...</div>
        ) : (
          <div className="space-y-2">
            {filteredItems.map((item) => {
              const listName = getListName(item);
              return (
                <div
                  key={item.id}
                  className={cn(
                    "bg-card rounded-[8px] h-[64px] lg:h-[64px] flex items-center px-4 lg:px-6 gap-6 lg:gap-4 w-full lg:w-auto"
                  )}
                >
                  <div className="w-4 h-4 rounded-full border-[1.5px] border-foreground flex items-center justify-center cursor-pointer flex-shrink-0">
                    {item.isCompleted && <Check className="w-3 h-3" />}
                  </div>
                  <div className="flex-1 min-w-0 w-[117px] lg:w-auto">
                    <p className="text-[10px] leading-[16px] font-medium tracking-[0.5px] uppercase text-foreground mb-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      MIS LISTAS&gt;{listName.toUpperCase()}
                    </p>
                    <p className={cn(
                      "text-[16px] leading-[1.5] font-normal truncate",
                      item.isCompleted && "line-through text-[#444358]"
                    )}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {item.content || item.title}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 lg:h-6 lg:w-6 hover:bg-transparent flex-shrink-0 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="w-5 h-5 lg:w-6 lg:h-6" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="mt-5 w-[131px] p-0 bg-card rounded-[8px] border-0 shadow-[0px_4px_4px_-1px_rgba(12,12,13,0.1),0px_4px_4px_-1px_rgba(12,12,13,0.05)]" sideOffset={8}>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChangeList(item);
                        }}
                        className="px-4 py-3 text-[16px] leading-[1.5] hover:bg-accent cursor-pointer border-b border-border rounded-none"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        <ListIcon size={16} className="w-4 h-4 mr-2" />
                        Lista
                      </DropdownMenuItem>
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
                  </DropdownMenu>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Modal de edición */}
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

      <Dialog open={isListModalOpen} onOpenChange={setIsListModalOpen}>
        <DialogContent
          className="w-full sm:max-w-[375px] bg-[#0F1521] border-0 p-0 rounded-t-[24px] sm:rounded-[24px] overflow-hidden gap-0 !left-[50%] !translate-x-[-50%] !bottom-0 !top-auto !translate-y-0 sm:!top-[50%] sm:!bottom-auto sm:!translate-y-[-50%]"
          hideCloseButton={true}
        >
          <div className="flex flex-col gap-[20px]">
            <div className="h-[64px] border-b border-[#34324a] flex items-center justify-center relative">
              <h2 className="text-[18px] font-bold leading-[1.6] text-center text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Mover a
              </h2>
            </div>

            <div className="flex flex-col gap-[20px] pb-[20px]">
              {lists.map((list, index) => {
                const isSelected = selectedItem?.listId === list.id;
                return (
                  <div key={list.id}>
                    <button
                      onClick={() => handleSelectList(list.id)}
                      className="w-full flex items-center justify-between px-[24px] text-[16px] leading-[1.5] text-white hover:bg-[#1C273E] transition-colors"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <span>{list.name}</span>
                      <div className="w-[24px] h-[24px] rounded-full flex items-center justify-center flex-shrink-0">
                        {isSelected ? (
                          <div className="w-[24px] h-[24px] rounded-full bg-[#ABFFA8] flex items-center justify-center">
                            <Check className="w-[18px] h-[18px] text-white stroke-[2.5]" />
                          </div>
                        ) : (
                          <div className="w-[24px] h-[24px] rounded-full border-[1.5px] border-[#CDCEDF]" />
                        )}
                      </div>
                    </button>
                    {index < lists.length - 1 && (
                      <div className="w-full h-[1px] bg-[#34324a] mt-[20px]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
