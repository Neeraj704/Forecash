import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { getCategories, createCategory } from '../api/category';
import { createTransaction } from '../api/transaction';
import { useAuthStore } from '../store/authStore';

Modal.setAppElement('#root');

export default function CreateTransactionModal({ isOpen, onRequestClose, onSuccess, type }){
  const { accessToken, refreshUser } = useAuthStore();
  const [cats, setCats] = useState([]);
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [selCat, setSelCat] = useState('');
  const [newCat, setNewCat] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(()=>{
    if(isOpen){
      fetchCategories();
    }
  },[isOpen]);

  const fetchCategories = async ()=>{
    const res = await getCategories(accessToken);
    setCats(res.data);
  };

  const addCategory = async ()=>{
    if(!newCat) return;
    const res = await createCategory(newCat, accessToken);
    setCats([...cats, res.data]);
    setSelCat(res.data.name);
    setNewCat(''); setAdding(false);
  };

  const submit = async ()=>{
    await createTransaction({ amount:parseFloat(amount), description:desc, categoryName:selCat, type }, accessToken);
    onRequestClose();
    await refreshUser();
    onSuccess();
  };

  return (
    <Modal isOpen={isOpen} className="p-4 bg-white max-w-md mx-auto mt-20" overlayClassName="fixed inset-0 bg-black bg-opacity-50">
      <h2 className="text-xl mb-4">
        {type === "income" ? "Add Income" : "Add Expense"}
      </h2>
      <div className="space-y-2">
        <input type="number" placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} className="w-full border p-2"/>
        <input type="text" placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} className="w-full border p-2"/>
        <div>
          {!adding ? (
            <>
              <select value={selCat} onChange={e=>setSelCat(e.target.value)} className="w-full border p-2">
                <option value="">-- Select Category --</option>
                {cats.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
              <button onClick={()=>setAdding(true)} className="mt-2 text-blue-500">+ Create New Category</button>
            </>
          ) : (
            <div className="flex space-x-2">
              <input type="text" placeholder="New Category" value={newCat}
                    onChange={e=>setNewCat(e.target.value)} className="flex-1 border p-2"/>
              <button onClick={addCategory} className="bg-green-500 text-white p-2">Add</button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button onClick={onRequestClose} className="mr-2">Cancel</button>
        <button onClick={submit} className="bg-blue-500 text-white p-2">Save</button>
      </div>
    </Modal>
  );
}
