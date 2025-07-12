'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Check, Palette, CreditCard, Settings, Target, Shield, Bot, Sparkles } from 'lucide-react';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [showCompletion, setShowCompletion] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // form data - keeping your exact structure
  const [data, setData] = useState({
    theme: "Dark Mode", language: "English",
    currency: "INR",
    mode: "manual",
    initialBalance: "",
    dailyLimit: "",
    fimcpPhone: "",
    features: [],
    setGoalNow: false,
    goals: [], // { name, target }
    assistantMode: "voice_text",
    assistantTone: "friendly",
    enable2FA: false,
    accessibility: []
  });

  // Countdown effect
  useEffect(() => {
    if (showCompletion && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showCompletion && countdown === 0) {
      // Redirect to dashboard
      window.location.href = "/dashboard";
    }
  }, [showCompletion, countdown]);

  const upd = (k,v) => setData(d=>({ ...d, [k]: v }));

  // Your exact validation logic
  function canNext() {
    switch(step) {
      case 1: return data.theme && data.language;
      case 2: return !!data.currency;
      case 3: return !!data.mode;
      case 4:
        if (data.mode === "manual")
          return data.initialBalance!=="" && data.dailyLimit!=="";
        if (data.mode === "fimcp")
          return !!data.fimcpPhone;
        return data.initialBalance!=="" && data.dailyLimit!=="" && !!data.fimcpPhone;
      case 5: return true; // features optional
      case 6: return !data.setGoalNow || (data.goals.length>0); // goals decision + goals if yes
      case 7: return true; // skip this step now
      case 8: return true; // assistant pref
      case 9: return true; // security
      default:
        return true;
    }
  }

  const next = () => {
    if (!canNext()) {
      setError("Please fill required fields for this step.");
      return;
    }
    setError("");
    
    // Skip step 7 since goals are now handled in step 6
    if (step === 6) {
      setStep(8); // Jump directly to AI Assistant step
    } else {
      setStep(s=>s+1);
    }
  };
  
  const prev = () => { 
    setError(""); 
    // When going back from step 8, go back to step 6 (Goals Decision)
    if (step === 8) {
      setStep(6);
    } else {
      setStep(s=>s-1);
    }
  };

  // Your exact submit logic
  const submit = async () => {
    try {
      const response = await fetch('/api/onboardingPreference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        setShowCompletion(true);
        // Preload dashboard in background
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 100);
      } else {
        setError("Server error");
      }
    } catch (e) {
      setError("Server error");
    }
  };

  const totalSteps = 9;

  const stepIcons = {
    1: Palette,
    2: CreditCard,
    3: Settings,
    4: Settings,
    5: Sparkles,
    6: Target,
    7: Target,
    8: Bot,
    9: Shield
  };

  const stepTitles = {
    1: 'Theme & Language',
    2: 'Currency',
    3: 'Account Mode',
    4: 'Setup Details',
    5: 'Features',
    6: 'Goals Decision',
    7: 'Add Goals',
    8: 'AI Assistant',
    9: 'Security'
  };

  const StepIcon = stepIcons[step];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-white">Welcome to FinanceApp</h1>
            <span className="text-purple-300 font-medium">Step {step} of {totalSteps}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <StepIcon className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white">{stepTitles[step]}</h2>
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">
            {/* Step 1: Theme & Language */}
            {step===1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Choose your theme</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {["Dark Mode","Light Mode","High Contrast"].map(opt=>(
                      <button key={opt}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          data.theme===opt
                            ? 'border-purple-500 bg-purple-500/10 text-white'
                            : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                        }`}
                        onClick={()=>upd("theme",opt)}>
                        <div className="font-medium">{opt}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Select language</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['English', 'Hindi', 'Spanish', 'French'].map((lang) => (
                      <button key={lang}
                        className={`p-3 rounded-lg border transition-all ${
                          data.language === lang
                            ? 'border-purple-500 bg-purple-500/10 text-white'
                            : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                        }`}
                        onClick={()=>upd("language",lang)}>
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Currency */}
            {step===2 && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Select your currency</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'INR', label: 'Indian Rupee', symbol: '₹' },
                    { id: 'USD', label: 'US Dollar', symbol: '$' },
                    { id: 'EUR', label: 'Euro', symbol: '€' }
                  ].map((currency) => (
                    <button key={currency.id}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        data.currency === currency.id
                          ? 'border-purple-500 bg-purple-500/10 text-white'
                          : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                      }`}
                      onClick={()=>upd("currency",currency.id)}>
                      <div className="text-2xl font-bold">{currency.symbol}</div>
                      <div className="font-medium">{currency.label}</div>
                      <div className="text-sm opacity-70">{currency.id}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Mode */}
            {step===3 && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">How would you like to manage your finances?</label>
                <div className="space-y-4">
                  {[
                    { id: 'manual', label: 'Manual Entry', desc: 'Track expenses manually for full control' },
                    { id: 'fimcp', label: 'Fi-MCP Integration', desc: 'Automatic transaction sync via Fi-MCP' },
                    { id: 'hybrid', label: 'Hybrid Mode', desc: 'Both manual entry and Fi-MCP integration' }
                  ].map((mode) => (
                    <button key={mode.id}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        data.mode === mode.id
                          ? 'border-purple-500 bg-purple-500/10 text-white'
                          : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                      }`}
                      onClick={()=>upd("mode",mode.id)}>
                      <div className="font-medium">{mode.label}</div>
                      <div className="text-sm opacity-70">{mode.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Setup Details */}
            {step===4 && (
              <div className="space-y-6">
                {(data.mode !== "fimcp") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Initial Balance</label>
                      <input type="number"
                        className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none"
                        value={data.initialBalance}
                        onChange={e=>upd("initialBalance",e.target.value)}
                        placeholder="Enter amount"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Daily Spending Limit</label>
                      <input type="number"
                        className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none"
                        value={data.dailyLimit}
                        onChange={e=>upd("dailyLimit",e.target.value)}
                        placeholder="Enter limit"
                      />
                    </div>
                  </div>
                )}

                {(data.mode !== "manual") && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number for Fi-MCP</label>
                    <input type="tel"
                      className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none"
                      value={data.fimcpPhone}
                      onChange={e=>upd("fimcpPhone",e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Features */}
            {step===5 && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Select features you'd like to enable</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "AI Assistant","Voice entry","Forecasting","Budget calendar",
                    "Savings goals","ForeCoins","OCR receipts","Leaderboards"
                  ].map(f=>(
                    <label key={f} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700/70 cursor-pointer">
                      <input type="checkbox"
                        checked={data.features.includes(f)}
                        onChange={()=>{
                          const arr = data.features.includes(f)
                            ? data.features.filter(x=>x!==f)
                            : [...data.features,f];
                          upd("features",arr);
                        }}
                        className="w-4 h-4 text-purple-500 bg-slate-600 border-slate-500 rounded focus:ring-purple-500"
                      />
                      <span className="text-slate-300">{f}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Goals Decision */}
            {step===6 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Would you like to set savings goals now?</label>
                  <div className="flex gap-4">
                    {["Yes","No"].map(opt=>(
                      <button key={opt}
                        className={`px-6 py-3 rounded-lg transition-all ${
                          data.setGoalNow === (opt==="Yes")
                            ? 'bg-purple-500 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                        onClick={()=>upd("setGoalNow", opt==="Yes")}>
                        {opt === "Yes" ? "Yes, let&apos;s set goals" : "Maybe later"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Show goal form immediately when user clicks Yes */}
                {data.setGoalNow && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">Add your savings goals</label>
                    <GoalForm goals={data.goals} onChange={g=>upd("goals",g)} />
                  </div>
                )}
              </div>
            )}

            {/* Step 8: AI Assistant */}
            {step===8 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">AI Assistant Mode</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { id: 'voice_text', label: 'Voice & Text', desc: 'Full interaction' },
                      { id: 'text_only', label: 'Text Only', desc: 'Chat-based help' },
                      { id: 'none', label: 'Disabled', desc: 'No AI assistance' }
                    ].map((mode) => (
                      <button key={mode.id}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          data.assistantMode === mode.id
                            ? 'border-purple-500 bg-purple-500/10 text-white'
                            : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                        }`}
                        onClick={()=>upd("assistantMode",mode.id)}>
                        <div className="font-medium">{mode.label}</div>
                        <div className="text-sm opacity-70">{mode.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Assistant Personality</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {["friendly","professional","minimal"].map(t=>(
                      <button key={t}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          data.assistantTone === t
                            ? 'border-purple-500 bg-purple-500/10 text-white'
                            : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                        }`}
                        onClick={()=>upd("assistantTone",t)}>
                        <div className="font-medium capitalize">{t}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 9: Security & Accessibility */}
            {step===9 && (
              <div className="space-y-6">
                <div>
                  <label className="flex items-center space-x-3 p-4 rounded-lg bg-slate-700/50 hover:bg-slate-700/70 cursor-pointer">
                    <input type="checkbox"
                      checked={data.enable2FA}
                      onChange={e=>upd("enable2FA",e.target.checked)}
                      className="w-4 h-4 text-purple-500 bg-slate-600 border-slate-500 rounded focus:ring-purple-500"
                    />
                    <div>
                      <div className="text-white font-medium">Enable Two-Factor Authentication</div>
                      <div className="text-sm text-slate-400">Add an extra layer of security to your account</div>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Accessibility Options</label>
                  <div className="space-y-2">
                    {["colorblind","large_fonts","screen_reader"].map(a=>(
                      <label key={a} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700/70 cursor-pointer">
                        <input type="checkbox"
                          checked={data.accessibility.includes(a)}
                          onChange={()=>{
                            const arr = data.accessibility.includes(a)
                              ? data.accessibility.filter(x=>x!==a)
                              : [...data.accessibility,a];
                            upd("accessibility",arr);
                          }}
                          className="w-4 h-4 text-purple-500 bg-slate-600 border-slate-500 rounded focus:ring-purple-500"
                        />
                        <span className="text-white font-medium">{a.replace("_"," ")}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-700">
            <button
              onClick={prev}
              disabled={step === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                step === 1
                  ? 'text-slate-500 cursor-not-allowed'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {step < 8 ? (
              <button
                onClick={next}
                disabled={!canNext()}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                  canNext()
                    ? 'bg-purple-500 hover:bg-purple-600 text-white'
                    : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                }`}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={submit}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
              >
                <Check className="w-4 h-4" />
                Complete Setup
              </button>
            )}
          </div>
          {error && <p className="mt-2 text-red-500 text-center">{error}</p>}
        </div>
      </div>

      {/* Completion Animation Popup */}
      {showCompletion && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-2xl p-8 max-w-md w-full mx-4 text-center border border-purple-500/30 shadow-2xl">
            {/* Animated Party Popper */}
            <div className="mb-6 relative">
              <div className="text-8xl animate-bounce">🎉</div>
              <div className="absolute -top-2 -right-2 text-4xl animate-pulse">✨</div>
              <div className="absolute -bottom-2 -left-2 text-4xl animate-pulse">🎊</div>
              <div className="absolute top-4 right-4 text-2xl animate-bounce delay-100">🎈</div>
              <div className="absolute bottom-4 left-4 text-2xl animate-bounce delay-200">🎁</div>
            </div>
            
            {/* Success Message */}
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white mb-2">Woohoo! 🎊</h2>
              <p className="text-xl text-purple-200 font-semibold">Onboarding Complete!</p>
              <p className="text-purple-300">
                You&apos;re all set up and ready to take control of your finances!
              </p>
              
              {/* Countdown Text */}
              <div className="mt-6 text-center">
                <p className="text-lg text-white mb-2">
                  You will be redirected to dashboard in
                </p>
                <div className="text-6xl font-bold text-gradient bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent animate-pulse">
                  {countdown}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GoalForm({ goals, onChange }) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");

  const add = () => {
    if (!name || !target) return;
    onChange([...goals, { name, target: parseFloat(target) }]);
    setName(""); setTarget("");
  };

  const remove = (index) => {
    onChange(goals.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <input
          placeholder="Goal name (e.g., Vacation Fund)"
          className="flex-1 p-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none"
          value={name}
          onChange={e=>setName(e.target.value)}
        />
        <input
          placeholder="Target amount"
          type="number"
          className="w-32 p-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none"
          value={target}
          onChange={e=>setTarget(e.target.value)}
        />
        <button
          onClick={add}
          className="px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all"
        >
          Add
        </button>
      </div>

      {goals.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-300">Your Goals:</h4>
          {goals.map((goal, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div>
                <div className="font-medium text-white">{goal.name}</div>
                <div className="text-sm text-slate-400">Target: ₹{goal.target.toLocaleString()}</div>
              </div>
              <button
                onClick={() => remove(index)}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}