import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subtasksService } from '../../../shared/services/subtasks';
import { useNotifications } from '../../../shared/contexts/AppContext';
import { listItemsKeys } from './useListItemsQuery';

// Query keys for subtasks
export const subtasksKeys = {
  all: ['subtasks'],
  listItem: (listItemId) => [...subtasksKeys.all, 'listItem', listItemId],
};

// Hook to get all subtasks for a specific list item
export const useSubtasks = (listItemId) => {
  return useQuery({
    queryKey: subtasksKeys.listItem(listItemId),
    queryFn: () => subtasksService.getSubtasks(listItemId),
    select: (response) => response.data || {},
    enabled: !!listItemId,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
  });
};

// Hook to create a new subtask
export const useCreateSubtask = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation({
    mutationFn: ({ listItemId, subtaskData }) =>
      subtasksService.createSubtask(listItemId, subtaskData),
    onSuccess: (response, variables) => {
      // Invalidate subtasks for this list item
      queryClient.invalidateQueries({
        queryKey: subtasksKeys.listItem(variables.listItemId)
      });

      // Also invalidate list items to update subtask stats
      queryClient.invalidateQueries({
        queryKey: listItemsKeys.lists()
      });

      addNotification({
        type: 'success',
        title: 'Éxito',
        message: response.message || 'Subtask creada exitosamente',
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Error al crear la subtask',
      });
    },
  });
};

// Hook to update a subtask
export const useUpdateSubtask = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation({
    mutationFn: ({ listItemId, subtaskId, updates }) =>
      subtasksService.updateSubtask(listItemId, subtaskId, updates),
    onSuccess: () => {
      // Invalidate all subtasks queries
      queryClient.invalidateQueries({ queryKey: subtasksKeys.all });

      // Also invalidate list items
      queryClient.invalidateQueries({ queryKey: listItemsKeys.lists() });

      addNotification({
        type: 'success',
        title: 'Éxito',
        message: 'Subtask actualizada exitosamente',
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Error al actualizar la subtask',
      });
    },
  });
};

// Hook to toggle subtask completion
export const useToggleSubtask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listItemId, subtaskId }) => subtasksService.toggleSubtask(listItemId, subtaskId),
    onSuccess: () => {
      // Invalidate all subtasks and list items queries
      queryClient.invalidateQueries({ queryKey: subtasksKeys.all });
      queryClient.invalidateQueries({ queryKey: listItemsKeys.lists() });
    },
  });
};

// Hook to delete a subtask
export const useDeleteSubtask = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation({
    mutationFn: ({ listItemId, subtaskId }) => subtasksService.deleteSubtask(listItemId, subtaskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subtasksKeys.all });
      queryClient.invalidateQueries({ queryKey: listItemsKeys.lists() });

      addNotification({
        type: 'success',
        title: 'Éxito',
        message: 'Subtask eliminada exitosamente',
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Error al eliminar la subtask',
      });
    },
  });
};

// Combined hook for all subtask operations
export const useSubtasksOperations = (listItemId) => {
  const subtasksQuery = useSubtasks(listItemId);
  const createMutation = useCreateSubtask();
  const updateMutation = useUpdateSubtask();
  const toggleMutation = useToggleSubtask();
  const deleteMutation = useDeleteSubtask();

  return {
    // Data
    subtasks: subtasksQuery.data?.subtasks || [],
    stats: subtasksQuery.data?.stats || { total: 0, completed: 0, pending: 0, completionPercentage: 0 },
    isLoading: subtasksQuery.isLoading,
    isError: subtasksQuery.isError,
    error: subtasksQuery.error,

    // Operations
    createSubtask: (subtaskData) => createMutation.mutate({ listItemId, subtaskData }),
    updateSubtask: ({ subtaskId, updates }) => updateMutation.mutate({ listItemId, subtaskId, updates }),
    toggleSubtask: (subtaskId) => toggleMutation.mutate({ listItemId, subtaskId }),
    deleteSubtask: (subtaskId) => deleteMutation.mutate({ listItemId, subtaskId }),

    // Loading states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isToggling: toggleMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
