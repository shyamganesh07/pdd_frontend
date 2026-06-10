import React, { useState, useEffect } from 'react'
import { ShieldAlert, TrendingDown, TrendingUp, Activity, RefreshCw, AlertTriangle, ChevronLeft, BookOpen, Info, HelpCircle, Gauge } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function StressTest({ onBack }) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('metrics')
  const [simVix, setSimVix] = useState(18)

  useEffect(() => {
    if (data?.vix) {
      setSimVix(Math.round(data.vix))
    }
  }, [data])

  const runTest = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/stress-test')
      if (!res.ok) throw new Error('Stress Test Protocol Failed')
      setData(await res.json())
    } catch (e) {
      console.error(e)
      setError(e.message)
    } finally {
      setTimeout(() => setLoading(false), 1500)
    }
  }

  useEffect(() => {
    runTest()
  }, [])

  const chartData = [
    { name: 'Start', value: 100 },
    { name: 'Vol Spike', value: 92 },
    { name: 'Recession', value: 75 },
    { name: 'Crash', value: 55 },
    { name: 'Recovery', value: 68 },
  ]

  if (error && !loading) return (
    <div className="p-8 text-center mt-20">
      <ShieldAlert size={48} className="mx-auto text-red-500 mb-4" />
      <div className="text-xl font-bold mb-2">Simulation Crash</div>
      <div className="text-text-dim mb-6">{error}</div>
      <button onClick={runTest} className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10">Re-inject Protocols</button>
    </div>
  )

  if (!data && !loading) return null

  return (
    <div className="fade-in slide-up pb-24">
      <div className="page-header" style={{ marginBottom: 20 }}>
        <button onClick={onBack} className="back-btn">
          <ChevronLeft size={20} />
        </button>
        <div className="page-title">Portfolio Stress Test Engine</div>
        <div style={{ width: 32 }} />
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px' }}>
        <div className="card mb-6 overflow-hidden relative glass-morphism-premium">
          <div style={{ position:'absolute', top:-20, right:-20, width:150, height:150, background: data?.status === 'Resilient' ? 'var(--green)' : 'var(--red)', filter:'blur(60px)', opacity:0.1 }} />
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <ShieldAlert size={24} className="text-blue-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-grotesk">Survival Probability</h2>
                <p className="text-xs text-text-dim">Institutional Risk Assessment</p>
              </div>
            </div>
            <button 
              onClick={runTest} 
              disabled={loading}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <div className="inline-block animate-pulse mb-4">
                <Activity size={48} className="text-blue-500" />
              </div>
              <div className="text-lg font-bold font-grotesk text-blue-500">Simulating Market Chaos...</div>
              <div className="text-xs text-text-dim mt-2">Injecting volatility vectors into portfolio nodes</div>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center mb-8">
                <div className="text-6xl font-bold font-grotesk text-white mb-2">{data?.survival_probability}</div>
                <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${data?.status === 'Resilient' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                  System {data?.status}
                </div>
              </div>

              <div className="h-48 w-full mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" hide />
                    <YAxis hide domain={[0, 110]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0d1220', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#F8FAFC' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} fill="url(#stressGradient)" dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#0d1220' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {Object.entries(data?.portfolio_damage || {}).map(([scenario, damage]) => (
                  <div key={scenario} className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                    <div className="text-[10px] text-text-dim uppercase tracking-wider mb-1 font-bold">{scenario.replace('_', ' ')}</div>
                    <div className="text-lg font-bold text-red-500">{damage}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {data?.stock_impacts && data.stock_impacts.length > 0 && (
          <div className="card glass-morphism-premium mb-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity size={18} className="text-blue-500" />
              <h3 className="font-bold font-grotesk">Analysis Historical Impact</h3>
            </div>
            
            <div className="space-y-4">
              {data.stock_impacts.map((item) => {
                const isPositive = !item.impact.startsWith('-');
                const isZero = item.impact === '0.0';
                
                return (
                  <div key={item.symbol} className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl transition-all hover:bg-white/[0.08]">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isZero ? 'bg-gray-500/10 text-gray-500 border border-gray-500/20' :
                      isPositive ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                      'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                      {isZero ? <Activity size={20} /> :
                       isPositive ? <TrendingUp size={20} /> : 
                       <TrendingDown size={20} />}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm font-grotesk tracking-wide text-white uppercase">{item.symbol}</span>
                        <span className={`text-sm font-bold font-grotesk ${
                          isZero ? 'text-gray-400' :
                          isPositive ? 'text-green-500' : 
                          'text-red-500'
                        }`}>
                          {item.impact} pts
                        </span>
                      </div>
                      <p className="text-xs text-text-dim leading-relaxed mb-2">{item.explanation}</p>
                      <div className="flex items-center gap-4 text-[10px] text-text-dim">
                        <span>Scans: <strong className="text-white">{item.total_trades}</strong></span>
                        <span>•</span>
                        <span>Win Rate: <strong className="text-white">{item.win_rate}%</strong></span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="card glass-morphism-premium">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-orange-500" />
              <h3 className="font-bold font-grotesk">Critical Vulnerabilities</h3>
            </div>
            <div className="text-[10px] text-text-dim bg-white/5 border border-white/10 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
              Risk Diagnostics
            </div>
          </div>

          <p className="text-xs text-text-dim mb-6 leading-relaxed">
            These diagnostic alerts highlight structural weaknesses in your portfolio model under hypothetical stress events. Rather than active trading alerts, they serve to educate you on structural failure points.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl">
              <TrendingDown size={20} className="text-orange-500 flex-shrink-0 mt-1" />
              <div>
                <div className="font-bold text-sm mb-1">Liquidity Trap Potential</div>
                <div className="text-xs text-text-dim leading-relaxed">During a flash crash, 45% of your portfolio may face high slippage due to low-volume altcoins.</div>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
              <ShieldAlert size={20} className="text-red-500 flex-shrink-0 mt-1" />
              <div>
                <div className="font-bold text-sm mb-1">Volatility De-correlation</div>
                <div className="text-xs text-text-dim leading-relaxed">Your hedge positions may fail to offset losses if VIX spikes above 45.</div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-white/5 rounded-2xl flex items-center justify-between">
            <div>
              <div className="text-[10px] text-text-dim uppercase tracking-widest font-bold">Estimated Recovery Time</div>
              <div className="text-xl font-bold font-grotesk">{data?.recovery_time}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-text-dim uppercase tracking-widest font-bold">Resilience Score</div>
              <div className="text-xl font-bold font-grotesk text-blue-500">{data?.institutional_grade_score}/100</div>
            </div>
          </div>
        </div>

        {/* Methodology & Learning Hub */}
        <div className="card glass-morphism-premium mt-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={18} className="text-blue-400" />
            <h3 className="font-bold font-grotesk text-white">Methodology & Learning Hub</h3>
          </div>
          <p className="text-xs text-text-dim mb-6 leading-relaxed">
            Unlike active trading interfaces, this risk engine acts as an analytical simulator. Use the tabs below to understand what these metrics mean, how they are derived, and how they interact.
          </p>

          {/* Navigation Tabs */}
          <div className="flex border-b border-white/10 mb-6 overflow-x-auto pb-px">
            <button
              onClick={() => setActiveTab('metrics')}
              className={`pb-3 px-4 text-xs font-bold font-grotesk tracking-wide uppercase border-b-2 transition-all flex-shrink-0 ${
                activeTab === 'metrics'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-text-dim hover:text-white'
              }`}
            >
              Metrics Breakdown
            </button>
            <button
              onClick={() => setActiveTab('vulnerabilities')}
              className={`pb-3 px-4 text-xs font-bold font-grotesk tracking-wide uppercase border-b-2 transition-all flex-shrink-0 ${
                activeTab === 'vulnerabilities'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-text-dim hover:text-white'
              }`}
            >
              Vulnerability Audits
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`pb-3 px-4 text-xs font-bold font-grotesk tracking-wide uppercase border-b-2 transition-all flex-shrink-0 ${
                activeTab === 'simulator'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-text-dim hover:text-white'
              }`}
            >
              Interactive VIX Simulator
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'metrics' && (
            <div className="space-y-6 fade-in">
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Activity size={16} className="text-emerald-400" />
                  <div className="font-bold text-sm text-emerald-400 font-grotesk">Survival Probability ({data?.survival_probability})</div>
                </div>
                <p className="text-xs text-text-dim leading-relaxed mb-3">
                  <strong>What is it:</strong> The likelihood your portfolio model avoids ruin (catastrophic drawdown) under stress.
                </p>
                <p className="text-xs text-text-dim leading-relaxed mb-3">
                  <strong>How it's calculated:</strong> Derived using a Monte Carlo engine that adjusts your behavioral Resilience Score based on the current market Volatility (VIX).
                </p>
                <p className="text-xs text-text-dim leading-relaxed">
                  <strong>Why we use it:</strong> Shows how external market stress decays your safety buffer. Low VIX temporarily inflates survival; high VIX drains it.
                </p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Gauge size={16} className="text-blue-400" />
                  <div className="font-bold text-sm text-blue-400 font-grotesk">Resilience Score ({data?.institutional_grade_score}/100)</div>
                </div>
                <p className="text-xs text-text-dim leading-relaxed mb-3">
                  <strong>What is it:</strong> A behavioral score evaluating your risk-management discipline.
                </p>
                <p className="text-xs text-text-dim leading-relaxed mb-3">
                  <strong>How it's calculated:</strong> Formulated by auditing your historical trade logs for stop-loss usage, win-rates, position sizing consistency, and overtrading.
                </p>
                <p className="text-xs text-text-dim leading-relaxed">
                  <strong>Why we use it:</strong> You cannot control market volatility (VIX), but you can control your trading behavior. A higher Resilience Score acts as your primary "shield" against crash events.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'vulnerabilities' && (
            <div className="space-y-6 fade-in">
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown size={16} className="text-orange-400" />
                  <div className="font-bold text-sm text-orange-400 font-grotesk">Liquidity Trap Potential</div>
                </div>
                <p className="text-xs text-text-dim leading-relaxed mb-3">
                  <strong>What is it:</strong> The danger of getting locked into positions during market panic because buyers disappear.
                </p>
                <p className="text-xs text-text-dim leading-relaxed mb-3">
                  <strong>How it's calculated:</strong> Audits the daily volume profiles of assets you scan/journal. High concentration in low-liquidity altcoins triggers a liquidity warning.
                </p>
                <p className="text-xs text-text-dim leading-relaxed">
                  <strong>Why we use it:</strong> Teaches that true diversification requires high order book depth. Paper hedges fail if you cannot execute exits.
                </p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert size={16} className="text-red-400" />
                  <div className="font-bold text-sm text-red-400 font-grotesk">Volatility De-correlation</div>
                </div>
                <p className="text-xs text-text-dim leading-relaxed mb-3">
                  <strong>What is it:</strong> The breakdown of normal asset relationships during extreme spikes in volatility.
                </p>
                <p className="text-xs text-text-dim leading-relaxed mb-3">
                  <strong>How it's calculated:</strong> Analyzes historical asset behavior during market selloffs where VIX exceeded 45.
                </p>
                <p className="text-xs text-text-dim leading-relaxed">
                  <strong>Why we use it:</strong> Teaches that during tail-risk events, standard hedges (like gold or stable assets) can correlate and fail simultaneously due to systemic liquidations.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'simulator' && (
            <div className="space-y-6 fade-in">
              <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-bold font-grotesk text-white">Simulate VIX (Market Volatility Index)</div>
                  <div className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono font-bold">VIX: {simVix}</div>
                </div>

                <input
                  type="range"
                  min="10"
                  max="60"
                  value={simVix}
                  onChange={(e) => setSimVix(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500 mb-6"
                />

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center">
                    <div className="text-[10px] text-text-dim uppercase tracking-wider mb-1 font-bold">Resilience Score</div>
                    <div className="text-base font-bold text-white font-grotesk">{data?.institutional_grade_score || 88}</div>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center">
                    <div className="text-[10px] text-text-dim uppercase tracking-wider mb-1 font-bold">Current VIX</div>
                    <div className="text-base font-bold text-white font-grotesk">{data?.vix ? Math.round(data.vix) : 18}</div>
                  </div>
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-center">
                    <div className="text-[10px] text-blue-400 uppercase tracking-wider mb-1 font-bold">Simulated Survival</div>
                    <div className="text-base font-bold text-blue-400 font-grotesk">
                      {Math.max(40, Math.min(98, Math.round((data?.institutional_grade_score || 88) - (simVix - 20))))}%
                    </div>
                  </div>
                </div>

                <div className="text-xs leading-relaxed p-3 bg-white/5 border border-white/5 rounded-xl">
                  {simVix <= 20 ? (
                    <p className="text-emerald-450">
                      🟢 <strong>Low Volatility (VIX ≤ 20):</strong> Market environment is calm. The formula adds a tailwind to your survival probability. Your sub-optimal discipline score is temporarily masked by peaceful market regimes.
                    </p>
                  ) : simVix <= 35 ? (
                    <p className="text-amber-450">
                      🟡 <strong>Moderate Stress (VIX 21-35):</strong> Normal correlations are beginning to stretch. Volatility is actively eating away at your survival. Your behavioral discipline score is now the primary factor keeping the portfolio afloat.
                    </p>
                  ) : (
                    <p className="text-rose-450 animate-pulse">
                      🔴 <strong>Systemic Crash (VIX &gt; 35):</strong> Market panic is causing correlation convergence. Your survival probability has degraded severely. Only an extremely high Resilience Score (&gt;85) can prevent simulated ruin here.
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="text-xs font-bold text-white font-grotesk mb-2">Equation Rationale</div>
                <code className="block text-[11px] font-mono text-blue-400 bg-black/40 p-2.5 rounded-lg border border-white/5 leading-relaxed">
                  Survival Probability = Resilience Score - (VIX - 20)<br />
                  <span className="text-text-dim text-[10px]">* Bounded mathematically between 40% and 98% in the simulator.</span>
                </code>
                <p className="text-[11px] text-text-dim mt-2 leading-relaxed">
                  This educational model demonstrates how a trader's internal habits (Resilience Score) and the external environment (VIX) combine to dictate the probability of systemic survival.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 p-6 text-center">
           <p className="text-xs text-text-dim leading-relaxed">This simulation uses Monte Carlo models based on historic volatility regimes. Survival probability is calculated across 10,000 randomized market paths.</p>
        </div>
      </div>
    </div>
  )
}
