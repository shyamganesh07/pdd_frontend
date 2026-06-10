import React, { useState, useEffect, useRef } from 'react'
import { ShieldAlert, TrendingDown, Activity, Play, RotateCcw, Award, Brain, Target, AlertTriangle, ArrowLeft, Info, Search, X, Pause } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts'

// ── Large searchable asset list (aligned with Dashboard) ──
const ALL_ASSETS = [
  // US Stocks
  { label:'Apple (AAPL)',       value:'AAPL',        icon:'🍎', type:'stocks' },
  { label:'Microsoft (MSFT)',   value:'MSFT',        icon:'🪟', type:'stocks' },
  { label:'NVIDIA (NVDA)',      value:'NVDA',        icon:'💚', type:'stocks' },
  { label:'Tesla (TSLA)',       value:'TSLA',        icon:'⚡', type:'stocks' },
  { label:'Google (GOOGL)',     value:'GOOGL',       icon:'🔍', type:'stocks' },
  { label:'Amazon (AMZN)',      value:'AMZN',        icon:'📦', type:'stocks' },
  { label:'Meta (META)',        value:'META',        icon:'👤', type:'stocks' },
  { label:'Netflix (NFLX)',     value:'NFLX',        icon:'🎬', type:'stocks' },
  { label:'AMD (AMD)',          value:'AMD',         icon:'🔵', type:'stocks' },
  { label:'Intel (INTC)',       value:'INTC',        icon:'🔷', type:'stocks' },
  // Indian Stocks
  { label:'TCS (NSE)',          value:'TCS.NS',      icon:'🖥️', type:'stocks' },
  { label:'Reliance (NSE)',     value:'RELIANCE.NS', icon:'⛽', type:'stocks' },
  { label:'Infosys (NSE)',      value:'INFY.NS',     icon:'💻', type:'stocks' },
  { label:'HDFC Bank (NSE)',    value:'HDFCBANK.NS', icon:'🏦', type:'stocks' },
  { label:'ICICI Bank (NSE)',   value:'ICICIBANK.NS',icon:'🏛️', type:'stocks' },
  { label:'Wipro (NSE)',        value:'WIPRO.NS',    icon:'🔵', type:'stocks' },
  { label:'Tata Steel (NSE)',   value:'TATASTEEL.NS',icon:'🔩', type:'stocks' },
  // Commodities
  { label:'Gold',               value:'GC=F',        icon:'🥇', type:'commodities' },
  { label:'Silver',             value:'SI=F',        icon:'🥈', type:'commodities' },
  { label:'Crude Oil (WTI)',    value:'CL=F',        icon:'🛢️', type:'commodities' },
  { label:'Natural Gas',        value:'NG=F',        icon:'🔥', type:'commodities' },
  { label:'Copper',             value:'HG=F',        icon:'🔶', type:'commodities' },
  // Indices
  { label:'S&P 500',            value:'^GSPC',       icon:'🇺🇸', type:'indices' },
  { label:'NASDAQ',             value:'^IXIC',       icon:'💹', type:'indices' },
  { label:'Dow Jones',          value:'^DJI',        icon:'📈', type:'indices' },
  { label:'Nifty 50',           value:'^NSEI',       icon:'🇮🇳', type:'indices' },
  { label:'Bank Nifty',         value:'^NSEBANK',    icon:'🏦', type:'indices' },
]

const SCENARIOS = [
  { 
    id: 'black-swan', 
    name: 'Black Swan Survival', 
    desc: 'Survive a sudden -15% market crash without panicking.',
    difficulty: 'Hard',
    data: [100, 102, 101, 103, 102, 85, 82, 80, 81, 78, 75, 76, 74, 75, 78],
    crashIndex: 5,
    advice: 'In a crash, preservation of capital is key. Don\'t try to catch the falling knife immediately.'
  },
  { 
    id: 'revenge-trap', 
    name: 'The Revenge Trap', 
    desc: 'Recover from a stop-loss hit without increasing risk.',
    difficulty: 'Medium',
    data: [100, 95, 90, 85, 82, 83, 85, 84, 86, 88, 90, 92, 95, 98, 100],
    crashIndex: 3,
    advice: 'Revenge trading leads to total ruin. Stick to your position sizing rules even after a loss.'
  },
  { 
    id: 'fake-breakout', 
    name: 'Fake Breakout Maze', 
    desc: 'Identify the false move and avoid being trapped at the top.',
    difficulty: 'Expert',
    data: [100, 105, 110, 115, 125, 128, 130, 115, 110, 105, 108, 110, 105, 100, 95],
    crashIndex: 6,
    advice: 'Wait for a retest. Buying the peak of a parabolic move is the most common retail mistake.'
  }
]

