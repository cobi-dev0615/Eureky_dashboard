import { useState } from 'react';
import { Plus, MoreHorizontal, SlidersHorizontal } from 'lucide-react';
import ListsSidebar from './components/ListsSidebar';
import ListForm from './components/ListForm';
import ItemCard from './components/ItemCard';
import ItemForm from './components/ItemForm';
import ItemDetailView from './components/ItemDetailView';
import { useListsOperations } from './hooks/useListsQuery';
import { useAllUserItems, useListItems, useAddItemToList, useToggleItemCompletion, useDeleteItem, useUpdateItem, useAddItemToDefaultList } from './hooks/useListItemsQuery';

const Lists = () => {
  const {
    lists,
    isLoading: listsLoading,
    createList,
    updateList,
  } = useListsOperations();

  // State management
  const [selectedListId, setSelectedListId] = useState('all');
  const [showListForm, setShowListForm] = useState(false);
  const [editingList, setEditingList] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState('');

  // Get items based on selected list/view
  const { data: allItems = [], isLoading: allItemsLoading } = useAllUserItems();
  const { data: listItems = [], isLoading: listItemsLoading } = useListItems(
    selectedListId !== 'all' && selectedListId !== 'today' && selectedListId !== 'next7' ? selectedListId : null
  );

  // Item operations
  const addItemMutation = useAddItemToDefaultList();
  const toggleItemMutation = useToggleItemCompletion();
  const deleteItemMutation = useDeleteItem();
  const updateItemMutation = useUpdateItem();

  // Determine which items to display
  const displayItems = selectedListId === 'all'
    ? allItems
    : selectedListId === 'today' || selectedListId === 'next7'
    ? allItems // TODO: filter by date
    : listItems;

  const isLoading = selectedListId === 'all' ? allItemsLoading : listItemsLoading;

  // Get current list/view name
  const getViewTitle = () => {
    if (selectedListId === 'all') return 'All my tasks';
    if (selectedListId === 'today') return 'My day';
    if (selectedListId === 'next7') return 'Next 7 days';
    const list = lists.find(l => l.id === selectedListId);
    return list?.name || 'Tasks';
  };

  // Handlers
  const handleSelectList = (listId) => {
    setSelectedListId(listId);
    setSelectedItem(null);
  };

  const handleCreateList = () => {
    setShowListForm(true);
  };

  const handleSubmitList = (listData) => {
    if (editingList) {
      updateList({ id: editingList.id, ...listData }, {
        onSuccess: () => {
          setShowListForm(false);
          setEditingList(null);
        }
      });
    } else {
      createList(listData, {
        onSuccess: () => {
          setShowListForm(false);
        }
      });
    }
  };

  const handleCancelList = () => {
    setShowListForm(false);
    setEditingList(null);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleCloseItemDetail = () => {
    setSelectedItem(null);
  };

  const handleToggleItem = (itemId) => {
    toggleItemMutation.mutate(itemId);
  };

  const handleDeleteItem = (itemId) => {
    deleteItemMutation.mutate(itemId);
    if (selectedItem?.id === itemId) {
      setSelectedItem(null);
    }
  };

  const handleMarkItemComplete = () => {
    if (selectedItem) {
      toggleItemMutation.mutate(selectedItem.id);
      setSelectedItem(null);
    }
  };

  const handleUpdateItem = (updates) => {
    updateItemMutation.mutate(updates);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskContent.trim()) return;

    addItemMutation.mutate(
      { content: newTaskContent },
      {
        onSuccess: () => {
          setNewTaskContent('');
          setShowAddTask(false);
        }
      }
    );
  };

  // Get list name for an item
  const getListNameForItem = (item) => {
    if (!item.listId) return 'Personal';
    const list = lists.find(l => l.id === item.listId);
    return list?.name || 'Personal';
  };

  // Main render with new layout
  return (
    <div className="flex h-screen bg-white -m-6">
      {/* Left Sidebar */}
      <ListsSidebar
        selectedListId={selectedListId}
        onSelectList={handleSelectList}
        onCreateList={handleCreateList}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">{getViewTitle()}</h1>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <SlidersHorizontal className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
            </div>
          ) : displayItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No tasks yet.</p>
              <button
                onClick={() => setShowAddTask(true)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Add your first task
              </button>
            </div>
          ) : (
            <div className="space-y-2 max-w-4xl">
              {displayItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border ${
                    selectedItem?.id === item.id
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-transparent'
                  }`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleItem(item.id);
                    }}
                    className="mt-1 w-5 h-5 rounded-full border-2 border-gray-400 hover:border-blue-600 flex-shrink-0 transition-colors"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${item.isCompleted ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                      {item.content}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">{getListNameForItem(item)}</span>
                      {item.subtaskStats && item.subtaskStats.total > 0 && (
                        <>
                          <span className="text-xs text-gray-400">|</span>
                          <span className="text-xs text-gray-500">
                            {item.subtaskStats.completed}/{item.subtaskStats.total}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Task Button */}
          {showAddTask ? (
            <form onSubmit={handleAddTask} className="mt-4 max-w-4xl">
              <div className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg bg-white">
                <div className="mt-1 w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                <input
                  type="text"
                  value={newTaskContent}
                  onChange={(e) => setNewTaskContent(e.target.value)}
                  placeholder="Task name"
                  className="flex-1 text-sm focus:outline-none"
                  autoFocus
                />
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <button
                  type="submit"
                  disabled={addItemMutation.isPending}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  Add task
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddTask(false);
                    setNewTaskContent('');
                  }}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowAddTask(true)}
              className="mt-4 flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm">Add task</span>
            </button>
          )}
        </div>
      </div>

      {/* Right Panel - Item Detail */}
      {selectedItem && (
        <div className="w-96 border-l border-gray-200 bg-white overflow-hidden">
          <ItemDetailView
            item={selectedItem}
            onClose={handleCloseItemDetail}
            onMarkComplete={handleMarkItemComplete}
            onUpdate={handleUpdateItem}
            lists={lists}
          />
        </div>
      )}

      {/* List Form Modal */}
      {showListForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">
              {editingList ? 'Edit List' : 'Create New List'}
            </h2>
            <ListForm
              onSubmit={handleSubmitList}
              onCancel={handleCancelList}
              initialData={editingList}
              loading={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Lists;