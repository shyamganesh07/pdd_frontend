import React, { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, Target, Brain, Award, AlertCircle, ShieldAlert, ArrowLeft, Clock, TrendingUp, TrendingDown, Eye } from 'lucide-react'

const MISTAKES = [
  {
    id: 'fear-exit',
    title: 'The Fear Exit',
    subtitle: 'Exiting early due to minor volatility.',
    fullData: [100, 102, 98, 101, 99, 97, 105, 115, 130, 150, 180, 200],
    mistakeIndex: 5, // Exits at 97
    reason: 'Price dipped 3% and fear took over. You exited at $97.',
    lesson: 'Trust your stop-loss, not your emotions. The trend was still intact.',
    correctApproach: 'Hold through minor noise if original thesis is valid.'
  },
  {
    id: 'greed-hold',
    title: 'The Greed Hold',
    subtitle: 'Ignoring take-profit targets.',
    fullData: [100, 110, 120, 135, 145, 150, 140, 125, 110, 95, 80, 70],
    mistakeIndex: 5, // Should have sold at 150
    reason: 'Target was $145, but you hoped for $200. You held until $70.',
    lesson: 'Markets are cyclical. A target is a contract with yourself.',
    correctApproach: 'Scale out at predefined targets to lock in gains.'
  }
]