const USD_TO_INR = 83.5

export default function SimulationLab({ user, onBack }) {
  const [activeScenario, setActiveScenario] = useState(null)
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [balance, setBalance] = useState(10000)
  const [usdToInrRate, setUsdToInrRate] = useState(83.5)
  const [persistentBalance, setPersistentBalance] = useState(() => {
    return parseFloat(localStorage.getItem('demo_balance') || '10000')
  })
  const [sessionStartBalance, setSessionStartBalance] = useState(10000)

  useEffect(() => {
    fetch('/api/simulation/exchange-rate')
      .then(res => res.json())
      .then(data => {
        if (data.rate) {
          setUsdToInrRate(data.rate)
        }
      })
      .catch(err => console.error('Failed to load exchange rate:', err))
  }, [])

  useEffect(() => {
    const email = user?.email || localStorage.getItem('userEmail') || ''
    if (email) {
      fetch(`/api/profile?email=${encodeURIComponent(email)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.balance !== undefined) {
            setPersistentBalance(data.balance)
            localStorage.setItem('demo_balance', data.balance.toString())
          }
        })
        .catch(err => console.error('Failed to load profile balance:', err))
    }
  }, [user?.email])

  const [scores, setScores] = useState({ discipline: 100, execution: 100, stability: 100 })
  const [messages, setMessages] = useState([])
  
  // Custom Selection States
  const [assetTab, setAssetTab] = useState('stocks')
  const [asset, setAsset] = useState(ALL_ASSETS[0])
  const [searchQ, setSearchQ] = useState('')
  const [customLoading, setCustomLoading] = useState(false)
  const [customStepText, setCustomStepText] = useState('')
  
  // Trading sizing & holding states
  const [positionSize, setPositionSize] = useState(0) // shares/units
  const [entryPrice, setEntryPrice] = useState(0)
  const [tradeSize, setTradeSize] = useState(1000)
  const [tradeCount, setTradeCount] = useState(0)

  // Infinite Price Feed state
  const [simPrices, setSimPrices] = useState([])
  const [simDates, setSimDates] = useState([])

  // Explicit Exit Modal
  const [showExitSummary, setShowExitSummary] = useState(false)

  const timerRef = useRef(null)
  const positionSizeRef = useRef(0)
  const entryPriceRef = useRef(0)

  const isINR = activeScenario
    ? (activeScenario.isCustom && (activeScenario.symbol?.endsWith('.NS') || activeScenario.symbol?.endsWith('.BO') || activeScenario.symbol === '^NSEI' || activeScenario.symbol === '^NSEBANK'))
    : (asset?.value?.endsWith('.NS') || asset?.value?.endsWith('.BO') || asset?.value === '^NSEI' || asset?.value === '^NSEBANK')
  const currency = isINR ? '₹' : '$'
  const tradePresets = isINR ? [10000, 50000, 100000, 200000] : [500, 1000, 2000, 5000]

  // Keep trade refs in sync to avoid stale closures in the timer interval
  useEffect(() => {
    positionSizeRef.current = positionSize
    entryPriceRef.current = entryPrice
  }, [positionSize, entryPrice])

  // Sync default trade sizes when asset changes
  useEffect(() => {
    setTradeSize(isINR ? 50000 : 1000)
  }, [asset, isINR])

  const startScenario = (sc) => {
    setActiveScenario(sc)
    
    if (sc.isCustom) {
      // Live Custom Feed: Start exactly at the current local time when the user enters
      const basePrice = sc.data[0] || 100
      const initialPrices = []
      const initialDates = []
      
      // Pre-populate with 10 ticks covering the last 10 seconds to give Recharts a clean initial local time series
      let runningPrice = basePrice
      for (let i = 0; i < 10; i++) {
        const d = new Date(Date.now() - (10 - i) * 1000)
        initialDates.push(d.toISOString())
        
        const change = (Math.random() - 0.5) * 0.0003
        runningPrice = runningPrice * (1 + change)
        initialPrices.push(runningPrice)
      }
      
      setSimPrices(initialPrices)
      setSimDates(initialDates)
      setStep(9)
    } else {
      // Standard training drill: Reveal path step-by-step from step 0
      setSimPrices(sc.data)
      const dates = []
      for (let i = 0; i < sc.data.length; i++) {
        const d = new Date()
        d.setMinutes(d.getMinutes() - (sc.data.length - i) * 5)
        dates.push(d.toISOString())
      }
      setSimDates(dates)
      setStep(0)
    }

    setIsPlaying(true)
    const currentBalUSD = parseFloat(localStorage.getItem('demo_balance') || '10000')
    const initialBal = isINR ? currentBalUSD * usdToInrRate : currentBalUSD
    setBalance(initialBal)
    setSessionStartBalance(initialBal)
    setPositionSize(0)
    setEntryPrice(0)
    setTradeCount(0)
    setShowExitSummary(false)
    setScores({ discipline: 100, execution: 100, stability: 100 })
    setMessages([{ type: 'info', text: `Simulation Started: ${sc.name}`, id: Date.now() }])
  }

  // Generate Custom Live Feed Simulation using the actual intraday chart of today
  const startLiveSimulation = async () => {
    setCustomLoading(true)
    setCustomStepText('Loading live intraday chart...')
    try {
      const res = await fetch(`/api/simulation/live-data?symbol=${encodeURIComponent(asset.value)}`)
      const data = await res.json()
      const pd = data?.data || []
      if (pd.length === 0) {
        alert('Could not fetch price data for this symbol. Try another asset.')
        setCustomLoading(false)
        return
      }

      const latestPrice = pd[pd.length - 1]?.price || 100

      const sc = {
        id: `live-${asset.value}`,
        name: `Demo Trade: ${asset.label}`,
        desc: `Intraday price action of ${asset.label} with real-time updates.`,
        difficulty: 'Live Feed',
        data: [latestPrice],
        isCustom: true,
        symbol: asset.value,
        advice: 'Calibrate your risk, analyze the live trends, and buy or sell strategically.'
      }
      
      startScenario(sc)
    } catch (e) {
      console.error(e)
      alert('Could not fetch live stock feed. Reverting to offline scenario drills.')
    } finally {
      setCustomLoading(false)
    }
  }

  // Dynamic simulation tick timer
  useEffect(() => {
    if (isPlaying && activeScenario) {
      timerRef.current = setInterval(() => {
        if (activeScenario.isCustom) {
          // Custom Live Feed: Generate new prices indefinitely every second
          setSimPrices(prevPrices => {
            const lastPrice = prevPrices[prevPrices.length - 1]
            
            // Apply a realistic second-by-second micro tick movement
            const volatility = 0.0005 
            const changePercent = (Math.random() - 0.495) * volatility // Slight positive drift
            const newPrice = lastPrice * (1 + changePercent)
            
            setSimDates(prevDates => {
              return [...prevDates, new Date().toISOString()]
            })

            return [...prevPrices, newPrice]
          })
          setStep(s => s + 1)
        } else {
          // Standard Scenario Drill: Just reveal the next pre-populated step
          setStep(s => {
            if (s >= activeScenario.data.length - 1) {
              setIsPlaying(false)
              clearInterval(timerRef.current)
              return s
            }
            return s + 1
          })
        }
      }, 1000) // Ticks every second for real-time fidelity
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [isPlaying, activeScenario])

  const handleAction = (type) => {
    const currentPrice = simPrices[step]

    if (type === 'BUY') {
      if (positionSize > 0) return
      if (tradeSize > balance) {
        addMessage('warning', 'Insufficient balance to execute trade.')
        return
      }
      
      const units = tradeSize / currentPrice
      setBalance(b => b - tradeSize)
      setPositionSize(units)
      setEntryPrice(currentPrice)
      setTradeCount(c => c + 1)
      addMessage('success', `Bought ${units.toFixed(3)} units at ${currency}${currentPrice.toFixed(2)} (Value: ${currency}${tradeSize.toLocaleString()})`)
      
      // Compute discipline impacts
      const recentTrendDown = step > 1 && simPrices[step] < simPrices[step-1] && simPrices[step-1] < simPrices[step-2]
      if (recentTrendDown) {
        setScores(s => ({ ...s, discipline: Math.max(0, s.discipline - 15) }))
        addMessage('warning', 'Discipline Alert: Entering position during a strong downward trend.')
      }
    } else if (type === 'SELL') {
      if (positionSize === 0) return
      
      const unitsHeld = positionSize
      const entryCost = unitsHeld * entryPrice
      const liquidationValue = unitsHeld * currentPrice
      const profit = liquidationValue - entryCost
      const profitPct = (profit / entryCost) * 100
      
      setBalance(b => b + liquidationValue)
      setPositionSize(0)
      setEntryPrice(0)
      
      const isProfit = profit >= 0
      addMessage(isProfit ? 'success' : 'warning', `Sold ${unitsHeld.toFixed(3)} units at ${currency}${currentPrice.toFixed(2)}. P&L: ${isProfit ? '+' : ''}${currency}${profit.toFixed(2)} (${isProfit ? '+' : ''}${profitPct.toFixed(1)}%)`)
      
      // Update execution and stability scores
      setScores(s => {
        const netPnLChange = isProfit ? Math.min(100, s.execution + 10) : Math.max(0, s.execution - 15)
        const stabilityChange = profitPct < -10 ? Math.max(0, s.stability - 20) : s.stability
        return { ...s, execution: netPnLChange, stability: stabilityChange }
      })

      if (profitPct < -10) {
        addMessage('warning', 'Risk Alert: Held position past standard stop-loss limits.')
      }
    }
  }

  const addMessage = (type, text) => {
    setMessages(prev => [{ type, text, id: Date.now() }, ...prev].slice(0, 6))
  }

  const endSession = async (finalBal) => {
    setIsPlaying(false)
    clearInterval(timerRef.current)
    
    // Save session to backend
    const finalPnL = finalBal - sessionStartBalance
    const finalBalanceUSD = isINR ? finalBal / usdToInrRate : finalBal
    
    localStorage.setItem('demo_balance', finalBalanceUSD.toString())
    setPersistentBalance(finalBalanceUSD)

    try {
      await fetch('/api/simulation/save-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: activeScenario.symbol || activeScenario.id,
          name: activeScenario.name,
          is_custom: !!activeScenario.isCustom,
          starting_balance: sessionStartBalance,
          ending_balance: finalBal,
          net_return: finalPnL,
          trade_count: tradeCount,
          scores: scores,
          email: user?.email || localStorage.getItem('userEmail') || ''
        })
      })
    } catch (err) {
      console.error('Failed to save simulation session:', err)
    }

    setShowExitSummary(true)
  }

  const triggerExplicitExit = async () => {
    setIsPlaying(false)
    clearInterval(timerRef.current)
    
    let finalBal = balance
    if (positionSize > 0) {
      const currentPrice = simPrices[step]
      const unitsHeld = positionSize
      const entryCost = unitsHeld * entryPrice
      const liquidationValue = unitsHeld * currentPrice
      const profit = liquidationValue - entryCost
      
      finalBal = balance + liquidationValue
      setBalance(finalBal)
      setPositionSize(0)
      setEntryPrice(0)
      addMessage('info', `Explicit Exit: Auto-liquidated open position at ${currency}${currentPrice.toFixed(2)}. P&L: ${currency}${profit.toFixed(2)}`)
    }

    await endSession(finalBal)
  }

  useEffect(() => {
    if (activeScenario && !activeScenario.isCustom && step >= activeScenario.data.length - 1 && isPlaying) {
      setIsPlaying(false)
      clearInterval(timerRef.current)
      
      let finalBal = balance
      if (positionSize > 0) {
        const finalPrice = activeScenario.data[activeScenario.data.length - 1]
        const finalVal = positionSize * finalPrice
        const profit = finalVal - (entryPrice * positionSize)
        finalBal = balance + finalVal
        setBalance(finalBal)
        setPositionSize(0)
        setEntryPrice(0)
        addMessage(profit >= 0 ? 'success' : 'warning', `Drill Ended: Auto-liquidated position at ${currency}${finalPrice.toFixed(2)}. P&L: ${currency}${profit.toFixed(2)}`)
      }
      
      endSession(finalBal)
    }
  }, [step, activeScenario, isPlaying])

  // Filter searchable assets list
  const filteredAssets = ALL_ASSETS.filter(a => 
    a.type === assetTab && 
    (a.label.toLowerCase().includes(searchQ.toLowerCase()) || a.value.toLowerCase().includes(searchQ.toLowerCase()))
  )

  // 1. SELECTOR / PRE-SIMULATION VIEW
  if (!activeScenario) {
    const formattedBalance = isINR ? (persistentBalance * usdToInrRate).toLocaleString(undefined, {maximumFractionDigits:2}) : persistentBalance.toLocaleString(undefined, {maximumFractionDigits:2})
    return (
      <div className="fade-in slide-up p-6">
        <div className="flex items-center gap-4 mb-8">
           <button onClick={onBack} className="back-btn"><ArrowLeft size={20}/></button>
           <div>
             <h1 className="text-2xl font-bold font-grotesk text-white">Neural Simulation Lab</h1>
             <p className="text-xs text-text-dim mt-1">Practice trading strategies using live feeds and educational market scenarios</p>
           </div>
        </div>

        {/* Demo Capital Card */}
        <div className="card bg-slate-900/60 border border-white/10 p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-neon-green/10 border border-neon-green/30 flex items-center justify-center text-neon-green">
              <Award size={24} />
            </div>
            <div>
              <div className="text-[10px] text-text-dim uppercase tracking-wider font-bold">Demo Account Balance</div>
              <div className="text-2xl font-bold font-grotesk text-neon-green">{currency}{formattedBalance}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-xs text-text-dim leading-relaxed max-w-[280px]">
               Virtual trade parameters scale automatically between **USD ($)** and **INR (₹)** based on your selected asset.
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Asset Selector Form */}
          <div className="card lg:col-span-2 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold font-grotesk uppercase tracking-wider text-white">Select Live Feed Asset</h3>
                <span className="text-[10px] bg-neon-blue/15 border border-neon-blue/30 text-neon-blue font-bold px-2 py-0.5 rounded uppercase">Live Data</span>
              </div>

              {/* Asset Class Tabs */}
              <div className="type-toggle mb-6">
                 {['stocks', 'commodities', 'indices'].map(t => (
                   <button 
                     key={t} 
                     className={`type-btn ${assetTab === t ? 'active' : ''}`} 
                     onClick={() => {
                       setAssetTab(t)
                       const firstOfType = ALL_ASSETS.find(a => a.type === t)
                       if (firstOfType) setAsset(firstOfType)
                     }}
                   >
                     {t}
                   </button>
                 ))}
              </div>

              {/* Asset Search */}
              <div style={{ position:'relative', marginBottom:20 }}>
                 <Search size={16} style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color:'#94A3B8' }} />
                 <input 
                   type="text" 
                   placeholder="Search assets by symbol or name..." 
                   value={searchQ} 
                   onChange={e => setSearchQ(e.target.value)} 
                   className="search-input" 
                 />
              </div>

              <div className="label-text mb-2">Available Instruments</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1 mb-8">
                 {filteredAssets.map(a => (
                   <div 
                     key={a.value} 
                     onClick={() => setAsset(a)}
                     className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition-all ${asset?.value === a.value ? 'bg-neon-blue/10 border-neon-blue/40 text-white font-bold' : 'bg-card2 border-border text-text-dim hover:bg-white/5 hover:text-white'}`}
                   >
                     <span className="flex items-center gap-2">
                       <span>{a.icon}</span>
                       <span>{a.label}</span>
                     </span>
                     <span className="font-mono text-[9px] uppercase opacity-75">{a.value}</span>
                   </div>
                 ))}
                 {filteredAssets.length === 0 && (
                   <div className="col-span-2 py-8 text-center text-text-dim italic text-xs">No matching assets found.</div>
                 )}
              </div>
            </div>

            <button 
              onClick={startLiveSimulation} 
              disabled={customLoading || !asset} 
              className="btn-generate w-full"
            >
               {customLoading ? customStepText : `ENTER SIMULATION: ${asset?.label || 'Select Asset'}`}
            </button>
          </div>

          {/* Standard Scenario Drills */}
          <div className="flex flex-col gap-4">
             <div className="text-xs font-bold uppercase tracking-wider text-text-dim flex items-center gap-2">
               <ShieldAlert size={14} /> Training Drill Packages
             </div>
             {SCENARIOS.map(sc => (
               <div key={sc.id} className="card p-4 hover:translate-y-[-2px] transition-all cursor-pointer border-l-4"
                    style={{ borderLeftColor: sc.difficulty === 'Hard' ? 'var(--neon-red)' : sc.difficulty === 'Expert' ? 'var(--neon-purple)' : 'var(--neon-blue)' }}
                    onClick={() => startScenario(sc)}>
                 <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-sm font-grotesk text-white">{sc.name}</h4>
                    <span className="text-[8px] border border-white/10 px-2 py-0.5 rounded font-bold uppercase tracking-widest text-text-dim">{sc.difficulty}</span>
                 </div>
                 <p className="text-[11px] text-text-dim leading-relaxed mb-3">{sc.desc}</p>
                 <div className="text-[10px] text-neon-blue font-bold flex items-center gap-1">
                   Launch Training <ArrowLeft size={10} className="rotate-180" />
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    )
  }

  // 2. ACTIVE SIMULATION VIEW
  const currentPrice = simPrices[step] || 100
  const initialPrice = simPrices[0] || 100
  const pctChange = ((currentPrice - initialPrice) / initialPrice) * 100
  const isPriceUp = currentPrice >= initialPrice
  
  // Calculate dynamic P&L
  const hasPosition = positionSize > 0
  const currentCost = positionSize * entryPrice
  const currentValue = positionSize * currentPrice
  const unrealizedPnL = currentValue - currentCost
  const unrealizedPnLPct = entryPrice > 0 ? (unrealizedPnL / currentCost) * 100 : 0
  
  // Format chart data
  const chartData = (activeScenario?.isCustom)
    // Live Feed mode: show accumulated intraday prices to represent the live trend
    ? simPrices.slice(0, step + 1).map((v, i) => {
        const rawDate = simDates[i]
        const dateLabel = rawDate
          ? new Date(rawDate).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          : `Tick ${i + 1}`;
        return { name: dateLabel, price: v };
      })
    // Drill mode: show only the elements revealed step-by-step
    : simPrices.slice(0, step + 1).map((v, i) => {
        return { name: `Step ${i + 1}`, price: v };
      })

  const visibleChartData = activeScenario?.isCustom ? chartData.slice(-80) : chartData

  return (
    <div className="fade-in slide-up flex flex-col min-h-full overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Simulation Top Bar */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between backdrop-blur-xl" style={{ backgroundColor: 'rgba(13, 17, 28, 0.8)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center text-neon-blue">
            <Activity size={20} />
          </div>
          <div>
            <div className="text-sm font-bold font-grotesk text-white">{activeScenario.name}</div>
            <div className="text-[10px] text-text-dim flex items-center gap-2">
              <span className="live-dot font-semibold text-neon-blue animate-pulse" /> LIVE SIMULATOR FEED (RUNNING)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsPlaying(!isPlaying)} 
            className={`p-2 rounded-lg border transition-all ${isPlaying ? 'bg-neon-blue/10 border-neon-blue/30 text-neon-blue' : 'bg-white/5 border-white/10 text-white'}`}
            title={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
          </button>

          <div className="text-right">
             <div className="text-[10px] text-text-dim font-bold uppercase">Balance</div>
             <div className="text-sm font-bold font-grotesk text-neon-green">{currency}{balance.toLocaleString(undefined, {maximumFractionDigits:2})}</div>
          </div>

          <button onClick={triggerExplicitExit} className="p-2 bg-neon-red/10 border border-neon-red/30 rounded-lg text-neon-red hover:bg-neon-red/20 font-bold text-xs uppercase px-4 py-2" title="Exit Simulation">
            Exit Session
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
        {/* Behavioral Metrics Grid */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Discipline', val: scores.discipline, icon: <Target size={14}/>, color: 'var(--neon-blue)' },
            { label: 'Execution', val: scores.execution, icon: <Activity size={14}/>, color: 'var(--neon-green)' },
            { label: 'Stability', val: scores.stability, icon: <Brain size={14}/>, color: 'var(--neon-purple)' }
          ].map(s => (
            <div key={s.label} className="card p-3 flex flex-col items-center gap-1">
              <div style={{ color: s.color }}>{s.icon}</div>
              <div className="text-[10px] text-text-dim uppercase font-bold">{s.label}</div>
              <div className="text-lg font-bold font-grotesk text-white">{s.val}</div>
            </div>
          ))}
        </div>

        {/* Live Simulator View & Chart */}
        <div className="card flex-1 flex flex-col relative overflow-hidden p-6 bg-slate-900/40">
           <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-2xl font-bold font-grotesk text-white">{currency}{currentPrice.toFixed(2)}</div>
                <div className={`text-xs font-bold flex items-center gap-1 ${isPriceUp ? 'text-green-500' : 'text-red-500'}`}>
                  {isPriceUp ? '▲' : '▼'}{Math.abs(pctChange).toFixed(2)}% <span className="text-text-dim font-normal">(from start)</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-white">{activeScenario.isCustom ? 'Intraday Trend' : `Step ${step+1}`}</div>
                <div className="text-[10px] text-text-dim">{activeScenario.isCustom ? '1-Day Live Chart' : 'Scenario progression'}</div>
              </div>
           </div>

           {/* Fixed Height Container to prevent Recharts height=0 rendering bug */}
           <div className="mb-6" style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visibleChartData}>
                  <defs>
                    <linearGradient id="simChartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isPriceUp ? 'var(--neon-green)' : 'var(--neon-red)'} stopOpacity={0.15}/>
                      <stop offset="95%" stopColor={isPriceUp ? 'var(--neon-green)' : 'var(--neon-red)'} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="var(--text-dim)" 
                    fontSize={9} 
                    tickLine={false} 
                    axisLine={false} 
                    minTickGap={45} 
                  />
                  <YAxis stroke="var(--text-dim)" fontSize={9} domain={['auto', 'auto']} tickLine={false} axisLine={false} tickFormatter={(v) => `${currency}${v.toFixed(0)}`} />
                  <Tooltip 
                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }}
                    formatter={(v) => [`${currency}${v.toFixed(2)}`, 'Price']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke={isPriceUp ? 'var(--neon-green)' : 'var(--neon-red)'} 
                    fillOpacity={1} 
                    fill="url(#simChartGrad)" 
                    strokeWidth={2} 
                  />
                  {hasPosition && entryPrice > 0 && (
                    <ReferenceLine 
                      y={entryPrice} 
                      stroke="var(--neon-green)" 
                      strokeDasharray="4 4" 
                      strokeWidth={1.5}
                      label={{ value: `Entry (${currency}${entryPrice.toFixed(2)})`, fill: 'var(--neon-green)', position: 'insideBottomLeft', fontSize: 9, fontWeight: 700 }}
                    />
                  )}
                  {hasPosition && entryPrice > 0 && (
                    <ReferenceLine 
                      y={entryPrice * 0.97} 
                      stroke="var(--neon-red)" 
                      strokeDasharray="4 4" 
                      strokeWidth={1.5}
                      label={{ value: `Stop Loss (${currency}${(entryPrice * 0.97).toFixed(2)})`, fill: 'var(--neon-red)', position: 'insideBottomLeft', fontSize: 9, fontWeight: 700 }}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
           </div>

           {/* Trade Sizing Selection */}
           <div className="flex flex-wrap items-center justify-between gap-4 mb-4 p-3 bg-white/5 border border-white/5 rounded-xl">
             <div className="flex items-center gap-2">
               <span className="text-[10px] uppercase font-bold text-text-dim">Allocated Trade Size:</span>
               <span className="text-xs font-bold text-white">{currency}{tradeSize.toLocaleString()}</span>
             </div>
             <div className="flex gap-1.5">
               {tradePresets.map(preset => (
                 <button 
                   key={preset}
                   onClick={() => setTradeSize(preset)}
                   disabled={hasPosition}
                   className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${tradeSize === preset ? 'bg-neon-blue text-white' : 'bg-card2 text-text-dim border border-border hover:bg-white/5'}`}
                 >
                   {currency}{preset >= 1000 ? `${(preset / 1000).toFixed(0)}k` : preset}
                 </button>
               ))}
             </div>
           </div>

           {/* Execution Buttons */}
           <div className="flex gap-4">
              <button 
                onClick={() => handleAction('BUY')}
                disabled={hasPosition}
                className={`flex-1 py-4 rounded-2xl font-bold font-grotesk flex items-center justify-center gap-2 transition-all ${hasPosition ? 'bg-white/5 text-text-dim cursor-not-allowed' : 'bg-neon-green/10 text-neon-green border border-neon-green/30 hover:bg-neon-green/20'}`}
              >
                <TrendingDown size={20} className="rotate-180" /> BUY POSITION
              </button>
              <button 
                onClick={() => handleAction('SELL')}
                disabled={!hasPosition}
                className={`flex-1 py-4 rounded-2xl font-bold font-grotesk flex items-center justify-center gap-2 transition-all ${!hasPosition ? 'bg-white/5 text-text-dim cursor-not-allowed' : 'bg-neon-red/10 text-neon-red border border-neon-red/30 hover:bg-neon-red/20'}`}
              >
                <TrendingDown size={20} /> 
                {hasPosition ? `SELL POSITION (${unrealizedPnL >= 0 ? '+' : ''}${unrealizedPnLPct.toFixed(1)}%)` : 'SELL POSITION'}
              </button>
           </div>
        </div>

        {/* Live Holdings Info Card */}
        {hasPosition && (
          <div className="card p-4 border border-neon-blue/20 bg-neon-blue/5 grid grid-cols-3 gap-4 text-center animate-slide-in">
             <div>
               <div className="text-[10px] text-text-dim uppercase mb-0.5">Entry Price</div>
               <div className="font-bold text-sm text-white">{currency}{entryPrice.toFixed(2)}</div>
             </div>
             <div>
               <div className="text-[10px] text-text-dim uppercase mb-0.5">Current Value</div>
               <div className="font-bold text-sm text-white">{currency}{currentValue.toFixed(2)}</div>
             </div>
             <div>
               <div className="text-[10px] text-text-dim uppercase mb-0.5">Unrealized P&L</div>
               <div className={`font-bold text-sm ${unrealizedPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                 {unrealizedPnL >= 0 ? '+' : ''}{currency}{unrealizedPnL.toFixed(2)} ({unrealizedPnL >= 0 ? '+' : ''}{unrealizedPnLPct.toFixed(1)}%)
               </div>
             </div>
          </div>
        )}

        {/* Neural Log Activity */}
        <div className="card p-4 space-y-3">
          <div className="text-[10px] text-text-dim uppercase font-bold mb-2 flex items-center gap-2">
            <Brain size={14} className="text-neon-purple" /> Neural Event Log
          </div>
          <div className="space-y-2">
            {messages.length === 0 && <div className="text-xs text-text-dim">Waiting for market activity...</div>}
            {messages.map(m => (
              <div key={m.id} className={`p-3 rounded-xl border text-xs flex items-center gap-3 animate-slide-in ${
                m.type === 'warning' ? 'bg-red-500/5 border-red-500/20 text-red-400' : 
                m.type === 'success' ? 'bg-green-500/5 border-green-500/20 text-green-400' :
                'bg-white/5 border-white/10 text-text-dim'
              }`}>
                {m.type === 'warning' ? <AlertTriangle size={14}/> : <Info size={14}/>}
                {m.text}
              </div>
            ))}
          </div>
        </div>

        {/* Performance Explicit Exit Modal Summary Window */}
        {showExitSummary && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="card max-w-md w-full p-8 border border-neon-blue/30 bg-slate-950 text-center animate-bounce-in">
               <Award size={54} className="mx-auto text-neon-blue mb-4 animate-pulse" />
               <h2 className="text-2xl font-bold font-grotesk mb-2 text-white">Session Complete</h2>
               <p className="text-xs text-text-dim mb-6">Explicit exit triggered. Remaining positions liquidated.</p>
               
               <div className="space-y-3 p-4 bg-white/5 rounded-xl border border-white/5 text-left mb-6">
                 <div className="flex justify-between text-xs">
                   <span className="text-text-dim">Total Trades Executed:</span>
                   <span className="font-bold text-white">{tradeCount}</span>
                 </div>
                 <div className="flex justify-between text-xs border-t border-white/5 pt-2">
                   <span className="text-text-dim">Starting Balance:</span>
                   <span className="font-bold text-white">{currency}{sessionStartBalance.toLocaleString(undefined, {maximumFractionDigits:2})}</span>
                 </div>
                 <div className="flex justify-between text-xs border-t border-white/5 pt-2">
                   <span className="text-text-dim">Ending Balance:</span>
                   <span className="font-bold text-neon-green">{currency}{balance.toLocaleString(undefined, {maximumFractionDigits:2})}</span>
                 </div>
                 <div className="flex justify-between text-xs border-t border-white/5 pt-2">
                   <span className="text-text-dim">Net Session return:</span>
                   <span className={`font-bold ${balance - sessionStartBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                     {balance - sessionStartBalance >= 0 ? '+' : ''}{currency}{(balance - sessionStartBalance).toLocaleString(undefined, {maximumFractionDigits:2})}
                   </span>
                 </div>
               </div>

               <div className="text-sm text-text-dim mb-6 space-y-2">
                 <div>
                   Your Behavioral Performance Score: <strong className="text-white font-grotesk">{Math.round((scores.discipline + scores.execution + scores.stability) / 3)}%</strong>
                 </div>
                 <div className="text-[10px] flex justify-center gap-4 text-text-dim border-t border-white/5 pt-2">
                   <span>Discipline: <strong className="text-white">{scores.discipline}%</strong></span>
                   <span>Execution: <strong className="text-white">{scores.execution}%</strong></span>
                   <span>Stability: <strong className="text-white">{scores.stability}%</strong></span>
                 </div>
               </div>
               
               <button 
                 onClick={() => {
                   setActiveScenario(null)
                   setShowExitSummary(false)
                 }} 
                 className="btn-generate w-full uppercase text-xs tracking-wider"
               >
                 Return to Lab
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
