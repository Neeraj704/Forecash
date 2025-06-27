import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import BalanceModal from "../components/BalanceModal";
import CreateTransactionModal from "../components/CreateTransactionModal";
import TransactionList from "../components/TransactionList";
import GoalList from "../components/GoalList";
import CategoryPieChart from "../components/PieChart";
import { useAuthStore } from "../store/authStore";
import { getTransactions } from "../api/transaction";
import AddGoalModal from "../components/AddGoalModal";
import ForecastPlotly from "../components/ForecastPlotly";
import { forecast } from "../api/ml";
import axios from "axios";
import ChatBot from "../components/ChatBot";
import { IoMdRefresh } from "react-icons/io";

export default function Dashboard() {
  const { user, refreshUser, accessToken } = useAuthStore();
  const [showBLModal, setShowBLModal] = useState(
    !user.balance && !user.dailyLimit
  );
  const [showTxnModal, setShowTxnModal] = useState(false);
  const [txnFlag, setTxnFlag] = useState(0);
  const [spentToday, setSpentToday] = useState(0);
  const [goalFlag, setGoalFlag] = useState(0);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [txnType, setTxnType] = useState("expense");
  const [forecastData, setForecastData] = useState(null);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    getTransactions(accessToken).then((res) => {
      const today = new Date().toISOString().slice(0, 10);
      const spent = res.data
        .filter((t) => t.date.startsWith(today) && t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
      setSpentToday(spent);
      const allTxns = res.data;
      forecast(user, allTxns).then((received_data) => {
        setForecastData(received_data);
        axios
          .post(
            `${import.meta.env.VITE_API_URL}/goal/reset-distribute`,
            {
              amount:
                received_data.graph.data[1].y[
                  received_data.graph.data[1].y.length - 1
                ],
            },
            { headers: { Authorization: `Bearer ${accessToken}` } }
          )
          .then(() => {
            setGoalFlag((f) => f + 1);
          });
      });
    });
  }, [txnFlag, accessToken]);

  useEffect(() => {
    if (user && user.balance === 0 && user.dailyLimit === 0)
      setShowBLModal(true);
  }, [user]);

  const limitLeft = user.dailyLimit - spentToday;
  const pct = user.dailyLimit
    ? Math.max(0, Math.min(100, (spentToday / user.dailyLimit) * 100))
    : 0;

  return (
    <div className="flex flex-col min-h-screen text-white p-2">
      <Navbar />
      <div className="h-16 bg-transparent m-2 ml-5">
        <div>
          <h2 className="text-2xl font-bold text-purple-600">Dashboard</h2>
        </div>
        <div>
          <p className="text-gray-400">
            Manage your payments and transactions in one click!!
          </p>
        </div>
      </div>
      <div className="flex flex-1 h-full">
        <main className="flex flex-auto">
          <div className="flex flex-col p-3 flex-1 ">
            <div className="flex-1">
              {/* START OF LEFT 4 BOXES THING */}
              <div className="flex flex-col flex-1 gap-5 h-full items-stretch">
                <div className="flex flex-1 gap-5">
                  <div className="flex flex-col gap-5">
                    {/* FIRST BOX  */}
                    <div className="flex-[34%] bg-[#2E3137] h-full rounded-2xl shadow p-6">
                      <div>
                        <div className="flex justify-between">
                          <div className="text-neutral-300">
                            Current Balance
                          </div>
                          <button
                            onClick={refreshUser}
                            className="text-sm flex cursor-pointer items-center gap-2 hover:text-blue-500 hover:underline"
                          >
                            <IoMdRefresh size={20} />
                          </button>
                        </div>
                        <div className="text-3xl mt-10 font-bold">
                          ₹{user.balance.toFixed(2)}
                        </div>
                      </div>
                      <div className="flex gap-3 my-4">
                        <button
                          onClick={() => {
                            setTxnType("income");
                            setShowTxnModal(true);
                          }}
                          className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                          Add Income
                        </button>
                        <button
                          onClick={() => {
                            setTxnType("expense");
                            setShowTxnModal(true);
                          }}
                          className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                          Add Expense
                        </button>
                      </div>
                    </div>
                    {/* END OF FIRST BOX  */}
                    {/* SECOND BOX  */}
                    <div className="bg-[#2E3137] p-6 rounded-2xl shadow">
                      <div className="text-gray-300 flex justify-between">
                        <div>
                          <p>Limit Left</p>
                        </div>

                        <div>
                          <button
                            onClick={() => setShowBLModal(true)}
                            className="text-sm hover:text-blue-500 hover:underline"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col mt-4">
                        <div className="text-2xl font-bold">
                          ₹{limitLeft.toFixed(2)}
                        </div>
                        <div className="w-48 bg-gray-200 h-2 rounded mt-1">
                          <div
                            className="bg-[#FFF27A] h-2 rounded"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    {/* END OF SECOND BOX  */}
                  </div>

                  {/* SECOND BOX  */}
                  <div className="flex-[66%] bg-[#2E3137] h-max-full rounded-2xl shadow p-6 relative overflow-hidden">
                    {forecastData ? (
                      <ForecastPlotly graph={forecastData.graph} />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-gray-500">Loading forecast…</span>
                      </div>
                    )}
                    {/* <SavingsGraph/> */}
                  </div>
                  {/* END OF SECOND BOX  */}
                </div>

                <div className="flex flex-1 gap-5">
                  {/* THIRD BOX  */}
                  <div className="flex-[55%] bg-[#2E3137] h-full rounded-2xl shadow p-6">
                    <div className="flex justify-between">
                      <p className="text-white text-lg font-medium mb-2">
                        Financial Goals
                      </p>
                      <button
                        onClick={() => setShowGoalModal(true)}
                        className="bg-[#1dc603] text-white px-4 py-2 rounded-4xl mb-10"
                      >
                        Add Goal
                      </button>
                    </div>
                    <div className="">
                      <GoalList refreshFlag={goalFlag} />
                    </div>
                  </div>
                  {/* END OF THIRD BOX  */}

                  {/* FOURTH BOX  */}
                  <div className="flex-[45%] bg-[#2E3137] h-full rounded-2xl shadow p-6">
                    <CategoryPieChart />
                  </div>
                  {/* END OF FOURTH BOX  */}
                </div>
              </div>
              {/* END OF LEFT 4 BOXES THING  */}
            </div>
          </div>

          {/* START OF TRANSACTION SIDE THINGS */}
          <div className=" m-3 flex flex-col justify-between gap-5">
            {/* FIRST BOX  */}
            <div className=" bg-[#2E3137] p-6 flex-1 rounded-2xl">
              <TransactionList refreshFlag={txnFlag} />
            </div>
            {/* END OF FIRST BOX  */}
          </div>
          {/* END OF TRANSACTION SIDE THINGS */}
        </main>
      </div>

      <ChatBot />

      <BalanceModal
        isOpen={showBLModal}
        onRequestClose={() => setShowBLModal(false)}
      />
      <CreateTransactionModal
        isOpen={showTxnModal}
        onRequestClose={() => setShowTxnModal(false)}
        onSuccess={() => {
          setTxnFlag((f) => f + 1);
          setGoalFlag((f) => f + 1);
        }}
        type={txnType}
      />
      <AddGoalModal
        isOpen={showGoalModal}
        onRequestClose={() => setShowGoalModal(false)}
        onSuccess={() => setGoalFlag((f) => f + 1)}
      />
    </div>
  );
}
