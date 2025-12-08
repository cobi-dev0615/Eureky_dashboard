import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import { SortableTaskItem } from './SortableTaskItem';

export const TaskList = ({
  items,
  sensors,
  onDragEnd,
  onToggle,
  onDelete,
  onEdit,
  onViewList,
  togglingItemId,
}) => {
  if (items.length === 0) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <SortableTaskItem
                key={item.id}
                item={item}
                onToggle={onToggle}
                onDelete={onDelete}
                onEdit={onEdit}
                onViewList={onViewList}
                isToggling={togglingItemId === item.id}
              />
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>
    </DndContext>
  );
};
