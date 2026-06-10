import React, { useState } from 'react'
import { FlaskConical, Play, Save, Plus, ChevronRight, BarChart3, ShieldAlert, ArrowLeft, Trash2, ShieldCheck, Activity, BookOpen, HelpCircle, Info } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

/* Equity Tooltip */
const EquityTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: '0.75rem', fontFamily: 'Space Grotesk' }}>
        <div style={{ color: 'var(--text-dim)', marginBottom: 2 }}>{label}</div>
        <div style={{ fontWeight: 700, color: 'var(--blue)' }}>Balance: ${payload[0].value.toLocaleString()}</div>
      </div>
    )
  }
  return null
}

const EDUCATIONAL_BREAKDOWNS = {
  vol_crash: {
    title: "Volatility Crash Scenario (VIX Spike)",
    description: "This scenario simulates a sudden, severe spike in volatility where the Volatility Index (VIX) jumps. This mimics historic panic events like Black Monday or the March 2020 COVID market selloff.",
    math: [
      { label: "Survival Formula", formula: "Base Survival - 12% Penalty", explanation: "Due to systemic margin liquidation pressure across all asset classes, we apply a direct 12% deduction to your baseline survival probability." },
      { label: "Estimated Damage Calculation", formula: "VIX * 2.2", explanation: "Maximum damage under systemic crash is modeled as 2.2 times the VIX index, representing worst-case panic pricing." }
    ],
    hedges: [
      { term: "VIX Call Options", explanation: "Contracts that increase in value when market volatility rises. Purchasing VIX calls allows you to capture cash gains specifically when the market goes into a state of panic." },
      { term: "Gold Futures", explanation: "Gold is a physical safe-haven asset. When paper assets (stocks, bonds) are liquidated, capital flees to gold, boosting its price." },
      { term: "Leverage Reduction", explanation: "Borrowed capital (leverage) amplifies losses. Cutting your position sizes and leverage by 30% reduces the risk of account margin calls." }
    ]
  },
  sector_collapse: {
    title: "Tech Sector Collapse Scenario",
    description: "This scenario simulates a dot-com style bubble pop or structural valuation reset in hyper-growth technology stocks, where high beta valuations contract rapidly.",
    math: [
      { label: "Survival Formula", formula: "Base Survival - 8% Penalty", explanation: "Tech concentrations are highly correlated. A sector collapse applies an 8% deduction to your baseline survival probability." },
      { label: "Estimated Damage Calculation", formula: "VIX * 1.9", explanation: "Tech crashes are modeled at 1.9 times the VIX index, reflecting the higher sensitivity (beta) of growth assets compared to the broader market." }
    ],
    hedges: [
      { term: "Defensive Sector Rotation", explanation: "Moving funds to Consumer Staples (companies selling food, household goods) and Utilities (power/water providers). People need these daily services even during recessions, making their stocks resilient." },
      { term: "QQQ Puts", explanation: "QQQ is the ETF that tracks the Nasdaq-100 index (consisting of the largest tech companies like Apple, Microsoft, and Nvidia). Buying 'puts' is like purchasing insurance: if tech indexes fall below a target price, the value of the put options rises dramatically, offsetting your stock losses." }
    ]
  },
  rate_shock: {
    title: "Interest Rate Shock Scenario",
    description: "This scenario simulates a rapid, unexpected spike in sovereign bond yields (interest rates) driven by aggressive central bank tightening to fight inflation.",
    math: [
      { label: "Survival Formula", formula: "Base Survival - 5% Penalty", explanation: "Rising rates affect the present value of all assets, applying a 5% discount to your baseline survival probability." },
      { label: "Estimated Damage Calculation", formula: "VIX * 1.6", explanation: "General market damage is modeled at 1.6 times the VIX index, representing asset valuation resets as the discount rate increases." }
    ],
    hedges: [
      { term: "Shorting TLT", explanation: "TLT is the ETF that tracks long-term US Treasury bonds. When interest rates go UP, bond prices go DOWN. Shorting TLT allows you to profit directly from falling bond prices." },
      { term: "Floating-Rate Credit", explanation: "Bonds or loans whose interest payments adjust dynamically with the market rates. Unlike fixed-rate bonds, they do not lose value when interest rates rise." },
      { term: "Financial Stocks", explanation: "Banks and lenders typically benefit from higher rates because their net interest margin (the difference between what they charge for loans and what they pay for deposits) expands, boosting their profits." }
    ]
  }
}

