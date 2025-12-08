import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listsService } from '../../../shared/services/lists';
import { useNotifications } from '../../../shared/contexts/AppContext';

// Query keys for lists
export const listsKeys = {
  all: ['lists'],
  lists: () => [...listsKeys.all, 'list'],
  list: (filters) => [...listsKeys.lists(), { filters }],
  details: () => [...listsKeys.all, 'detail'],
  detail: (id) => [...listsKeys.details(), id],
};

// Hook to get all lists
export const useLists = (filters = {}) => {
  return useQuery({
    queryKey: listsKeys.list(filters),
    queryFn: () => listsService.getLists(filters),
    select: (response) => response.data?.lists || response.data || [], // Extract lists array from response
    staleTime: 0, // Always consider data stale, refetch on mutations
    refetchOnWindowFocus: true,
  });
};

// Hook to get a specific list by ID
export const useListById = (listId) => {
  return useQuery({
    queryKey: listsKeys.detail(listId),
    queryFn: () => listsService.getListById(listId),
    select: (response) => response.data?.list || null,
    enabled: !!listId, // Only run query if listId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook to create a new list
export const useCreateList = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation({
    mutationFn: (listData) => listsService.createList(listData),
    onSuccess: (response) => {
      // Invalidate and refetch lists
      queryClient.invalidateQueries({ queryKey: listsKeys.lists() });
      
      // Add success notification
      addNotification({
        type: 'success',
        title: 'Éxito',
        message: response.message || 'Lista creada exitosamente',
      });
    },
    onError: (error) => {
      // Add error notification
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Error al crear la lista',
      });
    },
  });
};

// Hook to update a list
export const useUpdateList = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation({
    mutationFn: ({ id, ...updates }) => listsService.updateList(id, updates),
    onSuccess: (response, variables) => {
      // Update the specific list in the cache
      queryClient.setQueryData(listsKeys.lists(), (oldData) => {
        if (!oldData) return oldData;
        return oldData.map(list =>
          list.id === variables.id
            ? { ...list, ...variables }
            : list
        );
      });

      // Also invalidate queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: listsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: listsKeys.detail(variables.id) });
      
      addNotification({
        type: 'success',
        title: 'Éxito',
        message: response.message || 'Lista actualizada exitosamente',
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Error al actualizar la lista',
      });
    },
  });
};

// Hook to delete a list
export const useDeleteList = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation({
    mutationFn: (id) => listsService.deleteList(id),
    onSuccess: (response, deletedId) => {
      // Remove the list from the cache optimistically
      queryClient.setQueryData(listsKeys.lists(), (oldData) => {
        if (!oldData) return oldData;
        return oldData.filter(list => list.id !== deletedId);
      });

      // Remove the specific list detail from cache
      queryClient.removeQueries({ queryKey: listsKeys.detail(deletedId) });
      
      addNotification({
        type: 'success',
        title: 'Éxito',
        message: response.message || 'Lista eliminada exitosamente',
      });
    },
    onError: (error) => {
      // Invalidate to restore the cache in case of error
      queryClient.invalidateQueries({ queryKey: listsKeys.lists() });
      
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Error al eliminar la lista',
      });
    },
  });
};

// Combined hook for all list operations
export const useListsOperations = () => {
  const listsQuery = useLists();
  const createMutation = useCreateList();
  const updateMutation = useUpdateList();
  const deleteMutation = useDeleteList();

  return {
    // Data
    lists: listsQuery.data || [],
    isLoading: listsQuery.isLoading,
    isError: listsQuery.isError,
    error: listsQuery.error,
    
    // Operations
    createList: createMutation.mutate,
    updateList: updateMutation.mutate,
    deleteList: deleteMutation.mutate,
    
    // Loading states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};