import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { createGoal } from '../api/goal';
import { useAuthStore } from '../store/authStore';

Modal.setAppElement('#root');

export default function AddGoalModal({ isOpen, onRequestClose, onSuccess }) {
  const { accessToken } = useAuthStore();
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setTarget('');
    }
  }, [isOpen]);

  const handleSave = async () => {
    await createGoal({ name, target: parseFloat(target) }, accessToken);
    onSuccess();
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="p-6 bg-white max-w-md mx-auto mt-20 rounded-lg shadow-lg"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <h2 className="text-xl font-semibold mb-4">Add New Goal</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Goal Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Target Amount"
          value={target}
          onChange={e => setTarget(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="mt-6 flex justify-end space-x-2">
        <button onClick={onRequestClose} className="px-4 py-2 rounded border">
          Cancel
        </button>
        <button onClick={handleSave} className="px-4 py-2 rounded bg-blue-600 text-white">
          Save
        </button>
      </div>
    </Modal>
  );
}