export default function MistakeReplay({ onBack }) {
  const [activeMistake, setActiveMistake] = useState(null)
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [mode, setMode] = useState('REPLAY') // REPLAY or CORRECT
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/mistake-replay/cases')
      .then(res => res.json())
      .then(data => {
        setCases(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setCases(MISTAKES)
        setLoading(false)
      })
  }, [])

  const startReplay = (m) => {
    setActiveMistake(m)
    setStep(0)
    setIsPlaying(true)
    setMode('REPLAY')
  }

  useEffect(() => {
    let interval
    if (isPlaying && activeMistake) {
      interval = setInterval(() => {
        setStep(s => {
          const limit = mode === 'REPLAY' ? activeMistake.mistakeIndex : activeMistake.fullData.length - 1
          if (s >= limit) {
            setIsPlaying(false)
            return s
          }
          return s + 1
        })
      }, 800)
    }
    return () => clearInterval(interval)
  }, [isPlaying, activeMistake, mode])

  if (!activeMistake || !activeMistake.fullData || activeMistake.fullData.length === 0) {
    return (
      <div className="fade-in slide-up p-6">
        <div className="flex items-center gap-4 mb-8">
           <button onClick={onBack} className="back-btn"><ArrowLeft size={20}/></button>
           <h1 className="text-2xl font-bold font-grotesk">Neural Mistake Replay</h1>
        </div>

        {loading ? (
          <div className="py-20 text-center">
             <div className="w-10 h-10 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
             <div className="text-text-dim font-bold animate-pulse">Scanning Behavioral Mistakes...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cases && cases.length > 0 ? cases.map(m => (
              <div key={m.id} className="card p-6 overflow-hidden relative group cursor-pointer" onClick={() => startReplay(m)}>
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   {m.id && m.id.includes('fear') ? <ShieldAlert size={80} /> : <Target size={80} />}
                </div>
                <h3 className="text-xl font-bold font-grotesk mb-1">{m.title}</h3>
                <p className="text-xs text-text-dim mb-6">{m.subtitle}</p>
                <div className="flex items-center gap-3 text-neon-blue font-bold text-sm">
                   <Play size={16} fill="currentColor" /> WATCH ANALYSIS
                </div>
              </div>
            )) : (
              <div className="col-span-2 py-20 text-center text-text-dim">
                No mistakes found in history yet. Continue trading to build your library.
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  const currentPrice = activeMistake.fullData[step] || 0
  const isAtMistake = mode === 'REPLAY' && step === activeMistake.mistakeIndex

  const maxPrice = activeMistake.fullData && activeMistake.fullData.length > 0 
    ? Math.max(...activeMistake.fullData) 
    : 100

  return (
    <div className="fade-in slide-up flex flex-col min-h-full overflow-hidden" style={{ background: 'var(--bg)' }}>
      <div className="p-4 border-b border-white/5 flex items-center justify-between backdrop-blur-xl" style={{ backgroundColor: 'rgba(13, 17, 28, 0.8)' }}>
        <button onClick={() => setActiveMistake(null)} className="flex items-center gap-2 text-text-dim hover:text-white transition-colors">
          <ArrowLeft size={18} /> <span className="text-xs font-bold uppercase tracking-widest">Back to Library</span>
        </button>
        <div className="flex gap-2">
           <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${mode === 'REPLAY' ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-green-500/10 border-green-500/30 text-green-500'}`}>
              {mode} MODE
           </div>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
        <div className="text-center mb-4">
           <h2 className="text-2xl font-bold font-grotesk">{activeMistake.title}</h2>
           <p className="text-sm text-text-dim">{activeMistake.subtitle}</p>
        </div>

        <div className="card p-8 min-h-[300px] flex flex-col relative bg-slate-900/40 border-white/5">
           <div className="absolute top-6 right-8 flex items-center gap-2 text-text-dim">
              <Clock size={14}/> <span className="text-xs font-mono">T-{step}:00</span>
           </div>

           <div className="flex-1 flex items-end gap-3 mb-10 h-40">
              {activeMistake.fullData.map((v, i) => {
                const isVisible = i <= step || mode === 'CORRECT'
                if (!isVisible) return <div key={i} className="flex-1 h-1 bg-white/5 rounded-full" />
                
                const isMistakePoint = i === activeMistake.mistakeIndex
                return (
                  <div key={i} 
                       className={`flex-1 rounded-t-lg transition-all duration-700 relative ${isMistakePoint ? 'bg-red-500' : mode === 'CORRECT' && i > activeMistake.mistakeIndex ? 'bg-neon-blue' : 'bg-white/20'}`}
                       style={{ height: `${(v / maxPrice) * 100}%` }}>
                     {isMistakePoint && (
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce">
                          <AlertCircle size={20} className="text-red-500" />
                       </div>
                     )}
                  </div>
                )
              })}
           </div>

           <div className="text-center mb-6">
              <div className="text-4xl font-bold font-grotesk mb-2">${currentPrice}</div>
              <div className="text-[10px] text-text-dim uppercase tracking-widest font-bold">Market Price Injection</div>
           </div>

           <div className="flex justify-center gap-4">
              <button onClick={() => setIsPlaying(!isPlaying)} className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                {isPlaying ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
              </button>
              <button onClick={() => { setStep(0); setIsPlaying(true); setMode('REPLAY') }} className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                <RotateCcw size={24} />
              </button>
           </div>
        </div>

        {isAtMistake && mode === 'REPLAY' && (
          <div className="card p-6 border-red-500/30 bg-red-500/5 slide-up">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500">
                   <ShieldAlert size={24} />
                </div>
                <div className="font-bold font-grotesk text-red-500 uppercase tracking-widest">Mistake Detected</div>
             </div>
             <p className="text-sm text-white mb-6 leading-relaxed">{activeMistake.reason}</p>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl">
                   <div className="text-[10px] text-text-dim font-bold uppercase mb-2">The Lesson</div>
                   <div className="text-xs text-white">{activeMistake.lesson}</div>
                </div>
                <button 
                  onClick={() => { setMode('CORRECT'); setStep(activeMistake.mistakeIndex); setIsPlaying(true); }}
                  className="p-4 bg-neon-blue/10 border border-neon-blue/30 rounded-2xl flex flex-col items-center justify-center gap-2 group hover:bg-neon-blue/20 transition-all"
                >
                   <Eye size={20} className="text-neon-blue" />
                   <div className="text-[10px] text-neon-blue font-bold uppercase">Watch Correct Path</div>
                </button>
             </div>
          </div>
        )}

        {mode === 'CORRECT' && step >= activeMistake.fullData.length - 1 && (
           <div className="card p-6 border-neon-blue/30 bg-neon-blue/5 animate-bounce-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-neon-blue/20 flex items-center justify-center text-neon-blue">
                   <Brain size={24} />
                </div>
                <div className="font-bold font-grotesk text-neon-blue uppercase tracking-widest">AI Correct Path</div>
             </div>
             <p className="text-sm text-white mb-4 leading-relaxed">{activeMistake.correctApproach}</p>
             <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                   <div className="text-[10px] text-text-dim font-bold uppercase">Opportunity Cost</div>
                   <div className="text-lg font-bold text-neon-green">+$103.00</div>
                </div>
                <Award size={32} className="text-neon-orange" />
             </div>
           </div>
        )}
      </div>
    </div>
  )
}
