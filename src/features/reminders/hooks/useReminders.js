import { useState } from 'react';

const initialReminders = [
  {
    id: 1,
    title: 'Team meeting',
    description: 'Weekly team sync meeting',
    date: new Date(),
    completed: false,
    priority: 'high'
  },
  {
    id: 2,
    title: 'Buy groceries',
    description: 'Milk, bread, eggs',
    date: new Date(),
    completed: false,
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Call dentist',
    description: 'Schedule appointment',
    date: new Date(Date.now() + 86400000),
    completed: true,
    priority: 'low'
  }
];

export const useReminders = () => {
  const [reminders, setReminders] = useState(initialReminders);

  const addReminder = (reminderData) => {
    const newReminder = {
      id: Date.now(),
      ...reminderData,
      date: new Date(reminderData.date),
      completed: false
    };
    setReminders(prev => [...prev, newReminder]);
  };

  const updateReminder = (id, updates) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, ...updates } : reminder
    ));
  };

  const toggleComplete = (id) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
    ));
  };

  const deleteReminder = (id) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  return {
    reminders,
    addReminder,
    updateReminder,
    toggleComplete,
    deleteReminder
  };
};