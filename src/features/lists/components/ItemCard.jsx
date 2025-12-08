import { Edit, Trash2, Clock, Calendar, AlertCircle, CheckSquare } from 'lucide-react';

const ItemCard = ({ item, onEdit, onDelete, onToggleCompletion, onViewDetail }) => {
  const isReminder = !!item.scheduledAt;
  const reminderDate = isReminder ? new Date(item.scheduledAt) : null;
  const isOverdue = reminderDate && reminderDate < new Date() && !item.isCompleted;

  return (
    <div className={`bg-white p-4 rounded-lg border transition-all ${
      item.isCompleted
        ? 'border-green-200 bg-green-50'
        : isOverdue
        ? 'border-red-200 bg-red-50'
        : isReminder
        ? 'border-blue-200 bg-blue-50'
        : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          checked={item.isCompleted || false}
          onChange={() => onToggleCompletion?.(item.id)}
          className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />

        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => onViewDetail?.(item)}
        >
          <div className="flex items-center space-x-2">
            <h4 className={`text-sm font-medium ${
              item.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
            }`}>
              {item.content}
            </h4>
            {item.subtaskStats && item.subtaskStats.total > 0 && (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <CheckSquare className="w-3 h-3" />
                <span>{item.subtaskStats.completed}/{item.subtaskStats.total}</span>
              </div>
            )}
          </div>
          
          {item.description && (
            <p className={`text-sm mt-1 ${
              item.isCompleted ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {item.description}
            </p>
          )}

          <div className="flex items-center space-x-3 mt-2">
            {/* Priority */}
            {item.priority && (
              <span className={`px-2 py-1 text-xs font-medium rounded ${
                item.priority === 'high' ? 'bg-red-100 text-red-800' :
                item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {item.priority}
              </span>
            )}
            
            {/* Category */}
            {item.metadata?.category && (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                {item.metadata.category}
              </span>
            )}
            
            {/* Estimated Time */}
            {item.metadata?.estimatedTime && (
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                {item.metadata.estimatedTime} min
              </div>
            )}
          </div>

          {/* Reminder information */}
          {isReminder && (
            <div className={`flex items-center mt-2 text-xs ${
              isOverdue ? 'text-red-600' : 'text-blue-600'
            }`}>
              {isOverdue ? (
                <AlertCircle className="w-3 h-3 mr-1" />
              ) : (
                <Calendar className="w-3 h-3 mr-1" />
              )}
              <span className="font-medium">
                {isOverdue ? 'Overdue: ' : 'Scheduled: '}
                {reminderDate.toLocaleDateString()} at {reminderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )}

          {/* Order indicator */}
          {item.order && (
            <div className="text-xs text-gray-400 mt-1">
              Order: {item.order}
            </div>
          )}

          {/* Notes */}
          {item.metadata?.notes && (
            <div className="text-xs text-gray-500 mt-2 italic">
              Note: {item.metadata.notes}
            </div>
          )}
        </div>

        <div className="flex space-x-1">
          <button 
            onClick={() => onEdit?.(item)}
            className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
            title="Edit item"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete?.(item.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete item"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;