import { useState } from 'react';
import { Check, MoreVertical, Bell, List as ListIcon, Hash, Paperclip, X, Trash2 } from 'lucide-react';
import { useSubtasksOperations } from '../hooks/useSubtasksQuery';

const ItemDetailView = ({ item, onClose, onMarkComplete, onUpdate, lists = [] }) => {
  const [newSubtaskContent, setNewSubtaskContent] = useState('');
  const [notes, setNotes] = useState(item.metadata?.notes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [selectedListId, setSelectedListId] = useState(item.listId || null);

  const {
    subtasks,
    stats,
    isLoading,
    createSubtask,
    toggleSubtask,
    deleteSubtask,
    isCreating
  } = useSubtasksOperations(item.id);

  // Handle creating a new subtask
  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskContent.trim()) return;

    createSubtask({
      content: newSubtaskContent,
      order: subtasks.length.toString()
    });

    setNewSubtaskContent('');
  };

  // Handle toggling subtask completion
  const handleToggleSubtask = (subtaskId) => {
    toggleSubtask(subtaskId);
  };

  // Handle saving notes
  const handleSaveNotes = () => {
    if (onUpdate) {
      onUpdate({
        id: item.id,
        metadata: {
          ...item.metadata,
          notes
        }
      });
    }
    setIsEditingNotes(false);
  };

  // Get current list name
  const getCurrentListName = () => {
    if (!selectedListId) return 'Personal';
    const list = lists.find(l => l.id === selectedListId);
    return list?.name || 'Personal';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <ListIcon className="w-4 h-4" />
            <span>My lists</span>
            <span>›</span>
            <span>{getCurrentListName()}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-4">{item.content}</h1>

        <div className="flex items-center space-x-2 flex-wrap gap-2">
          <button className="flex items-center space-x-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors">
            <Bell className="w-3.5 h-3.5" />
            <span>Remind me</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg text-xs font-medium hover:bg-yellow-100 transition-colors">
            <ListIcon className="w-3.5 h-3.5" />
            <span>{getCurrentListName()}</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors">
            <Hash className="w-3.5 h-3.5" />
            <span>Tags</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {/* Notes Section */}
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2">NOTES</h2>
          {isEditingNotes ? (
            <div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Insert your notes here"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                rows="4"
              />
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={handleSaveNotes}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setNotes(item.metadata?.notes || '');
                    setIsEditingNotes(false);
                  }}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setIsEditingNotes(true)}
              className="text-sm text-gray-400 cursor-pointer hover:text-gray-600 transition-colors p-2 rounded hover:bg-gray-50"
            >
              {notes || 'Insert your notes here'}
            </div>
          )}
        </div>

        {/* Subtasks Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold text-gray-500 uppercase">
              SUBTASKS {stats.completed}/{stats.total}
            </h2>
            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-1">
              {subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg group"
                >
                  <button
                    onClick={() => handleToggleSubtask(subtask.id)}
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      subtask.isCompleted
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-300 hover:border-blue-600'
                    }`}
                  >
                    {subtask.isCompleted && <Check className="w-2.5 h-2.5 text-white" />}
                  </button>
                  <span
                    className={`flex-1 text-sm ${
                      subtask.isCompleted
                        ? 'line-through text-gray-400'
                        : 'text-gray-700'
                    }`}
                  >
                    {subtask.content}
                  </span>
                  <button
                    onClick={() => deleteSubtask(subtask.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Add new subtask */}
              <form onSubmit={handleAddSubtask} className="flex items-center space-x-3 p-2">
                <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                <input
                  type="text"
                  value={newSubtaskContent}
                  onChange={(e) => setNewSubtaskContent(e.target.value)}
                  placeholder="Add a new subtask"
                  className="flex-1 text-sm text-gray-400 bg-transparent focus:outline-none focus:text-gray-700"
                  disabled={isCreating}
                />
              </form>
            </div>
          )}
        </div>

        {/* Attachments Section */}
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2">ATTACHMENTS</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
            <Paperclip className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-gray-500">Click to add / drop your files here</p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 border-t border-gray-200 space-y-2">
        <button
          onClick={onMarkComplete}
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
        >
          Mark as complete
        </button>
        <button className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium flex items-center justify-center space-x-2">
          <Trash2 className="w-4 h-4" />
          <span>Delete task</span>
        </button>
      </div>
    </div>
  );
};

export default ItemDetailView;
