import { useState } from 'react';

const ItemForm = ({ onSubmit, onCancel, initialData = null, loading = false }) => {
  const [formData, setFormData] = useState({
    content: initialData?.content || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'medium',
    order: initialData?.order || '',
    category: initialData?.metadata?.category || '',
    estimatedTime: initialData?.metadata?.estimatedTime || '',
    notes: initialData?.metadata?.notes || '',
    scheduledAt: initialData?.scheduledAt ? new Date(initialData.scheduledAt).toISOString().slice(0, 16) : '',
    isReminder: !!initialData?.scheduledAt
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert form data to API format
    const submitData = {
      content: formData.content.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      order: formData.order.trim(),
      metadata: {
        category: formData.category.trim(),
        estimatedTime: formData.estimatedTime ? parseInt(formData.estimatedTime) : undefined,
        notes: formData.notes.trim()
      }
    };

    // Add scheduledAt if this is a reminder
    if (formData.isReminder && formData.scheduledAt) {
      submitData.scheduledAt = new Date(formData.scheduledAt).toISOString();
    }

    // Remove empty metadata fields
    Object.keys(submitData.metadata).forEach(key => {
      if (!submitData.metadata[key]) {
        delete submitData.metadata[key];
      }
    });

    onSubmit(submitData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {initialData ? 'Edit Item' : 'Add New Item'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
          <input
            type="text"
            value={formData.content}
            onChange={(e) => handleChange('content', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter item content"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Describe the item (optional)"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
            <input
              type="text"
              value={formData.order}
              onChange={(e) => handleChange('order', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., 1, 2, 3..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Est. Time (min)</label>
            <input
              type="number"
              value={formData.estimatedTime}
              onChange={(e) => handleChange('estimatedTime', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="5"
              min="1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., dairy, electronics, urgent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Additional notes or instructions"
            rows={2}
          />
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="isReminder"
              checked={formData.isReminder}
              onChange={(e) => handleChange('isReminder', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isReminder" className="ml-2 block text-sm font-medium text-gray-700">
              Set as reminder
            </label>
          </div>

          {formData.isReminder && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scheduled Date & Time *
              </label>
              <input
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => handleChange('scheduledAt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required={formData.isReminder}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            )}
            {loading
              ? (initialData ? 'Updating...' : 'Adding...')
              : (initialData ? 'Update Item' : 'Add Item')
            }
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemForm;