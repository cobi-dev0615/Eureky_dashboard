import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useToggleItemCompletion,
  useAddItemToDefaultList,
  useDeleteItem,
  useUpdateItem,
  listItemsKeys,
} from '../../lists/hooks/useListItemsQuery';
import { useLists } from '../../lists/hooks/useListsQuery';
import { useDragAndDrop } from './useDragAndDrop';

export const useDayColumnLogic = (items, date, isToday) => {
  const queryClient = useQueryClient();
  const toggleCompletion = useToggleItemCompletion();
  const addItemMutation = useAddItemToDefaultList();
  const deleteItemMutation = useDeleteItem();
  const updateItemMutation = useUpdateItem();
  const { data: lists = [] } = useLists();

  const [newTaskText, setNewTaskText] = useState('');
  const [togglingItemId, setTogglingItemId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [itemToChangeList, setItemToChangeList] = useState(null);
  const [isRefetching, setIsRefetching] = useState(false);
  const [selectedListId, setSelectedListId] = useState(null);
  const [showListSelector, setShowListSelector] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const invalidateQueries = async () => {
    setIsRefetching(true);
    await queryClient.invalidateQueries({
      queryKey: listItemsKeys.all,
      refetchType: 'all'
    });
    setIsRefetching(false);
  };

  const handleReorder = (itemId, oldIndex, newIndex) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const now = new Date();
    now.setSeconds(now.getSeconds() + newIndex);

    updateItemMutation.mutate({
      id: itemId,
      content: item.content,
      priority: item.priority || 'medium',
      scheduledAt: now.toISOString()
    });
  };

  const { localItems, sensors, handleDragEnd } = useDragAndDrop(items, handleReorder);

  const handleToggle = async (itemId) => {
    setTogglingItemId(itemId);
    toggleCompletion.mutate(itemId, {
      onSettled: async () => {
        setTogglingItemId(null);
        await invalidateQueries();
      }
    });
  };

  const handleSaveEdit = ({ itemId, updates }) => {
    const originalItem = localItems.find(item => item.id === itemId);

    updateItemMutation.mutate(
      {
        id: itemId,
        content: updates.content,
        priority: originalItem?.priority || 'medium',
        scheduledAt: updates.scheduledAt
      },
      {
        onSuccess: async () => {
          setItemToEdit(null);
          await invalidateQueries();
        },
        onError: (error) => {
          console.error('Error al editar tarea:', error);
          toast.error('Error al editar la tarea');
        },
      }
    );
  };

  const handleChangeList = ({ itemId, newListId }) => {
    const item = localItems.find(i => i.id === itemId);
    if (!item) return;

    const newList = lists.find(l => l.id === newListId);

    updateItemMutation.mutate(
      {
        id: itemId,
        listId: newListId,
        content: item.content,
        priority: item.priority || 'medium',
        scheduledAt: item.scheduledAt
      },
      {
        onMutate: async ({ id, listId }) => {
          await queryClient.cancelQueries({ queryKey: listItemsKeys.all });

          const allQueries = queryClient.getQueriesData({ queryKey: listItemsKeys.all });

          allQueries.forEach(([queryKey, oldData]) => {
            if (!oldData) return;

            queryClient.setQueryData(queryKey, (current) => {
              if (!current) return current;

              if (Array.isArray(current)) {
                return current.map(i =>
                  i.id === id
                    ? { ...i, listId, list: { id: listId, title: newList?.title || 'Lista' } }
                    : i
                );
              }

              if (current.data?.items) {
                return {
                  ...current,
                  data: {
                    ...current.data,
                    items: current.data.items.map(i =>
                      i.id === id
                        ? { ...i, listId, list: { id: listId, title: newList?.title || 'Lista' } }
                        : i
                    )
                  }
                };
              }

              return current;
            });
          });

          return { previousData: allQueries };
        },
        onSuccess: async () => {
          setItemToChangeList(null);
          await invalidateQueries();
          toast.success(`Tarea movida a ${newList?.title || 'otra lista'}`, { duration: 2000 });
        },
        onError: (error, variables, context) => {
          console.error('Error al cambiar lista:', error);

          if (context?.previousData) {
            context.previousData.forEach(([queryKey, data]) => {
              queryClient.setQueryData(queryKey, data);
            });
          }

          toast.error('Error al cambiar la lista');
        },
      }
    );
  };

  const handleDeleteItem = (itemId) => {
    setItemToDelete(itemId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteItemMutation.mutateAsync(itemToDelete);
      setShowDeleteModal(false);
      setItemToDelete(null);
      toast.success('Tarea eliminada con éxito', { duration: 2000 });
    } catch (error) {
      console.error('Error eliminando tarea:', error);
      toast.error('Error al eliminar la tarea');
    }
  };

  const handleAddTask = (e) => {
    if (e) e.preventDefault();
    if (!newTaskText.trim()) return;

    const scheduledAt = isToday 
      ? new Date(new Date().setMinutes(new Date().getMinutes() + 1)).toISOString()
      : date || new Date().toISOString();

    const itemData = {
      content: newTaskText.trim(),
      description: '',
      priority: 'medium',
      scheduledAt,
      metadata: {},
    };

    addItemMutation.mutate(itemData, {
      onSuccess: () => setNewTaskText(''),
      onError: (error) => {
        console.error('Error al agregar tarea:', error);
        toast.error('Error al crear la tarea');
      },
    });
  };

  return {
    newTaskText,
    setNewTaskText,
    localItems,
    sensors,
    handleDragEnd,
    togglingItemId,
    handleToggle,
    handleSaveEdit,
    handleChangeList,
    handleDeleteItem,
    confirmDelete,
    handleAddTask,
    itemToDelete,
    itemToEdit,
    setItemToEdit,
    itemToChangeList,
    setItemToChangeList,
    isRefetching,
    lists,
    selectedListId,
    setSelectedListId,
    showListSelector,
    setShowListSelector,
    showDeleteModal,
    setShowDeleteModal,
    addItemMutation,
    deleteItemMutation,
    updateItemMutation,
  };
};
