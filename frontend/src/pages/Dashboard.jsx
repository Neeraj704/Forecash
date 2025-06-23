import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import BalanceModal from '../components/BalanceModal';
import CreateTransactionModal from '../components/CreateTransactionModal';
import TransactionList from '../components/TransactionList';
import GoalForm from '../components/GoalForm';
import GoalList from '../components/GoalList';
import CategoryPieChart from '../components/PieChart';
import SavingsGraph from '../components/SavingsGraph';
import { useAuthStore } from '../store/authStore';
import { getTransactions } from '../api/transaction';
import AddGoalModal from '../components/AddGoalModal';

export default function Dashboard(){
  const { user, refreshUser, accessToken } = useAuthStore();
  const [showBLModal, setShowBLModal] = useState(!user.balance && !user.dailyLimit);
  const [showTxnModal, setShowTxnModal] = useState(false);
  const [txnFlag, setTxnFlag] = useState(0);
  const [spentToday, setSpentToday] = useState(0);
  const [goalFlag, setGoalFlag] = useState(0);
  const [showGoalModal, setShowGoalModal] = useState(false);

  useEffect(() => {
    getTransactions(accessToken).then(res => {
      const today = new Date().toISOString().slice(0, 10);
      const spent = res.data
        .filter(t => t.date.startsWith(today))
        .reduce((sum, t) => sum + t.amount, 0);
      setSpentToday(spent);
    });
  }, [txnFlag]);

  useEffect(()=>{
    if(user && (user.balance===0 && user.dailyLimit===0)) setShowBLModal(true);
  },[user]);

  const limitLeft = user.dailyLimit - spentToday;
  const pct = user.dailyLimit ? Math.max(0, Math.min(100, (spentToday/user.dailyLimit)*100)) : 0;


  return (
    <div>
      <Navbar/>
      <div className="flex">
        <Sidebar/>
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="text-gray-600">Current Balance</div>
              <div className="text-2xl font-bold">₹{user.balance.toFixed(2)}</div>
              <button
                onClick={refreshUser}
                className="text-sm text-blue-500 underline"
              >Refresh</button>
            </div>
            <div>
              <div className="text-gray-600">Limit Left</div>
              <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">₹{limitLeft.toFixed(2)}</div>
              <button
                onClick={() => {
                  refreshUser();
                  setTxnFlag(f => f);
                }}
                className="text-sm text-blue-500 underline"
              >
                Refresh
              </button>
            </div>
              <div className="w-48 bg-gray-200 h-2 rounded mt-1">
                <div className="bg-blue-500 h-2 rounded" style={{ width:`${pct}%` }} />
              </div>
            </div>
            <button onClick={()=>setShowTxnModal(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded">
              Create Transaction
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <TransactionList refreshFlag={txnFlag}/>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => setShowGoalModal(true)}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Add Goal
              </button>
              <GoalList refreshFlag={goalFlag} />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <CategoryPieChart/>
            <SavingsGraph/>
          </div>
        </main>
      </div>

      <BalanceModal isOpen={showBLModal} onRequestClose={()=>setShowBLModal(false)}/>
      <CreateTransactionModal
        isOpen={showTxnModal}
        onRequestClose={()=>setShowTxnModal(false)}
        onSuccess={() => {
          setTxnFlag(f => f + 1);
          setGoalFlag(f => f + 1);    
        }}
      />
      <AddGoalModal
        isOpen={showGoalModal}
        onRequestClose={() => setShowGoalModal(false)}
        onSuccess={() => setGoalFlag(f => f + 1)}
      />
    </div>
  );
}