export default function StrategyLab({ onBack }) {
  const [conditions, setConditions] = useState([
    { id: 1, type: 'IF', parameter: 'RSI (14)', operator: '<', value: '30' },
    { id: 2, type: 'AND', parameter: 'Volatility (ATR)', operator: '>', value: 'Avg' },
  ])

  // Custom Condition Builder States
  const [newType, setNewType] = useState('AND')
  const [newParameter, setNewParameter] = useState('RSI (14)')
  const [newOperator, setNewOperator] = useState('<')
  const [newValue, setNewValue] = useState('30')

  const [result, setResult] = useState(null)
  const [testing, setTesting] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)

  const [mode, setMode] = useState('builder') // 'builder' or 'generator'
  const [generatorInput, setGeneratorInput] = useState({ capital: '10000', risk: '2', time: 'Intraday (Hours)', style: 'Balanced' })
  const [generatedInfo, setGeneratedInfo] = useState(null)

  const [stressScenario, setStressScenario] = useState(null)
  const [stressResult, setStressResult] = useState(null)
  const [stressTesting, setStressTesting] = useState(false)

  const runTest = async () => {
    setTesting(true)
    setError(null)
    try {
      const res = await fetch('/api/strategy-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conditions, mode, generatorInput })
      })
      if (!res.ok) throw new Error('Simulation Engine Offline')
      const data = await res.json()
      setResult(data)
    } catch (e) {
      console.error(e)
      setError(e.message)
    } finally {
      setTesting(false)
    }
  }

  const generateStrategy = async () => {
    setGenerating(true)
    setError(null)
    try {
      const res = await fetch('/api/strategy-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          capital: parseFloat(generatorInput.capital) || 10000,
          risk: parseFloat(generatorInput.risk) || 2,
          timeframe: generatorInput.time,
          style: generatorInput.style
        })
      })
      if (!res.ok) throw new Error('AI Strategy Generator Offline')
      const data = await res.json()
      
      setConditions(data.conditions || [])
      setGeneratedInfo({
        name: data.name,
        description: data.description
      })
      setMode('builder')
    } catch (e) {
      console.error(e)
      setError(e.message)
    } finally {
      setGenerating(false)
    }
  }

  const addCondition = () => {
    const type = conditions.length === 0 ? 'IF' : newType
    const newCond = {
      id: Date.now(),
      type,
      parameter: newParameter,
      operator: newOperator,
      value: newValue
    }
    setConditions([...conditions, newCond])
  }

  const removeCondition = (id) => {
    const updated = conditions.filter(c => c.id !== id)
    if (updated.length > 0 && updated[0].type !== 'IF') {
      updated[0].type = 'IF'
    }
    setConditions(updated)
  }

  const runStressTest = async (scenarioKey) => {
    setStressScenario(scenarioKey)
    setStressTesting(true)
    setStressResult(null)
    try {
      const res = await fetch(`/api/stress-test?scenario=${scenarioKey}`)
      if (!res.ok) throw new Error('Stress Test Engine Offline')
      const data = await res.json()
      setStressResult(data)
    } catch (e) {
      console.error(e)
    } finally {
      setStressTesting(false)
    }
  }

  return (
    <div className="fade-in slide-up pb-24">
      <div className="page-header" style={{ marginBottom: 20 }}>
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={16} color="#94A3B8" />
        </button>
        <div className="page-title">Strategy Lab</div>
        <div style={{ width: 32 }} />
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-orange flex items-center justify-center shadow-lg shadow-neon-orange/20">
            <FlaskConical size={20} color="white" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-grotesk">AI Strategy Lab</h2>
            <p className="text-xs text-text-dim">Visual No-Code Strategy Building & Generation</p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="type-toggle mb-6">
           <button className={`type-btn ${mode === 'builder' ? 'active' : ''}`} onClick={() => setMode('builder')}>Logic Builder</button>
           <button className={`type-btn ${mode === 'generator' ? 'active' : ''}`} onClick={() => setMode('generator')}>AI Generator</button>
        </div>

        {generatedInfo && mode === 'builder' && (
          <div className="p-4 bg-neon-blue/10 border border-neon-blue/20 rounded-xl mb-6 fade-in flex items-start gap-3">
            <ShieldCheck size={20} className="text-neon-blue flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] text-neon-blue font-bold uppercase tracking-wider mb-0.5">AI-Generated Strategy Loaded</div>
              <h4 className="font-bold text-sm text-white font-grotesk">{generatedInfo.name}</h4>
              <p className="text-xs text-text-dim mt-0.5 leading-relaxed">{generatedInfo.description}</p>
            </div>
          </div>
        )}

        {mode === 'generator' ? (
           <div className="card mb-6 fade-in">
              <h3 className="font-bold font-grotesk text-sm text-text-dim uppercase tracking-wider mb-4">Strategic Parameters</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                 <div>
                    <label className="text-[10px] text-text-dim uppercase font-bold mb-1 block">Starting Capital ($)</label>
                    <input type="number" value={generatorInput.capital} onChange={e => setGeneratorInput({...generatorInput, capital: e.target.value})} className="trade-select w-full" />
                 </div>
                 <div>
                    <label className="text-[10px] text-text-dim uppercase font-bold mb-1 block">Risk Per Trade (%)</label>
                    <input type="number" value={generatorInput.risk} onChange={e => setGeneratorInput({...generatorInput, risk: e.target.value})} className="trade-select w-full" />
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                 <div>
                    <label className="text-[10px] text-text-dim uppercase font-bold mb-1 block">Holding Timeframe</label>
                    <select className="trade-select w-full" value={generatorInput.time} onChange={e => setGeneratorInput({...generatorInput, time: e.target.value})}>
                       <option>Scalp (Minutes)</option>
                       <option>Intraday (Hours)</option>
                       <option>Swing (Days)</option>
                       <option>Position (Weeks)</option>
                    </select>
                 </div>
                 <div>
                    <label className="text-[10px] text-text-dim uppercase font-bold mb-1 block">Trading Style</label>
                    <select className="trade-select w-full" value={generatorInput.style} onChange={e => setGeneratorInput({...generatorInput, style: e.target.value})}>
                       <option>Balanced</option>
                       <option>Conservative</option>
                       <option>Aggressive</option>
                    </select>
                 </div>
              </div>
              <button className="btn-generate w-full" style={{ background:'linear-gradient(135deg, var(--neon-purple), var(--neon-blue))' }} onClick={generateStrategy} disabled={generating}>
                 {generating ? 'PROPERTIES CAPTURED... GENERATING STRATEGY...' : 'GENERATE CUSTOM AI STRATEGY'}
              </button>
           </div>
        ) : (
          <div className="card mb-6 fade-in">
            <h3 className="font-bold font-grotesk text-sm text-text-dim uppercase tracking-wider mb-4">Logic Builder</h3>

            <div className="flex flex-col gap-3">
              {conditions.length === 0 && (
                <div className="text-center py-6 text-xs text-text-dim border border-dashed border-border rounded-xl">
                  No conditions defined. Set new parameters below to build your strategy.
                </div>
              )}
              {conditions.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-3 bg-card2 rounded-xl border border-border group hover:border-neon-blue/30 transition-colors">
                  <div className="w-12 text-center font-bold font-grotesk text-xs text-neon-blue">{c.type}</div>
                  <div className="flex-1 text-sm font-semibold">{c.parameter}</div>
                  <div className="w-8 text-center text-text-dim">{c.operator}</div>
                  <div className="flex-1 text-sm text-right font-mono text-neon-green">{c.value}</div>
                  <button 
                    onClick={() => removeCondition(c.id)}
                    className="p-1 hover:bg-white/5 rounded text-text-dim hover:text-neon-red transition-colors"
                    title="Remove Condition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {conditions.length > 0 && (
                <div className="flex items-center gap-3 p-3 bg-neon-blue/5 border border-neon-blue/20 rounded-xl border-dashed">
                  <div className="w-12 text-center font-bold font-grotesk text-xs text-neon-blue">THEN</div>
                  <div className="flex-1 text-sm font-bold text-white">EXECUTE BUY ORDER</div>
                  <ChevronRight size={16} className="text-neon-blue" />
                </div>
              )}
            </div>

            {/* Condition Creator Form */}
            <div className="bg-card2 p-4 rounded-xl border border-border mt-6 flex flex-col gap-3">
              <div className="text-xs font-bold font-grotesk text-text-dim uppercase tracking-wider">New Condition Parameters</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="text-[9px] text-text-dim uppercase font-bold block mb-1">Type</label>
                  <select className="trade-select w-full" value={newType} onChange={e => setNewType(e.target.value)}>
                    <option>AND</option>
                    <option>OR</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-text-dim uppercase font-bold block mb-1">Parameter</label>
                  <select className="trade-select w-full" value={newParameter} onChange={e => setNewParameter(e.target.value)}>
                    <option>RSI (14)</option>
                    <option>EMA (20) vs EMA (50)</option>
                    <option>MACD Line</option>
                    <option>Volatility (ATR)</option>
                    <option>Volume Spike</option>
                    <option>Order Book Imbalance</option>
                    <option>Institutional Flow</option>
                    <option>Market Sentiment</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-text-dim uppercase font-bold block mb-1">Operator</label>
                  <select className="trade-select w-full" value={newOperator} onChange={e => setNewOperator(e.target.value)}>
                    <option>&gt;</option>
                    <option>&lt;</option>
                    <option>=</option>
                    <option>Crosses Above</option>
                    <option>Crosses Below</option>
                    <option>In Range</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-text-dim uppercase font-bold block mb-1">Value</label>
                  <input type="text" className="trade-select w-full" value={newValue} onChange={e => setNewValue(e.target.value)} placeholder="e.g. 30, Avg, 75%" />
                </div>
              </div>
              <button 
                className="py-2.5 px-4 rounded-xl bg-neon-blue/10 border border-neon-blue/20 hover:bg-neon-blue/20 text-neon-blue font-bold text-xs flex items-center justify-center gap-1.5 transition-all mt-2" 
                onClick={addCondition}
              >
                <Plus size={14} /> ADD CONDITION
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-neon-red/10 border border-neon-red/20 rounded-xl mb-6 text-xs text-neon-red font-semibold">
            {error}
          </div>
        )}

        <div className="flex gap-4 mb-6">
          <button 
            className="btn-generate flex-1" 
            onClick={runTest} 
            disabled={testing || conditions.length === 0}
            style={{ background: conditions.length === 0 ? 'var(--card2)' : 'linear-gradient(135deg, #3D65F4, #60A5FA)', opacity: conditions.length === 0 ? 0.5 : 1, cursor: conditions.length === 0 ? 'not-allowed' : 'pointer' }}
          >
            {testing ? 'Simulating Trades...' : <div className="flex items-center justify-center gap-2"><Play size={18} /> RUN AI BACKTEST</div>}
          </button>
          <button className="card flex items-center justify-center" style={{ padding: '0 20px' }}>
            <Save size={18} className="text-text-dim" />
          </button>
        </div>

        {result && (
          <div className="holo-card fade-in bg-card p-6 rounded-2xl border border-border mb-8">
            <div className="flex items-center gap-2 mb-6 text-neon-green">
              <BarChart3 size={20} />
              <h3 className="font-bold font-grotesk text-base uppercase tracking-wider">Simulation Report</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-card2 p-4 rounded-xl border border-border">
                <div className="text-[10px] text-text-dim uppercase font-bold tracking-wider mb-1">Win Probability</div>
                <div className="text-2xl font-bold font-grotesk text-neon-green">{result.win_probability}%</div>
              </div>
              <div className="bg-card2 p-4 rounded-xl border border-border">
                <div className="text-[10px] text-text-dim uppercase font-bold tracking-wider mb-1">Simulated P/L</div>
                <div className="text-2xl font-bold font-grotesk text-white">{result.simulated_pnl}</div>
              </div>
              <div className="bg-card2 p-4 rounded-xl border border-border">
                <div className="text-[10px] text-text-dim uppercase font-bold tracking-wider mb-1">Max Drawdown</div>
                <div className="text-2xl font-bold font-grotesk text-neon-orange">{result.drawdown}</div>
              </div>
            </div>

            {/* Recharts Area Chart for Equity Curve */}
            {result.equity_curve && (
              <div className="mb-6 p-4 bg-card2 border border-border rounded-xl">
                <div className="text-xs font-bold font-grotesk text-text-dim uppercase tracking-wider mb-4">Simulated Equity Growth Curve</div>
                <div style={{ height: 160, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={result.equity_curve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="equityGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--neon-blue)" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="var(--neon-blue)" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="day" stroke="var(--text-dim)" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--text-dim)" fontSize={10} tickLine={false} axisLine={false} domain={['dataMin - 100', 'dataMax + 100']} />
                      <Tooltip content={<EquityTooltip />} />
                      <Area type="monotone" dataKey="balance" stroke="var(--neon-blue)" strokeWidth={2} fill="url(#equityGlow)" dot={{ r: 2, fill: 'var(--neon-blue)' }} activeDot={{ r: 4 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-start gap-3">
              <ShieldAlert size={18} className="text-neon-orange flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-neon-orange uppercase tracking-wider mb-1">Strategy Lab Insight</div>
                <p className="text-xs text-text-dim leading-relaxed">{result.message}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 border-t border-border pt-8">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={18} className="text-neon-purple" />
            <h3 className="font-bold font-grotesk text-sm text-text-dim uppercase tracking-wider">Portfolio Stress Test Engine</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Vol Crash', key: 'vol_crash', icon: '📉' },
              { label: 'Sector Collapse', key: 'sector_collapse', icon: '🏗️' },
              { label: 'Rate Shock', key: 'rate_shock', icon: '🏦' },
            ].map(s => (
              <button 
                key={s.label} 
                onClick={() => runStressTest(s.key)}
                className={`card p-4 hover:border-neon-blue transition-colors flex flex-col items-center gap-2 ${stressScenario === s.key ? 'border-neon-blue bg-neon-blue/5' : ''}`}
              >
                <span className="text-2xl">{s.icon}</span>
                <span className="text-xs font-bold">{s.label}</span>
              </button>
            ))}
          </div>

          {stressTesting && (
            <div className="card p-6 flex flex-col items-center justify-center gap-3 fade-in">
              <div className="w-8 h-8 border-4 border-neon-purple border-t-transparent rounded-full animate-spin" />
              <div className="text-xs text-text-dim font-bold animate-pulse uppercase">Running Monte Carlo Stress Simulation...</div>
            </div>
          )}

          {!stressTesting && stressResult && (
            <div className="holo-card fade-in p-6 bg-slate-950/80 border border-neon-purple/30 rounded-2xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={20} className="text-neon-purple animate-pulse" />
                  <h4 className="font-bold font-grotesk text-sm text-white uppercase tracking-wider">{stressResult.scenario_title}</h4>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${stressResult.status === 'Resilient' ? 'bg-neon-green/10 border border-neon-green/20 text-neon-green' : 'bg-neon-red/10 border border-neon-red/20 text-neon-red'}`}>
                  {stressResult.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-card2 p-4 rounded-xl border border-border">
                  <div className="text-[10px] text-text-dim uppercase font-bold tracking-wider mb-1">Survival Probability</div>
                  <div className="text-xl font-bold font-grotesk text-neon-purple">{stressResult.survival_probability}</div>
                </div>
                <div className="bg-card2 p-4 rounded-xl border border-border">
                  <div className="text-[10px] text-text-dim uppercase font-bold tracking-wider mb-1">Estimated Damage</div>
                  <div className="text-xl font-bold font-grotesk text-neon-red">
                    {typeof stressResult.portfolio_damage === 'object'
                      ? stressResult.portfolio_damage?.systemic_crash || Object.values(stressResult.portfolio_damage)[0]
                      : stressResult.portfolio_damage}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-neon-purple/5 border border-neon-purple/20 rounded-xl mb-6">
                <div className="text-xs font-bold text-neon-purple uppercase tracking-wider mb-2 font-grotesk">Institutional Hedging Recommendation</div>
                <p className="text-xs text-text-dim leading-relaxed">{stressResult.hedging_recommendation}</p>
              </div>

              {/* Educational & Methodology Breakdown */}
              {EDUCATIONAL_BREAKDOWNS[stressScenario] && (
                <div className="mt-6 border-t border-white/10 pt-6 space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen size={16} className="text-neon-blue" />
                      <h5 className="font-bold text-xs uppercase tracking-wider text-white font-grotesk">Methodology Breakdown</h5>
                    </div>
                    <p className="text-xs text-text-dim leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                      {EDUCATIONAL_BREAKDOWNS[stressScenario].description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {EDUCATIONAL_BREAKDOWNS[stressScenario].math.map((item, idx) => (
                      <div key={idx} className="p-3 bg-white/5 border border-white/5 rounded-xl">
                        <div className="text-[10px] text-text-dim uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5">
                          <Activity size={12} className="text-neon-purple" /> {item.label}
                        </div>
                        <div className="text-xs font-mono font-bold text-white mb-1.5 bg-black/40 p-1.5 rounded border border-white/5">{item.formula}</div>
                        <p className="text-[11px] text-text-dim leading-relaxed">{item.explanation}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                    <div className="text-xs font-bold text-white mb-3 flex items-center gap-2 font-grotesk">
                      <HelpCircle size={16} className="text-neon-green" /> Terminology Glossary
                    </div>
                    <div className="space-y-3">
                      {EDUCATIONAL_BREAKDOWNS[stressScenario].hedges.map((item, idx) => (
                        <div key={idx} className="text-xs">
                          <strong className="text-neon-green block mb-0.5">{item.term}</strong>
                          <span className="text-text-dim leading-relaxed">{item.explanation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
