// frontend/src/components/GoalList.jsx
import React, { useState, useEffect } from 'react';
import { deleteGoal, getGoals, reorderGoals } from '../api/goal';
import { useAuthStore } from '../store/authStore';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function GoalList({ refreshFlag }) {
  const { accessToken } = useAuthStore();
  const [goals, setGoals] = useState([]);

  // load goals from server
  const load = async () => {
    const res = await getGoals(accessToken);
    setGoals(res.data);
  };

  // delete + reload
  const handleDelete = async id => {
    await deleteGoal(id, accessToken);
    await load();
  };

  // reorder + persist priority
  const onDragEnd = async ({ source, destination }) => {
    if (!destination) return;
    const items = Array.from(goals);
    const [moved] = items.splice(source.index, 1);
    items.splice(destination.index, 0, moved);
    setGoals(items);
    const order = items.map(g => g.id);
    await reorderGoals(order, accessToken);
  };

  // reload whenever parent signals change
  useEffect(() => {
    load();
  }, [refreshFlag]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="goals">
        {provided => (
          <ul ref={provided.innerRef} {...provided.droppableProps}>
            {goals.map((g, idx) => {
              const percent = g.target
                ? Math.min(100, (g.current / g.target) * 100).toFixed(0)
                : 0;
              return (
                <Draggable key={g.id} draggableId={String(g.id)} index={idx}>
                  {prov => (
                    <li
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      {...prov.dragHandleProps}
                      className="border-b border-gray-600 p-2 mb-2 flex justify-between items-center"
                    >
                      <div className="flex items-center space-x-4">
                        {/* Progress circle */}
                        <progress
                          className="w-12 h-12"
                          value={g.current}
                          max={g.target}
                        />
                        <div>
                          <div className="font-medium">{g.name}</div>
                          <div className="text-sm">
                            ₹{g.current.toFixed(2)} / ₹{g.target.toFixed(2)} (
                            {percent}%)
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(g.id)}
                        className="text-red-500 ml-4"
                      >
                        Delete
                      </button>
                    </li>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}
