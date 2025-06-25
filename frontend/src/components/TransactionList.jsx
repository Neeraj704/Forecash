import React, { useEffect, useState } from 'react';
import { getTransactions, deleteTransaction } from '../api/transaction';
import { useAuthStore } from '../store/authStore';

export default function TransactionList({ refreshFlag }) {
  const { accessToken } = useAuthStore();
  const [txns, setTxns] = useState([]);
  const [filter, setFilter] = useState('all');

  const load = async () => {
    const res = await getTransactions(accessToken);
    setTxns(res.data);
  };

  useEffect(() => { load(); }, [refreshFlag]);

  const filtered = txns.filter(t =>
    filter === 'all' ? true : t.type === filter
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2 flex justify-between items-center">
        <span>Transactions</span>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </h2>
      <ul className="space-y-1">
        {filtered.map(t=>(
          <li key={t.id} className="flex justify-between border-b pb-1">
            <span>
              {t.description || '–'}:&nbsp;
              <span className={t.type==='income'?'text-green-600':'text-red-600'}>
                ₹{t.amount.toFixed(2)}
              </span>
            </span>
            <button onClick={()=>{ deleteTransaction(t.id, accessToken); load(); }}
                    className="text-red-500">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
