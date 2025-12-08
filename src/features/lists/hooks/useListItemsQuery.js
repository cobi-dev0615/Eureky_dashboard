import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listItemsService } from '../../../shared/services/listItems';
import { useNotifications } from '../../../shared/contexts/AppContext';

// Query keys for list items
export const listItemsKeys = {
  all: ['listItems'],
  lists: () => [...listItemsKeys.all, 'list'],
  list: (listId, filters) => [...listItemsKeys.lists(), listId, { filters }],
  allUserItems: (filters) => [...listItemsKeys.all, 'allUserItems', { filters }],
};

// Hook to get all items across all lists
export const useAllUserItems = (filters = {}) => {
  return useQuery({
    queryKey: listItemsKeys.allUserItems(filters),
    queryFn: () => listItemsService.getAllUserItems(filters),
    select: (response) => response.data?.items || response.data || [],
    staleTime: 0, // Always consider data stale, refetch on mutations
    refetchOnWindowFocus: true,
  });
};

// Hook to get all items for a specific list
export const useListItems = (listId, filters = {}) => {
  return useQuery({
    queryKey: listItemsKeys.list(listId, filters),
    queryFn: () => listItemsService.getListItems(listId, filters),
    select: (response) => response.data?.items || response.data || [], // Extract items array from response
    enabled: !!listId, // Only run query if listId is provided
    staleTime: 0, // Always consider data stale, refetch on mutations
    refetchOnWindowFocus: true,
  });
};

// Hook to add a new item to a list
export const useAddItemToList = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation({
    mutationFn: ({ listId, itemData }) => listItemsService.addItemToList(listId, itemData),
    onSuccess: (response, variables) => {
      // Invalidate all list items queries to ensure consistency
      // This includes the specific list and all user items
      queryClient.invalidateQueries({ queryKey: listItemsKeys.all });

      // Add success notification
      addNotification({
        type: 'success',
        title: 'Éxito',
        message: response.message || 'Item agregado exitosamente',
      });
    },
    onError: (error) => {
      // Add error notification
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Error al agregar el item',
      });
    },
  });
};

// Hook to add a new item to default list
export const useAddItemToDefaultList = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation({
    mutationFn: (itemData) => listItemsService.addItemToDefaultList(itemData),
    onSuccess: (response) => {
      // Invalidate all list items queries to refresh data
      queryClient.invalidateQueries({ queryKey: listItemsKeys.all });

      // Add success notification
      addNotification({
        type: 'success',
        title: 'Éxito',
        message: response.message || 'Item agregado a la lista por defecto exitosamente',
      });
    },
    onError: (error) => {
      // Add error notification
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Error al agregar el item a la lista por defecto',
      });
    },
  });
};

// Hook to update an item
export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation({
    mutationFn: ({ id, ...updates }) => listItemsService.updateItem(id, updates),
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: listItemsKeys.all });

      // Snapshot the previous value for all queries
      const previousQueries = queryClient.getQueriesData({ queryKey: listItemsKeys.all });

      // Extract updates (excluding id)
      const { id, ...updates } = variables;

      // Optimistically update all list items caches
      queryClient.setQueriesData({ queryKey: listItemsKeys.all }, (oldData) => {
        if (!oldData) return oldData;
        
        // Handle both array and object responses
        if (Array.isArray(oldData)) {
          return oldData.map(item =>
            item.id === id
              ? { ...item, ...updates }
              : item
          );
        }
        // If it's an object with items array
        if (oldData.items && Array.isArray(oldData.items)) {
          return {
            ...oldData,
            items: oldData.items.map(item =>
              item.id === id
                ? { ...item, ...updates }
                : item
            )
          };
        }
        return oldData;
      });

      return { previousQueries };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Error al actualizar el item',
      });
    },
    onSuccess: (response, variables) => {
      // Invalidate all list items queries to ensure consistency
      // This includes allUserItems and all list-specific queries
      queryClient.invalidateQueries({ queryKey: listItemsKeys.all });
      
      addNotification({
        type: 'success',
        title: 'Éxito',
        message: response.message || 'Item actualizado exitosamente',
      });
    },
  });
};

// Hook to toggle item completion
export const useToggleItemCompletion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId) => listItemsService.toggleItemCompletion(itemId),
    onMutate: async (itemId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: listItemsKeys.all });

      // Snapshot the previous value for all queries
      const previousQueries = queryClient.getQueriesData({ queryKey: listItemsKeys.all });

      // Optimistically update all list items caches
      queryClient.setQueriesData({ queryKey: listItemsKeys.all }, (oldData) => {
        if (!oldData) return oldData;
        // Handle both array and object responses
        if (Array.isArray(oldData)) {
          return oldData.map(item =>
            item.id === itemId
              ? { ...item, isCompleted: !item.isCompleted }
              : item
          );
        }
        // If it's an object with items array
        if (oldData.items && Array.isArray(oldData.items)) {
          return {
            ...oldData,
            items: oldData.items.map(item =>
              item.id === itemId
                ? { ...item, isCompleted: !item.isCompleted }
                : item
            )
          };
        }
        return oldData;
      });

      return { previousQueries };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      // Always refetch after error or success - invalidate all list items queries
      queryClient.invalidateQueries({ queryKey: listItemsKeys.all });
    },
  });
};

// Hook to delete an item
export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation({
    mutationFn: (itemId) => listItemsService.deleteItem(itemId),
    onSuccess: (response, deletedId) => {
      // Invalidate all queries immediately to refetch fresh data
      queryClient.invalidateQueries({ queryKey: listItemsKeys.all });
      
      addNotification({
        type: 'success',
        title: 'Éxito',
        message: response.message || 'Item eliminado exitosamente',
      });
    },
    onError: (error) => {
      // Invalidate to restore the cache in case of error
      queryClient.invalidateQueries({ queryKey: listItemsKeys.all });
      
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Error al eliminar el item',
      });
    },
  });
};

// Combined hook for all list item operations
export const useListItemsOperations = (listId) => {
  const itemsQuery = useListItems(listId);
  const addItemMutation = useAddItemToList();
  const updateItemMutation = useUpdateItem();
  const toggleMutation = useToggleItemCompletion();
  const deleteMutation = useDeleteItem();

  return {
    // Data
    items: itemsQuery.data || [],
    isLoading: itemsQuery.isLoading,
    isError: itemsQuery.isError,
    error: itemsQuery.error,

    // Operations
    addItem: (itemData) => addItemMutation.mutate({ listId, itemData }),
    updateItem: updateItemMutation.mutate,
    toggleCompletion: toggleMutation.mutate,
    deleteItem: deleteMutation.mutate,

    // Loading states
    isAdding: addItemMutation.isPending,
    isUpdating: updateItemMutation.isPending,
    isToggling: toggleMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};