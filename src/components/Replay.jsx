import React, { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, Target, Brain, Award, AlertCircle, ShieldAlert, ArrowLeft, Clock } from 'lucide-react'

export default function Replay({ onBack }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [step, setStep] = useState(0)
  const [score, setScore] = useState(0)
  const [decision, setDecision] = useState(null)
  const [stats, setStats] = useState({ timing: 85, discipline: 100, risk: 90 })
  const [scenarios, setScenarios] = useState([])
  const [currentScenarioIdx, setCurrentScenarioIdx] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/replay/scenarios')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setScenarios(data)
          setStep(Math.min(10, data[0].data.length - 1))
        }
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setScenarios([{ symbol: 'MOCK', data: [150, 152, 151, 155, 154, 158, 160, 159, 162, 165, 163, 168, 170, 169, 175, 180, 178, 182, 185, 190] }])
        setStep(10)
        setLoading(false)
      })
  }, [])

  const currentData = scenarios[currentScenarioIdx]?.data || []
  const currentSymbol = scenarios[currentScenarioIdx]?.symbol || '---'
  const maxPrice = currentData.length > 0 ? Math.max(...currentData) : 100
  
  useEffect(() => {
    let interval
    if (isPlaying && step < currentData.length - 1) {
      interval = setInterval(() => {
        setStep(s => s + 1)
      }, 1000)
    } else {
      setIsPlaying(false)
    }
    return () => clearInterval(interval)
  }, [isPlaying, step, currentData])

  const handleDecision = (type) => {
    if (step >= currentData.length - 1) return
    setDecision(type)
    
    const nextPrice = currentData[step + 1]
    const currentPrice = currentData[step]
    const priceChange = nextPrice - currentPrice
    
    const isTimingCorrect = (type === 'BUY' && priceChange > 0) || (type === 'SELL' && priceChange < 0)
    
    setStats(prev => ({
      timing: isTimingCorrect ? Math.min(100, prev.timing + 5) : Math.max(0, prev.timing - 15),
      discipline: prev.discipline, // Stays stable unless they spam
      risk: type === 'BUY' && currentPrice > maxPrice * 0.95 ? Math.max(0, prev.risk - 25) : Math.min(100, prev.risk + 5)
    }))
    
    setScore(s => isTimingCorrect ? s + 10 : Math.max(0, s - 20))
    setIsPlaying(true)
  }

  return (
    <div className="fade-in slide-up pb-24">
      <div className="page-header" style={{ marginBottom: 20 }}>
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={16} color="#94A3B8" />
        </button>
        <div className="page-title">Neural Replay</div>
        <div style={{ width: 32 }} />
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center shadow-lg shadow-neon-blue/20">
            <RotateCcw size={20} color="white" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-grotesk">Neural Replay System</h2>
            <p className="text-xs text-text-dim">Simulating: <strong className="text-neon-blue">{currentSymbol}</strong> regime</p>
          </div>
        </div>

        {loading ? (
          <div className="card py-20 text-center">
             <div className="w-10 h-10 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
             <div className="text-text-dim font-bold animate-pulse">Loading Market Data...</div>
          </div>
        ) : (
          <>
            <div className="card mb-6">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-4">
                   <div className="text-xs font-bold text-text-dim uppercase tracking-widest">Active Session</div>
                   <div className="live-badge"><span className="live-dot" />REPLAYING</div>
                 </div>
                 <div className="flex items-center gap-2">
                   <Award size={16} className="text-neon-orange" />
                   <span className="font-bold font-grotesk text-sm">Discipline Score: {score}</span>
                 </div>
              </div>

              {/* Visual Chart Simulation */}
              <div style={{ height: 200, display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 20, background: 'var(--card2)', borderRadius: 16, padding: '20px', border: '1px solid var(--border)' }}>
                {currentData.slice(0, step).map((v, i) => {
                  return (
                    <div key={i} style={{ flex: 1, background: 'var(--neon-blue)', opacity: 0.3 + (i/step)*0.7, height: `${(v/maxPrice)*100}%`, borderRadius: 2, transition: 'height 0.3s' }} />
                  )
                })}
                {Array.from({ length: Math.max(0, currentData.length - step) }).map((_, i) => (
                  <div key={i} style={{ flex: 1, background: 'var(--border)', height: '2px', borderRadius: 2 }} />
                ))}
              </div>

              <div className="flex justify-center gap-4">
                <button onClick={() => setIsPlaying(!isPlaying)} className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-white/5 transition-colors">
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button onClick={() => { setStep(0); setScore(0); setDecision(null) }} className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-white/5 transition-colors">
                  <RotateCcw size={20} />
                </button>
                {scenarios.length > 1 && (
                  <button onClick={() => { 
                    const nextIdx = (currentScenarioIdx + 1) % scenarios.length;
                    setCurrentScenarioIdx(nextIdx); 
                    setStep(Math.min(10, scenarios[nextIdx].data.length - 1)); 
                    setScore(0); 
                    setDecision(null);
                  }} className="px-4 rounded-full border border-border text-[10px] font-bold uppercase hover:bg-white/5">
                    Next Scenario
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
               {[
                 { label:'Timing', val:stats.timing, color:'var(--neon-blue)', icon:<Clock size={14}/> },
                 { label:'Discipline', val:stats.discipline, color:'var(--neon-green)', icon:<Award size={14}/> },
                 { label:'Risk MGMT', val:stats.risk, color:'var(--neon-purple)', icon:<ShieldAlert size={14}/> }
               ].map(st => (
                 <div key={st.label} className="card p-3 text-center flex flex-col items-center gap-1">
                    <div style={{ color:st.color }}>{st.icon}</div>
                    <div className="text-[10px] text-text-dim uppercase font-bold">{st.label}</div>
                    <div className="font-bold font-grotesk text-sm">{st.val}%</div>
                 </div>
               ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button 
                onClick={() => handleDecision('BUY')}
                disabled={step >= currentData.length - 1}
                className="p-6 rounded-2xl bg-neon-green/10 border border-neon-green/30 flex flex-col items-center gap-2 hover:bg-neon-green/20 transition-all neural-pulse"
              >
                <Target size={24} className="text-neon-green" />
                <span className="font-bold font-grotesk">EXECUTE BUY</span>
              </button>
              <button 
                onClick={() => handleDecision('SELL')}
                disabled={step >= currentData.length - 1}
                className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 flex flex-col items-center gap-2 hover:bg-red-500/20 transition-all"
              >
                <ShieldAlert size={24} className="text-red-500" />
                <span className="font-bold font-grotesk">EXECUTE SELL</span>
              </button>
            </div>

            <div className="p-4 bg-neon-blue/5 border border-neon-blue/10 rounded-2xl flex gap-3">
              <Brain size={20} className="text-neon-blue flex-shrink-0" />
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
                <strong>AI Copilot Insight:</strong> You are currently replaying the <strong className="text-white">{currentSymbol}</strong> regime. Analyze how price respects historic levels.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
