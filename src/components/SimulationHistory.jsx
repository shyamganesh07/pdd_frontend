import React, { useState, useEffect } from 'react'
import { ArrowLeft, Clock, TrendingUp, TrendingDown, Award, ShieldAlert, Target, Brain, Info, History } from 'lucide-react'

export default function SimulationHistory({ user, onBack, onGoToSimulation }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSession, setSelectedSession] = useState(null)

  useEffect(() => {
    const email = user?.email || localStorage.getItem('userEmail') || ''
    fetch(`/api/simulation/history?email=${encodeURIComponent(email)}`)
      .then(res => {
        if (!res.ok) throw new Error('Response not ok')
        return res.json()
      })
      .then(data => {
        if (Array.isArray(data)) {
          setHistory(data)
        } else {
          console.warn('Simulation history data is not an array:', data)
          setHistory([])
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching simulation history:', err)
        setHistory([])
        setLoading(false)
      })
  }, [user?.email])

  const formatDate = (isoStr) => {
    try {
      const d = new Date(isoStr)
      return d.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      })
    } catch {
      return isoStr
    }
  }

  return (
    <div className="fade-in slide-up p-6">
      {/* Top Bar */}
      <div className="flex items-center gap-4 mb-8">
         <button onClick={onBack} className="back-btn"><ArrowLeft size={20}/></button>
         <div>
           <h1 className="text-2xl font-bold font-grotesk text-white flex items-center gap-2">
             <History className="text-neon-blue" size={24} /> Simulation History
           </h1>
           <p className="text-xs text-text-dim mt-1">Review your past demo trading sessions and training drill performances</p>
         </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
           <div className="w-10 h-10 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
           <div className="text-text-dim font-bold animate-pulse">Loading Simulation History...</div>
        </div>
      ) : history.length === 0 ? (
        <div className="card p-12 text-center max-w-lg mx-auto">
           <Award size={48} className="mx-auto text-text-dim mb-4" />
           <h3 className="text-lg font-bold text-white mb-2">No Simulation Sessions Found</h3>
           <p className="text-xs text-text-dim mb-6 leading-relaxed">
             You haven't completed any demo trading sessions yet. Go to the Simulation Lab to place your first trade and test your strategies live!
           </p>
           <button onClick={onGoToSimulation || onBack} className="btn-generate text-xs py-2 px-6 uppercase tracking-wider mx-auto">
             Go to Simulation Lab
           </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main List */}
          <div className="lg:col-span-2 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {history.map((s, index) => {
              const netReturn = s.net_return ?? 0
              const isProfit = netReturn >= 0
              const currency = (s.symbol?.endsWith('.NS') || s.symbol?.endsWith('.BO') || s.symbol === '^NSEI' || s.symbol === '^NSEBANK') ? '₹' : '$'
              const avgScore = s.scores ? Math.round(((s.scores.discipline ?? 100) + (s.scores.execution ?? 100) + (s.scores.stability ?? 100)) / 3) : 100
              const isSelected = selectedSession?.id === s.id

              return (
                <div 
                  key={s.id || `sim-sess-${index}`} 
                  onClick={() => setSelectedSession(s)}
                  className={`card p-5 cursor-pointer transition-all border hover:border-white/20 ${isSelected ? 'border-neon-blue/40 bg-neon-blue/5' : 'border-white/5 bg-slate-900/40'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white font-grotesk">{s.name || 'Simulation Session'}</h4>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${s.is_custom ? 'bg-neon-green/10 border border-neon-green/20 text-neon-green' : 'bg-neon-blue/10 border border-neon-blue/20 text-neon-blue'}`}>
                          {s.is_custom ? 'Live Feed' : 'Drill'}
                        </span>
                      </div>
                      <div className="text-[10px] text-text-dim mt-1 flex items-center gap-1.5">
                        <Clock size={10} /> {formatDate(s.timestamp)}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-sm font-bold font-mono ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                        {isProfit ? '+' : ''}{currency}{netReturn.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-[9px] text-text-dim mt-0.5">{s.trade_count ?? 0} trades</div>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-3 mt-2 space-y-2">
                     <div className="flex items-center justify-between text-xs">
                        <span className="text-text-dim">Behavioral Performance Score:</span>
                        <span className={`font-bold font-grotesk ${avgScore >= 80 ? 'text-neon-green' : avgScore >= 60 ? 'text-neon-blue' : 'text-neon-red'}`}>
                          {avgScore}% ({avgScore >= 80 ? 'Excellent' : avgScore >= 60 ? 'Good' : 'Needs Work'})
                        </span>
                     </div>
                     <div className="text-[10px] text-text-dim flex justify-between border-t border-white/5 pt-1.5">
                       <span>Discipline: <strong className="text-white">{s.scores?.discipline || 100}%</strong></span>
                       <span>Execution: <strong className="text-white">{s.scores?.execution || 100}%</strong></span>
                       <span>Risk Control: <strong className="text-white">{s.scores?.stability || 100}%</strong></span>
                     </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Details Sidebar Panel */}
          <div className="card p-6 bg-slate-950/60 border border-white/10 flex flex-col justify-between">
            {selectedSession ? (
              <div className="space-y-6">
                <div>
                  <div className="text-[9px] text-text-dim uppercase font-bold tracking-widest mb-1">Session Detail</div>
                  <h3 className="text-xl font-bold font-grotesk text-white">{selectedSession.name || 'Simulation Session'}</h3>
                  <div className="text-[10px] text-text-dim mt-1">{formatDate(selectedSession.timestamp)}</div>
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-3">
                   <div className="flex justify-between text-xs">
                     <span className="text-text-dim">Starting Capital:</span>
                     <span className="font-bold text-white">
                       {(selectedSession.symbol?.endsWith('.NS') || selectedSession.symbol?.endsWith('.BO') || selectedSession.symbol === '^NSEI' || selectedSession.symbol === '^NSEBANK' ? '₹' : '$')}{(selectedSession.starting_balance ?? 0).toLocaleString(undefined, {maximumFractionDigits:2})}
                     </span>
                   </div>
                   <div className="flex justify-between text-xs">
                     <span className="text-text-dim">Ending Capital:</span>
                     <span className="font-bold text-white">
                       {(selectedSession.symbol?.endsWith('.NS') || selectedSession.symbol?.endsWith('.BO') || selectedSession.symbol === '^NSEI' || selectedSession.symbol === '^NSEBANK' ? '₹' : '$')}{(selectedSession.ending_balance ?? 0).toLocaleString(undefined, {maximumFractionDigits:2})}
                     </span>
                   </div>
                   <div className="flex justify-between text-xs border-t border-white/5 pt-2">
                     <span className="text-text-dim">Net Profit/Loss:</span>
                     <span className={`font-bold ${ (selectedSession.net_return ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                       {(selectedSession.net_return ?? 0) >= 0 ? '+' : ''}{(selectedSession.symbol?.endsWith('.NS') || selectedSession.symbol?.endsWith('.BO') || selectedSession.symbol === '^NSEI' || selectedSession.symbol === '^NSEBANK' ? '₹' : '$')}{(selectedSession.net_return ?? 0).toLocaleString(undefined, {maximumFractionDigits:2})}
                     </span>
                   </div>
                </div>

                {/* Scores breakdown */}
                <div className="space-y-4">
                  <div className="text-[10px] text-text-dim uppercase font-bold tracking-wider">Behavioral Assessment</div>
                  {[
                    { 
                      label: 'Discipline', 
                      val: selectedSession.scores?.discipline ?? 100, 
                      icon: <Target size={14}/>, 
                      color: 'var(--neon-blue)', 
                      definition: 'Assessment of entry-timing discipline.',
                      calculation: 'Starts at 100%. Deducts 15% for buying assets during a multi-step downward price trend.',
                      usecase: 'Prevents catching falling knives and trains you to buy aligned with positive market momentum.'
                    },
                    { 
                      label: 'Execution', 
                      val: selectedSession.scores?.execution ?? 100, 
                      icon: <TrendingUp size={14}/>, 
                      color: 'var(--neon-green)', 
                      definition: 'Efficiency of profit capturing and trade completion.',
                      calculation: 'Starts at 100%. Increases by +10% on profitable exits; decreases by -15% on net losses.',
                      usecase: 'Measures trade setup profitability and prevents greed-based holding or premature panics.'
                    },
                    { 
                      label: 'Stability', 
                      val: selectedSession.scores?.stability ?? 100, 
                      icon: <Brain size={14}/>, 
                      color: 'var(--neon-purple)', 
                      definition: 'Adherence to risk sizing and stop-loss rules.',
                      calculation: 'Starts at 100%. Deducts 20% if a position is held past a -10% drawdown threshold.',
                      usecase: 'Enforces strict capital preservation and prevents catastrophic account blowups.'
                    }
                  ].map(s => (
                    <div key={s.label} className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-2 text-left">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs text-white font-bold" style={{ color: s.color }}>
                          {s.icon} {s.label}
                        </span>
                        <span className="font-bold text-xs text-white">{s.val}/100</span>
                      </div>
                      <div className="space-y-1.5 text-[10px] text-text-dim leading-relaxed">
                        <div>💡 <strong>What it is:</strong> <span className="text-white">{s.definition}</span></div>
                        <div>🔧 <strong>How it is calculated:</strong> <span className="text-white">{s.calculation}</span></div>
                        <div>🎯 <strong>Why it is needed:</strong> <span className="text-white">{s.usecase}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center text-text-dim">
                <Info size={32} className="mb-4 text-neon-blue" />
                <p className="text-xs">Select any simulation session from the list to view its complete analytics report.</p>
              </div>
            )}
            
            {selectedSession && (
              <div className="mt-8 text-[10px] text-text-dim leading-relaxed border-t border-white/5 pt-4">
                💡 Practicing consistently helps you reduce behavioral errors (panic exits, revenge trading) by 45% over time.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
