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
import mlDummy from '../assets/mlDummy.png';

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
    <div className='flex flex-col min-h-screen bg-[#1E1E21] text-white p-2'>
      <Navbar/>
      <div className="flex flex-1 h-full">
        <Sidebar/>
        <main className="flex flex-auto h-[calc(100vh-100px)]">
          <div className="flex flex-col p-3 flex-1 ">
            <div className='h-16 bg-transparent m-2'>
              <div>
                <p>Dashboard</p>
              </div>
              <div>
                <p>Manage your payments and transactions in one click!!</p>
              </div>
            </div>
            <div className='flex-1'>
              {/* START OF LEFT 4 BOXES THING */} 
              <div className='flex flex-col flex-1 p-2 gap-5 h-full items-stretch'>

                <div className='flex flex-1 gap-5'>
                  {/* FIRST BOX  */}
                  <div className='flex-[34%] bg-[#2E3137] h-full rounded-2xl shadow p-6'>
                    <div>
                      <div className='flex justify-between'>
                        <div className="text-neutral-300">
                          Current Balance
                        </div> 
                        <button onClick={refreshUser}
                                className="text-sm text-blue-500 underline"
                          >Refresh</button>
                      </div>
                      <div className="text-4xl mt-10 font-bold">
                        ₹{user.balance.toFixed(2)}
                      </div>
                    </div>
                    <button onClick={()=>setShowTxnModal(true)}
                            className="bg-[#FFF27A] text-gray-900 px-4 py-2 rounded-4xl mt-10">
                      Create Transaction
                    </button>
                  </div>
                  {/* END OF FIRST BOX  */}

                  {/* SECOND BOX  */}
                  <div className='flex-[66%] bg-[#2E3137] h-full rounded-2xl shadow p-6 relative overflow-hidden'>
                    <div>
                      <img src={mlDummy} className='absolute top-3 center'></img>
                    </div>
                    {/* <SavingsGraph/> */}
                  </div>
                  {/* END OF SECOND BOX  */}
                </div>

                <div className='flex flex-1 gap-5'>
                  {/* THIRD BOX  */}
                  <div className='flex-[55%] bg-[#2E3137] h-full rounded-2xl shadow p-6'>
                    <div className='flex justify-between'>
                      <p className='text-white text-lg font-medium mb-2'>
                        Financial Goals
                      </p>
                      <button
                        onClick={() => setShowGoalModal(true)}
                        className="bg-[#FFF27A] text-gray-900 px-4 py-2 rounded-4xl mb-10"
                      >
                        Add Goal
                      </button>
                    </div>
                    <div className=''>
                      <GoalList refreshFlag={goalFlag} />
                    </div>
                  </div>
                  {/* END OF THIRD BOX  */}

                  {/* FOURTH BOX  */}
                  <div className='flex-[45%] bg-[#2E3137] h-full rounded-2xl shadow p-6'>
                    <CategoryPieChart/>
                  </div>
                  {/* END OF FOURTH BOX  */}
                </div>

              </div>
              {/* END OF LEFT 4 BOXES THING  */}
            </div>
          </div>

          {/* START OF TRANSACTION SIDE THINGS */}
          <div className='m-3 bg-[#2E3137] rounded-2xl shadow p-6 flex flex-col justify-between'> 
            {/* FIRST BOX  */}
            <div className=''>
              <TransactionList refreshFlag={txnFlag}/>
            </div>
            {/* END OF FIRST BOX  */}

            {/* SECOND BOX  */}
            <div>
              <div className="text-gray-600">
                <p>Limit Left</p>
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
              <div className="flex items-center space-x-2">
                <div className="w-48 bg-gray-200 h-2 rounded mt-1">
                  <div className="bg-[#FFF27A] h-2 rounded" style={{ width:`${pct}%` }} />
                </div>
                <div className="text-2xl font-bold">
                  ₹{limitLeft.toFixed(2)}
                </div>
              </div>
            </div>
            {/* END OF SECOND BOX  */}
          </div>
          {/* END OF TRANSACTION SIDE THINGS */}
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
