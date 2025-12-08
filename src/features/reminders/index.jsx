import { useState } from 'react';
import { Plus } from 'lucide-react';
import ReminderCard from './components/ReminderCard';
import ReminderForm from './components/ReminderForm';
import { useRemindersOperations } from './hooks/useRemindersQuery';

const Reminders = () => {
  const {
    reminders,
    isLoading,
    isError,
    error,
    createReminder,
    updateReminder,
    deleteReminder,
    toggleCompletion,
    isCreating,
    isUpdating
  } = useRemindersOperations();

  const [showForm, setShowForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);

  const handleSubmit = (reminderData) => {
    if (editingReminder) {
      // Update existing reminder
      updateReminder({ id: editingReminder.id, ...reminderData }, {
        onSuccess: () => {
          setEditingReminder(null);
          setShowForm(false);
        }
      });
    } else {
      // Create new reminder
      createReminder(reminderData, {
        onSuccess: () => {
          setShowForm(false);
        }
      });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingReminder(null);
  };

  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    setShowForm(true);
  };

  const handleToggleComplete = (id) => {
    const reminder = reminders.find(r => r.id === id);
    const newStatus = reminder.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    toggleCompletion({ id, completed: newStatus === 'COMPLETED' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error al cargar los recordatorios</p>
          <p className="text-sm text-gray-500">{error?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reminders</h1>
          <p className="text-gray-600">Manage your reminders and tasks</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Reminder
        </button>
      </div>

      {showForm && (
        <ReminderForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          initialData={editingReminder}
          loading={isCreating || isUpdating}
        />
      )}

      <div className="space-y-4">
        {reminders.map((reminder) => (
          <ReminderCard
            key={reminder.id}
            reminder={reminder}
            onToggleComplete={handleToggleComplete}
            onDelete={deleteReminder}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  );
};

export default Reminders;