import { useState } from 'react';
import { Calendar, Edit, Trash2, List, CheckCircle2, Plus, X } from 'lucide-react';
import { format } from 'date-fns';

const ListCard = ({ 
  list, 
  onEdit, 
  onDelete, 
  onView, 
  onToggleItem, 
  onAddItem, 
  onDeleteItem 
}) => {
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItemContent, setNewItemContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const items = list.items || [];
  const completedItems = items.filter(item => item.isCompleted).length;
  const totalItems = items.length;
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemContent.trim()) return;
    
    setIsAdding(true);
    try {
      await onAddItem?.(list.id, { content: newItemContent.trim() });
      setNewItemContent('');
      setShowAddItem(false);
    } finally {
      setIsAdding(false);
    }
  };

  const handleCancelAdd = () => {
    setShowAddItem(false);
    setNewItemContent('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{list.name}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${list.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                list.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
              }`}>
              {list.status}
            </span>
          </div>

          {list.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{list.description}</p>
          )}

          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center text-sm text-gray-500">
              <List className="w-4 h-4 mr-1" />
              {totalItems} items
            </div>
            {totalItems > 0 && (
              <div className="flex items-center text-sm text-gray-500">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                {completedItems} completed ({completionPercentage}%)
              </div>
            )}
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              {format(new Date(list.createdAt), 'MMM d, yyyy')}
            </div>
          </div>

          {/* Progress bar */}
          {totalItems > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          )}

          {/* Tags */}
          {list.metadata?.tags && list.metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {list.metadata.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Priority and Category */}
          <div className="flex items-center space-x-3 mb-4">
            {list.metadata?.priority && (
              <span className={`px-2 py-1 text-xs font-medium rounded ${list.metadata.priority === 'high' ? 'bg-red-100 text-red-800' :
                  list.metadata.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                }`}>
                {list.metadata.priority} priority
              </span>
            )}
            {list.metadata?.category && (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                {list.metadata.category}
              </span>
            )}
          </div>

          {/* Items List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">Items</h4>
              <button
                onClick={() => setShowAddItem(true)}
                className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                title="Add item"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add item form */}
            {showAddItem && (
              <form onSubmit={handleAddItem} className="flex items-center space-x-2 p-2 bg-gray-50 rounded border">
                <input
                  type="text"
                  value={newItemContent}
                  onChange={(e) => setNewItemContent(e.target.value)}
                  placeholder="Enter item content..."
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent"
                  autoFocus
                  disabled={isAdding}
                />
                <button
                  type="submit"
                  disabled={isAdding || !newItemContent.trim()}
                  className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {isAdding ? '...' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelAdd}
                  disabled={isAdding}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </form>
            )}

            {/* Items list */}
            <div className="max-h-32 overflow-y-auto space-y-1">
              {items.length === 0 ? (
                <p className="text-xs text-gray-500 italic py-2">No items yet</p>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center space-x-2 p-2 rounded text-sm ${
                      item.isCompleted ? 'bg-green-50' : 'bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.isCompleted || false}
                      onChange={() => onToggleItem?.(item.id)}
                      className="w-3 h-3 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span
                      className={`flex-1 text-xs ${
                        item.isCompleted ? 'line-through text-gray-500' : 'text-gray-700'
                      }`}
                    >
                      {item.content}
                    </span>
                    <button
                      onClick={() => onDeleteItem?.(item.id)}
                      className="p-0.5 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete item"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onView?.(list)}
            className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
            title="View list"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit?.(list)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Edit list"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete?.(list.id)}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete list"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListCard;