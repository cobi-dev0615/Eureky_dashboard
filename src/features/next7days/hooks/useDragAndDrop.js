import { useState, useEffect } from 'react';
import { useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

export const useDragAndDrop = (items, onReorder) => {
    const [localItems, setLocalItems] = useState(items);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    useEffect(() => {
        setLocalItems(items);
    }, [items]);

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setLocalItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                const reorderedItems = arrayMove(items, oldIndex, newIndex);

                if (onReorder) {
                    onReorder(active.id, oldIndex, newIndex);
                }

                return reorderedItems;
            });
        }
    };

    return {
        localItems,
        sensors,
        handleDragEnd,
    };
};
