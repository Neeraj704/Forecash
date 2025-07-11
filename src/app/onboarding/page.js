'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function OnboardingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // wizard state
  const [step, setStep] = useState(1)
  const [mode, setMode] = useState('')
  const [currency, setCurrency] = useState('INR')
  const [initialBalance, setInitialBalance] = useState('')
  const [dailyLimit, setDailyLimit] = useState('')
  const [fimcpPhone, setFimcpPhone] = useState('')
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState('')

  // redirect if not authed
  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login')
  }, [status, router])

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>
  }

  const next = () => {
    if (step === 1 && !mode) {
      setError('Please select a mode.')
      return
    }
    setError('')
    setStep(s => s + 1)
  }
  const prev = () => setStep(s => s - 1)

  const submit = async () => {
    console.log("Submitting onboarding:", {
      mode,
      currency,
      initialBalance,
      dailyLimit,
      fimcpPhone,
      consent,
    });

    try {
      const res = await axios.post('/api/onboarding', {
        mode,
        currency,
        initialBalance: parseFloat(initialBalance),
        dailyLimit: parseFloat(dailyLimit),
        fimcpPhone,
        consent,
      });

      console.log("API response:", res.data);
      if (res.data.ok) {
        window.location.href = '/dashboard';
      } else {
        setError(res.data.error || 'Submission failed.');
      }
    } catch (e) {
      console.error("Onboarding POST error:", e);
      const srvErr = e.response?.data?.error;
      setError(srvErr || e.message || 'Submission failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">
          Welcome to Forecash, {session.user.name || session.user.email}!
        </h2>

        {step === 1 && (
          <>
            <h3 className="font-semibold mb-2">Choose your way</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[
                { id: 'manual', title: 'Manual Mode', desc: 'Enter transactions yourself without bank connections.' },
                { id: 'fimcp', title: 'Fi‑MCP Mode',  desc: 'Connect your bank/investments via Fi‑MCP.' },
                { id: 'hybrid', title: 'Hybrid Mode', desc: 'Combine manual and Fi‑MCP together.' },
              ].map(opt => (
                <div
                  key={opt.id}
                  onClick={() => setMode(opt.id)}
                  className={`
                    p-4 border rounded cursor-pointer
                    ${mode === opt.id ? 'border-green-500 bg-green-50' : 'border-gray-300'}
                  `}
                >
                  <h4 className="font-medium">{opt.title}</h4>
                  <p className="text-sm text-gray-600">{opt.desc}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {step === 2 && mode === 'manual' && (
          <>
            <h3 className="font-semibold mb-2">Manual Setup</h3>
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm">Currency</label>
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="mt-1 p-2 border rounded w-full"
                >
                  <option>INR</option>
                  <option>USD</option>
                  <option>EUR</option>
                </select>
              </div>
              <div>
                <label className="block text-sm">Current Balance</label>
                <input
                  type="number"
                  value={initialBalance}
                  onChange={e => setInitialBalance(e.target.value)}
                  className="mt-1 p-2 border rounded w-full"
                  placeholder="e.g. 10000"
                />
              </div>
              <div>
                <label className="block text-sm">Daily Spend Limit</label>
                <input
                  type="number"
                  value={dailyLimit}
                  onChange={e => setDailyLimit(e.target.value)}
                  className="mt-1 p-2 border rounded w-full"
                  placeholder="e.g. 2000"
                />
              </div>
            </div>
          </>
        )}

        {step === 2 && mode === 'fimcp' && (
          <>
            <h3 className="font-semibold mb-2">Fi‑MCP Setup</h3>
            <p className="mb-2 text-sm text-gray-600">
              To connect your financial data via Fi‑MCP, please enter the dummy phone number defined in the Fi‑MCP dev server.
            </p>
            <div className="mb-4">
              <label className="block text-sm">Phone Number</label>
              <input
                type="text"
                value={fimcpPhone}
                onChange={e => setFimcpPhone(e.target.value)}
                className="mt-1 p-2 border rounded w-full"
                placeholder="e.g. 1111111111"
              />
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={consent}
                onChange={e => setConsent(e.target.checked)}
                className="mr-2"
              />
              <label className="text-sm">I consent to share my financial data</label>
            </div>
          </>
        )}

        {step === 2 && mode === 'hybrid' && (
          <>
            <h3 className="font-semibold mb-2">Hybrid Setup</h3>
            <p className="mb-4 text-sm text-gray-600">
              You can both enter manually and sync via Fi‑MCP. Let’s set up both:
            </p>
            {/* Repeat manual & fimcp fields side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Init Balance</label>
                <input
                  type="number"
                  value={initialBalance}
                  onChange={e => setInitialBalance(e.target.value)}
                  className="mt-1 p-2 border rounded w-full"
                  placeholder="10000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Fi‑MCP Phone</label>
                <input
                  type="text"
                  value={fimcpPhone}
                  onChange={e => setFimcpPhone(e.target.value)}
                  className="mt-1 p-2 border rounded w-full"
                  placeholder="1111111111"
                />
              </div>
            </div>
          </>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button onClick={prev} className="px-4 py-2 border rounded">
              Previous
            </button>
          )}
          {step < 2 && (
            <button onClick={next} className="px-4 py-2 bg-blue-600 text-white rounded">
              Next
            </button>
          )}
          {step === 2 && (
            <button onClick={submit} className="px-4 py-2 bg-green-600 text-white rounded">
              Finish
            </button>
          )}
        </div>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  )
}