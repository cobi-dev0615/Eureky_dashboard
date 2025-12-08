import { Plus, List, Calendar, Inbox, CalendarDays, Settings as SettingsIcon } from 'lucide-react';
import { useListsOperations } from '../hooks/useListsQuery';

const ListsSidebar = ({ selectedListId, onSelectList, onCreateList }) => {
  const { lists, isLoading } = useListsOperations();

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-4">

        {/* My Lists Section */}
        <div className="px-3">
          <div className="flex items-center justify-between px-3 py-2 mb-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase">My lists</h3>
            <button
              onClick={onCreateList}
              className="p-0.5 hover:bg-gray-200 rounded transition-colors"
              title="Create new list"
            >
              <Plus className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
            </div>
          ) : (
            <div className="space-y-1">
              {lists.map((list) => {
                const isActive = selectedListId === list.id;
                return (
                  <button
                    key={list.id}
                    onClick={() => onSelectList(list.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${isActive
                      ? 'bg-gray-200 text-gray-900 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <List className="w-4 h-4" />
                      <span className="truncate">{list.name}</span>
                    </div>
                    {list.itemCount > 0 && (
                      <span className="text-xs text-gray-500">{list.itemCount}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Tags Section */}
        <div className="px-3 mt-6">
          <div className="flex items-center justify-between px-3 py-2 mb-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase">Tags</h3>
            <button
              className="p-0.5 hover:bg-gray-200 rounded transition-colors"
              title="Create new tag"
            >
              <Plus className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="space-y-1">
            <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              <span className="text-yellow-500">#</span>
              <span>Priority</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-center text-gray-500">
          <p>Easily collaborate with</p>
          <p>your family or team</p>
          <button className="mt-2 text-blue-600 hover:underline">Try it</button>
        </div>
      </div>
    </div>
  );
};

export default ListsSidebar;
