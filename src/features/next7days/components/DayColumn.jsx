import { Plus, List } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDayColumnLogic } from '../hooks/useDayColumnLogic';
import { TaskList } from './TaskList';
import { TaskInput } from './TaskInput';
import { LoadingSpinner } from './LoadingSpinner';
import { DeleteModal } from './DeleteModal';
import { SubtasksModal } from './SubtasksModal';
import { EditTaskModal } from './EditTaskModal';
import { ChangeListModal } from './ChangeListModal';

const DayColumn = ({ dayName, items = [], date, isLoading = false, isToday = false }) => {
  const { t } = useTranslation();
  const [isMobileComposerOpen, setMobileComposerOpen] = useState(false);
  const [selectedChip, setSelectedChip] = useState('hoy');
  const [selectedItemForSubtasks, setSelectedItemForSubtasks] = useState(null);

  const {
    newTaskText,
    setNewTaskText,
    localItems,
    sensors,
    handleDragEnd,
    togglingItemId,
    handleToggle,
    handleSaveEdit,
    handleChangeList,
    handleDeleteItem,
    confirmDelete,
    handleAddTask,
    itemToEdit,
    setItemToEdit,
    itemToChangeList,
    setItemToChangeList,
    isRefetching,
    lists,
    selectedListId,
    setSelectedListId,
    showListSelector,
    setShowListSelector,
    showDeleteModal,
    setShowDeleteModal,
    addItemMutation,
    deleteItemMutation,
    updateItemMutation,
  } = useDayColumnLogic(items, date, isToday);

  return (
    <>
      <div
        className="border border-border rounded-lg w-full md:min-w-[240px] md:max-w-[260px] md:flex-shrink-0 flex flex-col bg-card"
        style={{ height: 'fit-content', maxHeight: '700px' }}
      >
        <div className="flex items-center justify-between mb-3 py-1 px-4 pt-3 flex-shrink-0">
          <h3 className="text-sm font-semibold text-foreground">
            {isToday && `${t('next7Days.today')} - `}{dayName}
          </h3>
          {localItems.length === 0 && (
            <button
              type="button"
              onClick={() => setMobileComposerOpen(true)}
              className="md:hidden p-1"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          )}
        </div>

        <div className="overflow-y-auto custom-scrollbar flex-1 px-4">
          {(isLoading || isRefetching) && <LoadingSpinner />}

          {!isLoading && !isRefetching && localItems.length > 0 && (
            <TaskList
              items={localItems}
              sensors={sensors}
              onDragEnd={handleDragEnd}
              onToggle={handleToggle}
              onDelete={handleDeleteItem}
              onEdit={setItemToEdit}
              onViewList={setItemToChangeList}
              togglingItemId={togglingItemId}
            />
          )}
        </div>

        {!isLoading && !isRefetching && (
          <div className={localItems.length === 0 ? 'hidden md:block' : ''}>
            <TaskInput
              value={newTaskText}
              onChange={setNewTaskText}
              onSubmit={handleAddTask}
              onListSelectorToggle={() => setShowListSelector(!showListSelector)}
              showListSelector={showListSelector}
              lists={lists}
              selectedListId={selectedListId}
              onListSelect={(listId) => {
                setSelectedListId(listId);
                setShowListSelector(false);
              }}
              isLoading={addItemMutation.isPending}
            />
          </div>
        )}
      </div>

      {isMobileComposerOpen && (
        <div className="fixed inset-x-0 bottom-0 bg-card border-t border-border p-4 z-50 md:hidden">
          <div className="flex gap-2 mb-4 overflow-x-auto">
            <button
              onClick={() => setSelectedChip('hoy')}
              className={`px-6 py-1 rounded-full text-sm whitespace-nowrap transition ${
                selectedChip === 'hoy' ? 'bg-[#8465FF] text-white' : 'bg-background text-foreground border border-border'
              }`}
              style={{ height: '28px' }}
            >
              Hoy día
            </button>
            <button
              onClick={() => setSelectedChip('mañana')}
              className={`px-6 py-1 rounded-full text-sm whitespace-nowrap transition ${
                selectedChip === 'mañana' ? 'bg-[#8465FF] text-white' : 'bg-background text-foreground border border-border'
              }`}
              style={{ height: '28px' }}
            >
              Mañana
            </button>
            <button
              onClick={() => setSelectedChip('dia')}
              className={`px-6 py-1 rounded-full text-sm whitespace-nowrap transition ${
                selectedChip === 'dia' ? 'bg-[#8465FF] text-white' : 'bg-background text-foreground border border-border'
              }`}
              style={{ height: '28px' }}
            >
              {dayName}
            </button>
          </div>

          <div className="flex items-center gap-2 bg-input border border-border rounded-full px-4 py-3">
            <input
              className="flex-1 bg-transparent text-sm leading-5 font-['DM_Sans'] text-foreground outline-none"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="Agregar tarea"
              autoFocus
            />
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-muted">
              <List className="w-5 h-5 text-white" />
            </button>
          </div>

          <button
            onClick={() => {
              handleAddTask();
              setMobileComposerOpen(false);
            }}
            className="mt-4 w-full py-3 rounded-lg bg-primary text-white font-semibold text-sm"
          >
            Aceptar
          </button>
        </div>
      )}

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        isDeleting={deleteItemMutation.isPending}
      />

      {selectedItemForSubtasks && (
        <SubtasksModal
          item={selectedItemForSubtasks}
          onClose={() => setSelectedItemForSubtasks(null)}
        />
      )}

      {itemToEdit && (
        <EditTaskModal
          item={itemToEdit}
          onClose={() => setItemToEdit(null)}
          onSave={handleSaveEdit}
          isSaving={updateItemMutation.isPending}
        />
      )}

      {itemToChangeList && (
        <ChangeListModal
          item={itemToChangeList}
          lists={lists}
          onClose={() => setItemToChangeList(null)}
          onChangeList={handleChangeList}
          isChanging={updateItemMutation.isPending}
        />
      )}
    </>
  );
};

export default DayColumn;
