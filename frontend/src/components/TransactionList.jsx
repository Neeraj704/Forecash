import React, { useEffect, useState } from 'react';
import { getTransactions, deleteTransaction } from '../api/transaction';
import { useAuthStore } from '../store/authStore';

export default function TransactionList({ refreshFlag }) {
  const { accessToken } = useAuthStore();
  const [txns, setTxns] = useState([]);

  const load = async ()=>{
    const res = await getTransactions(accessToken);
    setTxns(res.data);
  };

  useEffect(()=>{ load(); },[refreshFlag]);

  const del = async id=>{
    await deleteTransaction(id, accessToken);
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-8">Transactions</h2>
      <ul className="space-y-1">
        {txns.map(t=>(
          <li key={t.id} className="flex py-2 justify-between border-b border-gray-600 mb-5">
            <span>{t.description||'–'}: ₹{t.amount.toFixed(2)}</span>
            <button onClick={()=>del(t.id)} className="text-red-500">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
