import React, { useState, useEffect, useRef } from 'react'
import { Zap, TrendingUp, AlertTriangle, RefreshCw, Search, X, Radar, Activity, ShieldCheck, Cpu, Info } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts'

// ── Large searchable asset list ──
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

const TABS = ['stocks','commodities','indices']
const STEPS = [
  'Fetching Neural Market Data...',
  'Scanning Institutional Volatility...',
  'Computing Statistical Drift...',
  'Running Probability Density Models...',
  'Generating AI Decision Support...',
]

function StatCard({ title, value, change, icon: Icon, color, infoText }) {
  const [showInfo, setShowInfo] = useState(false)
  const touchHandled = useRef(false)

  const handleToggle = (e) => {
    e.stopPropagation()
    if (e.type === 'touchstart' || e.type === 'touchend') {
      touchHandled.current = true
      setShowInfo(prev => !prev)
      setTimeout(() => { touchHandled.current = false }, 500)
    } else if (e.type === 'click') {
      if (touchHandled.current) return
      setShowInfo(prev => !prev)
    }
  }

  return (
    <div 
      className="stat-card-premium cursor-pointer" 
      onClick={handleToggle}
      onTouchEnd={handleToggle}
      style={{ touchAction: 'manipulation' }}
    >
      <div style={{ opacity: showInfo ? 0.05 : 1, transition: 'opacity 0.2s', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <span style={{ fontSize:'0.7rem', color:'var(--text-dim)', fontWeight:700, textTransform:'uppercase', letterSpacing:1 }}>{title}</span>
            <Info size={11} className="text-text-dim/60 hover:text-white transition-colors" />
          </div>
          <div style={{ fontSize:'1.6rem', fontWeight:700, fontFamily:'Space Grotesk' }}>{value}</div>
          {change && (
            <div style={{ fontSize:'0.8rem', color: change.includes('+') || parseFloat(change) > 50 ? 'var(--green)' : 'var(--red)', marginTop:4, fontWeight:600 }}>
              {change}
            </div>
          )}
        </div>
        <div className="stat-card-icon-wrap" style={{ background: color ? `${color}11` : 'rgba(57, 255, 20, 0.1)', color: color || 'var(--neon-green)' }}>
          <Icon size={18} />
        </div>
      </div>
      {showInfo && infoText && (
        <div 
          className="absolute inset-0 p-4 flex flex-col justify-between bg-black/95 backdrop-blur-md fade-in"
          style={{ zIndex: 10 }}
        >
          <div className="space-y-2">
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: color || 'var(--neon-green)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{title} Guide</span>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Tap to close</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text)', lineHeight: 1.35 }}>
              <strong>What:</strong> {infoText.what}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', lineHeight: 1.35 }}>
              <strong>Calculation:</strong> {infoText.calc}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AnomalyDetector({ anomalies }) {
  return (
    <div className="card mb-6">
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
        <Radar size={16} style={{ color:'#8B5CF6' }} />
        <span style={{ fontWeight:700, fontSize:'0.85rem', fontFamily:'Space Grotesk', textTransform:'uppercase', letterSpacing:1 }}>Anomalies Detected</span>
        {anomalies.length > 0 && (
          <span style={{ marginLeft:'auto', fontSize:'0.65rem', fontWeight:700, background:'rgba(239,68,68,0.15)', color:'#EF4444', border:'1px solid rgba(239,68,68,0.3)', borderRadius:4, padding:'2px 7px' }}>
            {anomalies.length} LIVE
          </span>
        )}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {anomalies.length > 0 ? anomalies.map((a, i) => (
          <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:'10px 12px' }}>
            <span style={{ fontSize:'1.1rem', lineHeight:1.4 }}>{a.icon || '📊'}</span>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}>
                <span style={{ fontWeight:700, fontSize:'0.82rem', fontFamily:'Space Grotesk' }}>{a.asset}</span>
                <span style={{
                  fontSize:'0.6rem', fontWeight:700, padding:'1px 6px', borderRadius:4,
                  background: a.severity === 'high' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                  color: a.severity === 'high' ? '#EF4444' : '#F59E0B',
                  border: `1px solid ${a.severity === 'high' ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}`,
                  textTransform:'uppercase'
                }}>
                  {a.severity}
                </span>
              </div>
              <div style={{ fontSize:'0.75rem', color:'var(--text-dim)', fontWeight:600 }}>{a.type}</div>
              <div style={{ fontSize:'0.65rem', color:'#4B5563', marginTop:2 }}>{a.time_ago}</div>
            </div>
          </div>
        )) : (
          <div style={{ textAlign:'center', padding:'20px 0', color:'var(--text-dim)', fontSize:'0.8rem' }}>
            <div style={{ marginBottom:6 }}>🔍</div>
            Scanning for neural anomalies...
          </div>
        )}
      </div>
    </div>
  )
}


function ScanRow({ item, idx, onSelect }) {
  const isUp = item.change_pct >= 0
  return (
    <div onClick={() => onSelect(item)} className="card2 p-3 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-all mb-2 rounded-xl border border-border">
      <div className="flex items-center gap-3">
        <span className="text-xl">{item.icon}</span>
        <div>
          <div className="font-bold text-sm">{item.name}</div>
          <div className={`text-[10px] ${isUp ? 'text-green-500' : 'text-red-500'}`}>
            {isUp ? '▲' : '▼'}{!isNaN(Number(item.change_pct)) ? Math.abs(Number(item.change_pct)).toFixed(2) : '0.00'}%
          </div>
        </div>
      </div>
      <div className="text-right">
        <div style={{ color: item.signal_color, fontWeight: 700, fontSize: '0.75rem' }}>{item.signal}</div>
        <div className="text-[9px] text-text-dim">Prob: {item.t1_prob}%</div>
      </div>
    </div>
  )
}

function EmotionalHealth({ stats }) {
  const metrics = [
    { label: 'Discipline', val: stats?.discipline_score || 92, color: '#10B981' },
    { label: 'Patience',   val: stats?.patience_score  || 78, color: '#3B82F6' },
    { label: 'Confidence', val: stats?.edge_ratio       || 85, color: '#8B5CF6' },
    { label: 'Control',    val: stats?.risk_calibration || 88, color: '#F59E0B' },
  ]
  return (
    <div className="card mb-6">
      <div style={{ fontWeight:700, fontSize:'0.85rem', marginBottom:16, fontFamily:'Space Grotesk', textTransform:'uppercase', letterSpacing:1 }}>Emotional Health</div>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {metrics.map(m => (
          <div key={m.label}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.78rem', marginBottom:6, fontWeight:600 }}>
              <span>{m.label}</span>
              <span style={{ color: m.color, fontFamily:'Space Grotesk', fontWeight:700 }}>{Math.round(m.val)}%</span>
            </div>
            <div style={{ height:6, background:'rgba(255,255,255,0.05)', borderRadius:999, overflow:'hidden' }}>
              <div style={{ width: `${Math.round(m.val)}%`, background: m.color, height:'100%', borderRadius:999, transition:'width 1s ease' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LearningFusion({ market }) {
  return (
    <div className="card" style={{ background: 'rgba(59,130,246,0.05)', borderColor: 'rgba(59,130,246,0.2)' }}>
      <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
        <div style={{ fontSize:'1.2rem' }}>🎓</div>
        <div>
          <div style={{ fontWeight:700, fontSize:'0.9rem', color:'#3B82F6', marginBottom:4 }}>Learning Fusion</div>
          <div style={{ fontSize:'0.75rem', color:'var(--text-dim)', lineHeight:1.5 }}>
            {market ? `Contextual analysis for ${market.symbol} is ready in the Academy.` : "Select an asset to unlock institutional briefings."}
          </div>
        </div>
      </div>
    </div>
  )
}

const DEFAULT_SCANS = [
  { symbol: "AAPL", name: "Apple (AAPL)", type: "stocks", change_pct: 1.45, signal: "Strong Buy", signal_color: "#22C55E", t1_prob: 74, icon: "🍎" },
  { symbol: "TSLA", name: "Tesla (TSLA)", type: "stocks", change_pct: -2.10, signal: "Buy", signal_color: "#86EFAC", t1_prob: 62, icon: "⚡" },
  { symbol: "GC=F", name: "Gold", type: "commodities", change_pct: 0.85, signal: "Neutral", signal_color: "#94A3B8", t1_prob: 51, icon: "🥇" },
  { symbol: "^GSPC", name: "S&P 500", type: "indices", change_pct: 0.32, signal: "Strong Buy", signal_color: "#22C55E", t1_prob: 78, icon: "🇺🇸" },
  { symbol: "NVDA", name: "NVIDIA (NVDA)", type: "stocks", change_pct: 3.40, signal: "Strong Buy", signal_color: "#22C55E", t1_prob: 81, icon: "💚" }
];

export default function Dashboard({ isOnline, onResult }) {
  const [assetTab,  setAssetTab]  = useState('stocks')
  const [asset,     setAsset]     = useState(ALL_ASSETS[0])
  const [searchQ,   setSearchQ]   = useState('')
  const [loading,   setLoading]   = useState(false)
  const [stepText,  setStepText]  = useState('')
  const [market,    setMarket]    = useState(() => {
    try { return JSON.parse(localStorage.getItem('last_trade') || 'null') } catch { return null }
  })
  const [scanData,  setScanData]    = useState(DEFAULT_SCANS)
  const [scanLoading,setScanLoading]= useState(false)
  const [anomalies,  setAnomalies]  = useState([])
  const [stats,     setStats]     = useState({ analysis_count: 0, edge_ratio: 0, discipline_score: 0, risk_calibration: 0 })
  const timerRef = useRef(null)

  useEffect(() => {
    if (isOnline) {
      runScan()
      fetchStats()
      const interval = setInterval(fetchAnomalies, 5000)
      return () => clearInterval(interval)
    }
  }, [isOnline])

  const fetchStats = async () => {
    try {
      const userProfile = JSON.parse(localStorage.getItem('user_profile') || '{}')
      const email = userProfile?.email || ''
      const res = await fetch(`/api/account-stats?email=${encodeURIComponent(email)}`)
      if (res.ok) setStats(await res.json())
    } catch {}
  }

  const fetchAnomalies = async () => {
    try {
      const res = await fetch('/api/anomaly-stream')
      if (res.ok) setAnomalies(await res.json())
    } catch {}
  }

  const runScan = async () => {
    setScanLoading(true)
    try {
      const res = await fetch('/api/scan?limit=10')
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          setScanData(data)
        }
      }
    } catch {}
    finally { setScanLoading(false) }
  }

  const generate = async (sym, type) => {
    let targetSym = sym
    if (!targetSym) {
      if (searchQ && searchQ.trim()) {
        const query = searchQ.trim().toLowerCase()
        const matched = ALL_ASSETS.find(a => 
          a.value.toLowerCase() === query || 
          a.label.toLowerCase() === query || 
          a.label.toLowerCase().includes(query)
        )
        targetSym = matched ? matched.value : searchQ.trim().toUpperCase()
      } else {
        targetSym = asset ? asset.value : 'AAPL'
      }
    }
    const matchedAsset = ALL_ASSETS.find(a => a.value.toUpperCase() === targetSym.toUpperCase())
    const targetType = type || (matchedAsset ? matchedAsset.type : assetTab)
    if (!isOnline) return alert('Offline.')
    setLoading(true)
    let i = 0
    timerRef.current = setInterval(() => {
      if (i < STEPS.length) setStepText(STEPS[i++])
      else clearInterval(timerRef.current)
    }, 600)
    try {
      const userProfile = JSON.parse(localStorage.getItem('user_profile') || '{}')
      const email = userProfile?.email || ''
      const res = await fetch('/api/analyze', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ asset_type: targetType, symbol: targetSym, email: email }),
      })
      if (res.ok) {
        const data = await res.json()
        setMarket(data); onResult(data)
        if (window.safeSetLocalStorage) {
          window.safeSetLocalStorage('last_trade', JSON.stringify(data))
        } else {
          try { localStorage.setItem('last_trade', JSON.stringify(data)) } catch (e) {}
        }
        fetchStats()
      } else {
        const errText = await res.text()
        console.error("[Dashboard] Generate response not OK:", res.status, errText)
        alert(`Analysis failed (Status ${res.status}): ${errText || 'Unknown error'}`)
      }
    } catch (err) {
      console.error("[Dashboard] Generate Exception:", err)
      alert("Analysis failed with error: " + err.message)
    }
    finally { clearInterval(timerRef.current); setLoading(false) }
  }

  const tabAssets = ALL_ASSETS.filter(a => 
    a.type === assetTab && 
    (!searchQ || 
     a.label.toLowerCase().includes(searchQ.toLowerCase()) || 
     a.value.toLowerCase().includes(searchQ.toLowerCase()))
  )

  useEffect(() => {
    if (tabAssets.length > 0) {
      const isAssetInTab = tabAssets.some(a => a.value === (asset?.value))
      if (!isAssetInTab) {
        setAsset(tabAssets[0])
      }
    }
  }, [assetTab, searchQ])
  
  const pd    = market?.price_data || []
  const latest= pd.length ? pd[pd.length-1]?.close : null
  const prev  = pd.length > 1 ? pd[pd.length-2]?.close : null
  const diff  = latest && prev ? latest - prev : 0
  const pct   = prev ? (diff/prev)*100 : 0
  const isUp  = diff >= 0
  const chartD = pd.slice(-20).map((d,i) => ({ i, v: d.close }))

  return (
    <div style={{ paddingTop: '20px' }}>
      {/* ── TOP ANALYSIS METRICS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 slide-up">
        <StatCard 
          title="Analytic Reach" 
          value={stats.analysis_count} 
          change="Total Scans" 
          icon={Activity} 
          color="var(--neon-blue)" 
          infoText={{
            what: "Total volume of unique asset setups and scans evaluated by you.",
            calc: "Increments with each neural analyzer run and market scan."
          }}
        />
        <StatCard 
          title="Edge Reliability" 
          value={`${stats.edge_ratio}%`} 
          change="Success Rate" 
          icon={ShieldCheck} 
          color="var(--neon-green)" 
          infoText={{
            what: "Success rate of simulated trades that successfully hit target prices.",
            calc: "Ratio of profitable simulation sessions relative to total completed sessions."
          }}
        />
        <StatCard 
          title="Risk Calibration" 
          value={`${(Number(stats?.risk_calibration) || 0).toFixed(0)}%`} 
          change="Institutional Alignment" 
          icon={Cpu} 
          color="var(--neon-orange)" 
          infoText={{
            what: "Adherence to optimal position sizing and safety rules.",
            calc: "Evaluated based on stop-loss usage, risk-to-reward ratio, and drawdown limits."
          }}
        />
        <StatCard 
          title="Neural Fidelity" 
          value={`${market?.ai_score || stats.discipline_score || 92}%`} 
          change="AI Confidence" 
          icon={Radar} 
          color="var(--neon-purple)" 
          infoText={{
            what: "Confidence score of the deep neural models for the active asset.",
            calc: "Formulated via backtesting convergence, regime modeling, and drift validation."
          }}
        />
      </div>

      <div className="dashboard-grid-3">
        {/* ── COLUMN 1: SCANNER & ANOMALIES ── */}
        <div className="flex flex-col gap-6 slide-up">
           <AnomalyDetector anomalies={anomalies} />
            <div className="card" style={{ flex: 1 }}>
               <div className="flex justify-between items-center mb-6">
                 <div className="section-title">Live Market Scanner</div>
                 <button onClick={runScan} disabled={scanLoading} className="p-2 hover:bg-white/5 rounded-lg border border-white/10">
                   <RefreshCw size={16} className={scanLoading ? 'animate-spin' : ''} />
                 </button>
               </div>
               <div className="flex flex-col gap-1">
                 {scanData.map((item, i) => <ScanRow key={item.symbol} item={item} idx={i} onSelect={it => generate(it.symbol, it.type)} />)}
               </div>
            </div>
        </div>

        {/* ── COLUMN 2: ANALYZER ── */}
        <div className="flex flex-col gap-6 slide-up slide-up-delay-1">
          <div className="card" style={{ flex: 1 }}>
            <div className="section-title mb-6">Neural Analyzer</div>
            <div style={{ position:'relative', marginBottom:20 }}>
               <Search size={16} style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color:'#94A3B8' }} />
               <input type="text" placeholder="Search Symbol..." value={searchQ} onChange={e => setSearchQ(e.target.value)} className="search-input" />
            </div>
            
            <div className="type-toggle mb-6">
               {TABS.map(t => <button key={t} className={`type-btn ${assetTab===t?'active':''}`} onClick={() => setAssetTab(t)}>{t}</button>)}
            </div>

            <div className="label-text">Select Asset</div>
            <select className="trade-select mb-8" value={asset?.value || ''} onChange={e => setAsset(ALL_ASSETS.find(a=>a.value===e.target.value) || asset)}>
              {tabAssets.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>

            <button onClick={() => generate()} disabled={loading} className="btn-generate">
               {loading ? stepText : 'Generate AI Setup'}
            </button>
          </div>
          <EmotionalHealth stats={stats} />
        </div>

        {/* ── COLUMN 3: OVERVIEW & SENTIMENT ── */}
        <div className="flex flex-col gap-6 slide-up slide-up-delay-2">
          <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
             <div className="flex justify-between items-center mb-6">
                <div className="section-title">Market Overview</div>
                {market && (() => {
                  const assetDetails = ALL_ASSETS.find(a => 
                    a.value === market.symbol || 
                    a.value.replace('.NS', '') === market.symbol || 
                    market.symbol?.replace('.NS', '') === a.value
                  )
                  const assetCategory = assetDetails?.type ? assetDetails.type.toUpperCase() : 'ASSET'
                  const typeColors = {
                    STOCKS: 'rgba(59, 130, 246, 0.15)',
                    COMMODITIES: 'rgba(245, 158, 11, 0.15)',
                    INDICES: 'rgba(139, 92, 246, 0.15)'
                  }
                  const textColors = {
                    STOCKS: 'var(--neon-blue)',
                    COMMODITIES: 'var(--neon-orange)',
                    INDICES: 'var(--neon-purple)'
                  }
                  const borderColors = {
                    STOCKS: 'rgba(59, 130, 246, 0.3)',
                    COMMODITIES: 'rgba(245, 158, 11, 0.3)',
                    INDICES: 'rgba(139, 92, 246, 0.3)'
                  }
                  return (
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: typeColors[assetCategory] || 'rgba(16, 185, 129, 0.15)',
                      color: textColors[assetCategory] || 'var(--neon-green)',
                      border: `1px solid ${borderColors[assetCategory] || 'rgba(16, 185, 129, 0.3)'}`,
                      letterSpacing: '1px',
                      textTransform: 'uppercase'
                    }}>
                      {assetCategory}
                    </span>
                  )
                })()}
             </div>
             {market ? (() => {
                const currency = market.currency || 
                                 ((market.symbol?.endsWith('.NS') || market.symbol?.endsWith('.BO') || market.symbol === '^NSEI' || market.symbol === '^NSEBANK') ? '₹' : '$')
                const assetDetails = ALL_ASSETS.find(a => 
                  a.value === market.symbol || 
                  a.value.replace('.NS', '') === market.symbol || 
                  market.symbol?.replace('.NS', '') === a.value
                )
                const assetIcon = assetDetails?.icon || '📊'
                const assetName = assetDetails?.label ? assetDetails.label.split(' (')[0] : market.symbol

                // Calculate annualized historical volatility
                const calcVol = () => {
                  if (market?.volatility) return market.volatility * 100
                  if (!market?.price_data || market.price_data.length < 2) return 12.0
                  const returns = []
                  for (let i = 1; i < market.price_data.length; i++) {
                    const prevVal = market.price_data[i - 1].close
                    const currVal = market.price_data[i].close
                    if (prevVal > 0) returns.push((currVal - prevVal) / prevVal)
                  }
                  if (returns.length === 0) return 12.0
                  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length
                  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length
                  const stdDev = Math.sqrt(variance)
                  const annualized = stdDev * Math.sqrt(252)
                  return annualized * 100
                }
                const volatilityVal = calcVol()

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', gap: '16px' }}>
                    <div>
                      {/* Asset Header Info */}
                      <div className="flex items-center gap-2 mb-4" style={{ background: 'rgba(255,255,255,0.02)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '1.2rem' }}>{assetIcon}</span>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>{assetName}</div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 600 }}>Symbol: {market.symbol}</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-end mb-6">
                         <div>
                           <div className="price-big" style={{ color: isUp ? 'var(--green)' : 'var(--red)', fontSize: '2rem' }}>
                             {currency}{latest !== undefined && latest !== null && !isNaN(Number(latest)) ? Number(latest).toFixed(2) : '0.00'}
                           </div>
                           <div className="text-sm font-bold" style={{ color: isUp ? 'var(--green)' : 'var(--red)' }}>
                             {isUp?'+':''}{currency}{!isNaN(Number(diff)) ? Math.abs(Number(diff)).toFixed(2) : '0.00'} ({isUp?'+':''}{!isNaN(Number(pct)) ? Number(pct).toFixed(2) : '0.00'}%)
                           </div>
                         </div>
                         <div style={{ width:120, height:60 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={chartD}>
                                <Area type="monotone" dataKey="v" stroke={isUp?'var(--green)':'var(--red)'} fill={isUp?'var(--green)':'var(--red)'} fillOpacity={0.1} strokeWidth={2} dot={false} />
                              </AreaChart>
                            </ResponsiveContainer>
                         </div>
                      </div>

                      {/* Information Dense Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                         <div className="card2 p-3 text-center" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)' }}>
                            <div className="label-text" style={{ fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: '2px' }}>Pattern</div>
                            <div className="font-bold text-sm" style={{ color: 'var(--text)' }}>{market.pattern || 'Normal'}</div>
                         </div>
                         <div className="card2 p-3 text-center" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)' }}>
                            <div className="label-text" style={{ fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: '2px' }}>Regime Prediction</div>
                            <div className="font-bold text-xs" style={{ color: 'var(--text)' }}>{market.market_regime || 'Regime Unknown'}</div>
                         </div>
                         <div className="card2 p-3 text-center" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)' }}>
                            <div className="label-text" style={{ fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: '2px' }}>Volatility (Annualized)</div>
                            <div className="font-bold text-sm" style={{ color: 'var(--text)' }}>
                              {!isNaN(Number(volatilityVal)) ? Number(volatilityVal).toFixed(1) : '0.0'}%
                            </div>
                         </div>
                         <div className="card2 p-3 text-center" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)' }}>
                            <div className="label-text" style={{ fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: '2px' }}>Risk / Reward</div>
                            <div className="font-bold text-sm" style={{ color: 'var(--text)' }}>1 : {market.risk_reward || 'N/A'}</div>
                         </div>
                         <div className="card2 p-3 text-center" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)' }}>
                            <div className="label-text" style={{ fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: '2px' }}>GARCH Target Price</div>
                            <div className="font-bold text-sm" style={{ color: 'var(--neon-green)' }}>
                              {market.predicted_price !== undefined && market.predicted_price !== null && !isNaN(Number(market.predicted_price)) ? `${currency}${Number(market.predicted_price).toFixed(2)}` : 'N/A'}
                            </div>
                         </div>
                         <div className="card2 p-3 text-center" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)' }}>
                            <div className="label-text" style={{ fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: '2px' }}>AI Trading Signal</div>
                            <div className="font-bold text-sm" style={{ color: market.ai_color || 'var(--text)' }}>{market.ai_signal || 'NEUTRAL'}</div>
                         </div>
                      </div>
                    </div>

                    {/* AI Reasoning Box */}
                    {market.ai_reason && (
                      <div style={{
                        padding: '12px 14px',
                        background: 'rgba(139, 92, 246, 0.04)',
                        border: '1px solid rgba(139, 92, 246, 0.15)',
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
                      }}>
                        <div style={{ 
                          fontSize: '0.68rem', 
                          color: 'var(--neon-purple)', 
                          fontWeight: 700, 
                          textTransform: 'uppercase', 
                          letterSpacing: '1px',
                          marginBottom: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <Zap size={10} style={{ fill: 'var(--neon-purple)' }} />
                          Neural Recommendation & Thesis
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', lineHeight: '1.4', fontWeight: 500 }}>
                          {market.ai_reason}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })() : (
                <div className="h-40 flex items-center justify-center text-text-dim text-sm italic">Analyze an asset for live briefing</div>
              )}
          </div>
          <LearningFusion market={market} />
        </div>
      </div>
    </div>
  )
}
