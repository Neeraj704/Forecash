import React, { useState, useEffect } from 'react';
import { deleteGoal, getGoals, distributeSavings } from '../api/goal';
import { getMockSavings } from '../api/ml';
import { useAuthStore } from '../store/authStore';
import { reorderGoals } from '../api/goal';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function GoalList({ refreshFlag }) {
  const { accessToken } = useAuthStore();
  const [goals, setGoals] = useState([]);
  const [distributing, setDistributing] = useState(false);
  
  const load = async ()=>{
    const res = await getGoals(accessToken);
    setGoals(res.data);
  };
  
  const onDragEnd = async ({ source, destination }) => {
    if (!destination) return;
    const items = Array.from(goals);
    const [moved] = items.splice(source.index, 1);
    items.splice(destination.index, 0, moved);
    setGoals(items);
    const order = items.map(g => g.id);
    await reorderGoals(order, accessToken);
  };
  
  useEffect(()=>{ load(); },[refreshFlag]);
  
  const runML = async ()=>{
    setDistributing(true);
    const res = await getMockSavings(accessToken);
    await distributeSavings(res.data.amount, accessToken);
    await load();
    setDistributing(false);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="goals">
        {provided => (
          <ul ref={provided.innerRef} {...provided.droppableProps}>
            {goals.map((g, idx) => (
              <Draggable key={g.id} draggableId={String(g.id)} index={idx}>
                {prov => (
                  <li
                    ref={prov.innerRef}
                    {...prov.draggableProps}
                    {...prov.dragHandleProps}
                    className="border-b border-gray-600  p-2 mb-2 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{g.name}</div>
                      <div>₹{g.current.toFixed(2)} / ₹{g.target.toFixed(2)}</div>
                    </div>
                    <button
                      onClick={async () => {
                        await deleteGoal(g.id, accessToken);
                        onRefresh();
                      }}
                      className="text-red-500 ml-4"
                    >Delete</button>
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}