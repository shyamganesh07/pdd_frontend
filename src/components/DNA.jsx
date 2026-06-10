import React, { useState, useEffect } from 'react'
import { Activity, ShieldAlert, Target, BrainCircuit, Clock, Zap, ArrowLeft, AlertTriangle } from 'lucide-react'

/* Behavioral DNA Sequencing Module */
export default function DNA({ onBack }) {
  const [dna, setDna] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/trader-dna')
      .then(res => {
        if (!res.ok) throw new Error('DNA Sequencing Offline')
        return res.json()
      })
      .then(data => { setDna(data); setLoading(false) })
      .catch((e) => {
        console.error(e)
        setError(e.message)
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
       <div className="w-12 h-12 border-4 border-neon-purple border-t-transparent rounded-full animate-spin" />
       <div className="text-text-dim font-grotesk animate-pulse">Sequencing Trader DNA...</div>
    </div>
  )

  if (error) return (
    <div className="p-8 text-center mt-20">
       <BrainCircuit size={48} className="mx-auto text-red-500 mb-4" />
       <div className="text-xl font-bold mb-2">DNA Link Severed</div>
       <div className="text-text-dim mb-6">{error}</div>
       <button onClick={() => window.location.reload()} className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10">Retry Sequencing</button>
    </div>
  )

  if (!dna) return null

  return (
    <div className="fade-in slide-up pb-24">
      <div className="page-header" style={{ marginBottom: 20 }}>
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={16} color="#94A3B8" />
        </button>
        <div className="page-title">Trader DNA</div>
        <div style={{ width: 32 }} />
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center shadow-lg shadow-neon-blue/20">
            <BrainCircuit size={20} color="white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-grotesk">Trader DNA Engine</h2>
              <span className="text-[8px] bg-neon-blue/20 text-neon-blue px-2 py-0.5 rounded border border-neon-blue/30 font-bold uppercase tracking-widest">Analysis-Based</span>
            </div>
            <p className="text-xs text-text-dim">Profiling your selection behavior & psychological patterns from history</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="holo-card flex flex-col items-center text-center justify-center p-6">
            <div className="text-xs text-text-dim uppercase tracking-wider font-semibold mb-2">Personality Type</div>
            <div className="text-2xl font-bold font-grotesk text-neon-blue mb-4">{dna.personality_type}</div>
            <div className="flex items-center gap-2 text-sm bg-neon-blue/10 px-4 py-2 rounded-lg border border-neon-blue/20">
              <ShieldAlert size={16} className="text-neon-blue" />
              <span>Behavioral Strength: <strong className="text-white">{dna.behavioral_strength_score}/100</strong></span>
            </div>
          </div>
          
          <div className="card flex flex-col gap-4">
            <h3 className="font-bold font-grotesk text-sm text-text-dim flex items-center gap-2">
              <Target size={16} /> Profitable Parameters
            </h3>
            <div className="flex flex-col gap-2 bg-card2 p-3 rounded-xl border border-border">
              <div className="flex justify-between items-center">
                <span className="text-xs text-text-dim flex items-center gap-2"><Clock size={14}/> Best Hours</span>
                <span className="text-sm font-bold font-grotesk text-neon-green">{dna.best_hours}</span>
              </div>
              {dna.best_hours_rationale && (
                <div className="text-[10px] text-text-dim border-t border-white/5 pt-2 mt-1 leading-relaxed">
                  <span className="font-semibold text-white">How it is predicted: </span>
                  {dna.best_hours_rationale}
                </div>
              )}
            </div>
            <div className="flex justify-between items-center bg-card2 p-3 rounded-xl border border-border">
              <span className="text-xs text-text-dim flex items-center gap-2"><Zap size={14}/> Top Setups</span>
              <div className="flex gap-2">
                {dna.profitable_setups.map((s,i) => (
                  <span key={i} className="text-[10px] bg-neon-green/10 text-neon-green px-2 py-1 rounded-md border border-neon-green/20">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-bold font-grotesk text-sm mb-1">Predictive Behavioral Pitfalls</h3>
          <p className="text-xs text-text-dim">Subconscious patterns, fatigue triggers, and consistency metrics scanned from trade logs.</p>
        </div>
        <div className="card border-neon-orange/20 bg-neon-orange/5 mb-6">
           <div className="flex items-center gap-3 mb-4">
             <div className="w-8 h-8 rounded-full bg-neon-orange/20 flex items-center justify-center">
                <AlertTriangle size={16} className="text-neon-orange" />
             </div>
             <div className="font-bold font-grotesk text-neon-orange">AI Forecast: High Risk Patterns</div>
           </div>
            <div className="flex flex-col gap-3">
               {dna.behavioral_insights && dna.behavioral_insights.map((insight, idx) => (
                 <div key={idx} className="flex items-start gap-3 p-3 bg-black/20 rounded-xl">
                    <div className="text-xl">{insight.includes('Time') ? '🕰️' : '📉'}</div>
                    <div className="text-xs leading-relaxed">
                      {insight}
                    </div>
                 </div>
               ))}
               {!dna.behavioral_insights && (
                 <div className="text-xs text-text-dim text-center py-4">No behavioral anomalies detected.</div>
               )}
            </div>
        </div>

        <div className="mb-4">
          <h3 className="font-bold font-grotesk text-sm mb-1">Psychological Weakness Map</h3>
          <p className="text-xs text-text-dim">Diagnostic metrics profiling your risk discipline and tendency to trade emotionally.</p>
        </div>
        <div className="card flex flex-col gap-3">
          {dna.emotional_weaknesses.map((w,i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
              <span className="text-sm text-red-400 font-semibold">{w}</span>
              <ShieldAlert size={16} className="text-red-500" />
            </div>
          ))}
          <div className="grid grid-cols-3 gap-3 mt-2">
             <div className="bg-card2 p-3 rounded-xl border border-border text-center">
               <div className="text-[10px] text-text-dim uppercase mb-1">Revenge Prob</div>
               <div className="font-bold font-grotesk text-neon-orange">{dna.revenge_trade_prob}</div>
             </div>
             <div className="bg-card2 p-3 rounded-xl border border-border text-center">
               <div className="text-[10px] text-text-dim uppercase mb-1">Discipline</div>
               <div className="font-bold font-grotesk text-neon-green">{dna.discipline_consistency}</div>
             </div>
             <div className="bg-card2 p-3 rounded-xl border border-border text-center">
               <div className="text-[10px] text-text-dim uppercase mb-1">Vol Tolerance</div>
               <div className="font-bold font-grotesk text-neon-purple">{dna.volatility_tolerance}</div>
             </div>
          </div>
        </div>

        {/* Methodology & Learning Hub */}
        <div className="card glass-morphism-premium mt-6">
          <div className="flex items-center gap-2 mb-4">
            <BrainCircuit size={18} className="text-blue-400" />
            <h3 className="font-bold font-grotesk text-white">Trader DNA Methodology Hub</h3>
          </div>
          <p className="text-xs text-text-dim mb-6 leading-relaxed">
            This module operates as a diagnostic behavioral analyzer. By sequencing historical data, it identifies cognitive biases and helps you build professional risk habits. Read below to understand how the metrics are calculated:
          </p>

          <div className="space-y-6">
            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
              <div className="text-xs font-bold text-blue-400 mb-2 font-grotesk flex items-center gap-1.5">
                <ShieldAlert size={14} /> Behavioral Strength & Personality Type
              </div>
              <p className="text-xs text-text-dim leading-relaxed mb-2">
                <strong>How it's calculated:</strong> The system audits your average Risk-to-Reward ratio and trading frequency to map your archetype:
                <span className="text-white font-semibold"> Calculated Aggressor</span> (&gt; 2.0 R:R), 
                <span className="text-white font-semibold"> Systematic Scalper</span> (&gt; 10 trades), or 
                <span className="text-white font-semibold"> Disciplined Investor</span>. The Strength score is derived from your Stop-Loss execution discipline.
              </p>
              <p className="text-xs text-text-dim leading-relaxed">
                <strong>Why we use it:</strong> Encourages matching your strategic approach with your baseline emotional tolerance.
              </p>
            </div>

            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
              <div className="text-xs font-bold text-orange-400 mb-2 font-grotesk flex items-center gap-1.5">
                <AlertTriangle size={14} /> Predictive Behavioral Pitfalls (AI Forecast)
              </div>
              <p className="text-xs text-text-dim leading-relaxed mb-2">
                <strong>How it's calculated:</strong> We map your entry times and outcomes to detect fatigue cycles (e.g. emotional trading late in the day) and volume anomalies.
              </p>
              <p className="text-xs text-text-dim leading-relaxed">
                <strong>Why we use it:</strong> Enables you to recognize self-sabotaging patterns before they affect your capital.
              </p>
            </div>

            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
              <div className="text-xs font-bold text-red-400 mb-2 font-grotesk flex items-center gap-1.5">
                <Activity size={14} /> Psychological Weakness Map
              </div>
              <div className="space-y-2 text-xs text-text-dim">
                <div>
                  <strong className="text-white">Revenge Trade Prob:</strong> The mathematical likelihood that a losing trade triggers impulsive double-down sizing (computed as an inverse of your Stop-Loss Discipline).
                </div>
                <div>
                  <strong className="text-white">Discipline Consistency:</strong> Maps whether rule-adherence remains high (&gt;80 score) or declines under drawdown.
                </div>
                <div>
                  <strong className="text-white">Vol Tolerance:</strong> Measures your capacity to remain in volatile trades without early exit panics (derived from R:R volatility).
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
