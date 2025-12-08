import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { remindersService } from '../../../shared/services/reminders';
import { useNotifications } from '../../../shared/contexts/AppContext';

// Query keys for reminders
export const remindersKeys = {
  all: ['reminders'],
  lists: () => [...remindersKeys.all, 'list'],
  list: (filters) => [...remindersKeys.lists(), { filters }],
  details: () => [...remindersKeys.all, 'detail'],
  detail: (id) => [...remindersKeys.details(), id],
};

// Hook to get all reminders
export const useReminders = (filters = {}) => {
  return useQuery({
    queryKey: remindersKeys.list(filters),
    queryFn: () => remindersService.getReminders(filters),
    select: (response) => response.data?.reminders || [], // Extract reminders array from response
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook to create a new reminder
export const useCreateReminder = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation({
    mutationFn: (reminderData) => remindersService.createReminder(reminderData),
    onSuccess: (response) => {
      // Invalidate and refetch reminders list
      queryClient.invalidateQueries({ queryKey: remindersKeys.lists() });
      
      // Add success notification
      addNotification({
        type: 'success',
        title: 'Éxito',
        message: response.message || 'Recordatorio creado exitosamente',
      });
    },
    onError: (error) => {
      // Add error notification
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Error al crear el recordatorio',
      });
    },
  });
};

// Hook to update a reminder
export const useUpdateReminder = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation({
    mutationFn: ({ id, ...updates }) => remindersService.updateReminder(id, updates),
    onSuccess: (response, variables) => {
      // Update the specific reminder in the cache
      queryClient.setQueryData(remindersKeys.lists(), (oldData) => {
        if (!oldData) return oldData;
        return oldData.map(reminder =>
          reminder.id === variables.id
            ? { ...reminder, ...variables }
            : reminder
        );
      });

      // Also invalidate queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: remindersKeys.lists() });
      
      addNotification({
        type: 'success',
        title: 'Éxito',
        message: response.message || 'Recordatorio actualizado exitosamente',
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Error al actualizar el recordatorio',
      });
    },
  });
};

// Hook to delete a reminder
export const useDeleteReminder = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation({
    mutationFn: (id) => remindersService.deleteReminder(id),
    onSuccess: (response, deletedId) => {
      // Remove the reminder from the cache optimistically
      queryClient.setQueryData(remindersKeys.lists(), (oldData) => {
        if (!oldData) return oldData;
        return oldData.filter(reminder => reminder.id !== deletedId);
      });
      
      addNotification({
        type: 'success',
        title: 'Éxito',
        message: response.message || 'Recordatorio eliminado exitosamente',
      });
    },
    onError: (error) => {
      // Invalidate to restore the cache in case of error
      queryClient.invalidateQueries({ queryKey: remindersKeys.lists() });
      
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Error al eliminar el recordatorio',
      });
    },
  });
};

// Hook to toggle reminder completion
export const useToggleReminderCompletion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completed }) => remindersService.toggleReminderCompletion(id, completed),
    onMutate: async ({ id, completed }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: remindersKeys.lists() });

      // Snapshot the previous value
      const previousReminders = queryClient.getQueryData(remindersKeys.lists());

      // Optimistically update the cache
      queryClient.setQueryData(remindersKeys.lists(), (oldData) => {
        if (!oldData) return oldData;
        return oldData.map(reminder =>
          reminder.id === id
            ? { ...reminder, completed }
            : reminder
        );
      });

      return { previousReminders };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousReminders) {
        queryClient.setQueryData(remindersKeys.lists(), context.previousReminders);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: remindersKeys.lists() });
    },
  });
};

// Combined hook for all reminder operations
export const useRemindersOperations = () => {
  const remindersQuery = useReminders();
  const createMutation = useCreateReminder();
  const updateMutation = useUpdateReminder();
  const deleteMutation = useDeleteReminder();
  const toggleMutation = useToggleReminderCompletion();

  return {
    // Data
    reminders: remindersQuery.data || [],
    isLoading: remindersQuery.isLoading,
    isError: remindersQuery.isError,
    error: remindersQuery.error,
    
    // Operations
    createReminder: createMutation.mutate,
    updateReminder: updateMutation.mutate,
    deleteReminder: deleteMutation.mutate,
    toggleCompletion: toggleMutation.mutate,
    
    // Loading states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isToggling: toggleMutation.isPending,
  };
};