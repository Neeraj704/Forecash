import React, { useEffect, useState } from "react";
import { getTransactions, deleteTransaction } from "../api/transaction";
import { useAuthStore } from "../store/authStore";
import { MdDelete } from "react-icons/md";
export default function TransactionList({ refreshFlag }) {
  const { accessToken } = useAuthStore();
  const [txns, setTxns] = useState([]);
  const [filter, setFilter] = useState("all");
  const { refreshUser } = useAuthStore();

  const load = async () => {
    const res = await getTransactions(accessToken);
    setTxns(res.data);
  };

  const del = async (id) => {
    await deleteTransaction(id, accessToken);
    await refreshUser();
    load();
  };

  useEffect(() => {
    load();
  }, [refreshFlag]);

  const filtered = txns.filter((t) =>
    filter === "all" ? true : t.type === filter
  );

  return (
    <div>
      <div className="text-xl font-semibold mb-2 flex gap-4 justify-between items-center ">
        <span>Transactions</span>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border  p-1 rounded  focus:outline-none bg-[#2E3137] "
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>
      <ul className="space-y-1">
        {filtered.map((t) => (
          <li key={t.id} className="flex gap-2 justify-between border-b pb-1">
            <span>
              {t.description || "–"}:&nbsp;
              <span
                className={
                  t.type === "income" ? "text-green-600" : "text-red-600"
                }
              >
                ₹{t.amount.toFixed(2)}
              </span>
            </span>
            <button
              onClick={() => del(t.id)}
              className="text-red-500 cursor-pointer"
            >
              <MdDelete size={20} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
