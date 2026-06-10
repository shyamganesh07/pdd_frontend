import React, { useState, useEffect } from 'react'
import { Brain, Activity, ShieldAlert, Crosshair, TrendingUp, AlertTriangle, Zap, Target, ChevronLeft, ShieldCheck } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function Psychology({ onBack, onViewReport }) {
   const [data, setData] = useState(null)
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState(null)

   useEffect(() => {
      fetch('/api/psychology')
         .then(res => {
            if (!res.ok) throw new Error('Neural Data Unavailable')
            return res.json()
         })
         .then(d => {
            setData(d)
            setLoading(false)
         })
         .catch((e) => {
            console.error(e)
            setError(e.message)
            setLoading(false)
         })
   }, [])

   if (loading) return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
         <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin" />
         <div className="text-text-dim font-grotesk animate-pulse">Syncing Neural Profiles...</div>
      </div>
   )

   if (error) return (
      <div className="p-8 text-center mt-20">
         <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
         <div className="text-xl font-bold mb-2">Neural Link Failed</div>
         <div className="text-text-dim mb-6">{error}</div>
         <button onClick={() => window.location.reload()} className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10">Retry Connection</button>
      </div>
   )

   if (!data) return null

   return (
      <div className="fade-in slide-up pb-24">
         <div className="page-header" style={{ marginBottom: 20 }}>
            <button onClick={onBack} className="back-btn">
               <ChevronLeft size={20} />
            </button>
            <div className="page-title">Behavioral Psychology OS</div>
            <div style={{ width: 32 }} />
         </div>

          <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px' }}>
            {/* Resolve data properties safely */}
            {(() => {
               const score = data?.discipline_score ?? 100
               const insights = data?.insights ?? 'Your behavioral trading profile is healthy. Continue tracking discipline metrics.'
               const prediction = data?.behavioral_prediction || {
                  overtrading_alert: false,
                  revenge_trade_warning: false,
                  emotional_breakdown_prob: '15%',
                  panic_threshold: 'Normal'
               }
               const heatmap = data?.heatmap || []
               const overtrading = data?.overtrading ?? 'Low'
               const revenge_trading = data?.revenge_trading ?? 'Low'
               const week_range = data?.week_range ?? 'Active Week'

               return (
                  <>
                     {/* Main Status */}
                     <div className="card mb-6 overflow-hidden relative glass-morphism-premium">
                        <div style={{ position: 'absolute', top: -20, right: -20, width: 150, height: 150, background: 'var(--green)', filter: 'blur(60px)', opacity: 0.1 }} />
                        <div className="flex items-center justify-between mb-6">
                           <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                                 <Brain size={24} className="text-green-500" />
                              </div>
                              <div>
                                 <h2 className="text-xl font-bold font-grotesk">Trader Mindset Score</h2>
                                 <p className="text-xs text-text-dim">Overall Behavioral Performance Rating</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <div className="text-3xl font-bold font-grotesk text-green-500">{score}%</div>
                              <div className="text-[10px] text-text-dim uppercase tracking-widest font-bold">Elite Tier</div>
                           </div>
                        </div>

                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex gap-4 items-start mb-4">
                           <Zap size={20} className="text-neon-blue flex-shrink-0 mt-1" />
                           <div className="text-sm leading-relaxed">
                              <strong className="text-neon-blue">AI Behavioral Insight:</strong> {insights}
                           </div>
                        </div>

                        <div className="border-t border-white/5 pt-4 text-[11px] text-text-dim space-y-2">
                          <div>💡 <strong>What it is:</strong> A composite index evaluating your adherence to institutional trading rules.</div>
                          <div>🔧 <strong>How it is calculated:</strong> An average of your historical simulation session scores across entry discipline, execution timing, and capital stability.</div>
                          <div>🎯 <strong>Why it is needed:</strong> Standardizes behavioral metrics to benchmark your trading psychology against elite professional standards.</div>
                        </div>
                     </div>

                     {/* AI BEHAVIORAL PREDICTION */}
                     <div className="section-title mb-4 px-2">AI Behavioral Prediction</div>
                     <div className="grid grid-cols-1 gap-4 mb-6">
                        {/* Overtrading Risk Card */}
                        <div className={`card p-5 space-y-3 ${prediction.overtrading_alert ? 'border-red-500/30 bg-red-500/5' : 'glass-morphism-premium'}`}>
                           <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${prediction.overtrading_alert ? 'bg-red-500/20' : 'bg-green-500/10'}`}>
                                 <Activity size={24} className={prediction.overtrading_alert ? 'text-red-500' : 'text-green-500'} />
                              </div>
                              <div>
                                 <div className="text-[10px] text-text-dim uppercase font-bold">Overtrading Risk</div>
                                 <div className="text-lg font-bold font-grotesk text-white flex items-center gap-2">
                                   {overtrading}
                                   {prediction.overtrading_alert && <span className="text-[9px] px-2 py-0.5 bg-red-500/10 border border-red-500/30 text-red-500 rounded-full font-bold uppercase animate-pulse">Critical Warning</span>}
                                 </div>
                              </div>
                           </div>
                           <div className="border-t border-white/5 pt-3 text-[11px] text-text-dim space-y-1.5">
                             <div>💡 <strong>What it is:</strong> A risk metric monitoring high trading frequency.</div>
                             <div>🔧 <strong>How it is calculated:</strong> Low (&lt;2 sessions/day), Moderate (3-5 sessions/day), or High (&gt;5 sessions/day) based on completed sessions in the last 24 hours.</div>
                             <div>🎯 <strong>Why it is needed:</strong> Prevents fee bleed, cognitive fatigue, and high capital exposure.</div>
                           </div>
                        </div>

                        {/* Revenge Probability Card */}
                        <div className={`card p-5 space-y-3 ${prediction.revenge_trade_warning ? 'border-red-500/30 bg-red-500/5' : 'glass-morphism-premium'}`}>
                           <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${prediction.revenge_trade_warning ? 'bg-red-500/20' : 'bg-green-500/10'}`}>
                                 <ShieldAlert size={24} className={prediction.revenge_trade_warning ? 'text-red-500' : 'text-green-500'} />
                              </div>
                              <div>
                                 <div className="text-[10px] text-text-dim uppercase font-bold">Revenge Trading Probability</div>
                                 <div className="text-lg font-bold font-grotesk text-white flex items-center gap-2">
                                   {revenge_trading} Risk
                                   {prediction.revenge_trade_warning && <span className="text-[9px] px-2 py-0.5 bg-red-500/10 border border-red-500/30 text-red-500 rounded-full font-bold uppercase animate-pulse">Shield Active</span>}
                                 </div>
                              </div>
                           </div>
                           <div className="border-t border-white/5 pt-3 text-[11px] text-text-dim space-y-1.5">
                             <div>💡 <strong>What it is:</strong> Indication of emotional, anger-based trading to recoup losses.</div>
                             <div>🔧 <strong>How it is calculated:</strong> Flags "High Risk" if the time elapsed between starting consecutive simulation sessions is less than 10 minutes.</div>
                             <div>🎯 <strong>Why it is needed:</strong> Revenge trading causes hasty, uncalculated entries, compounding loss spirals.</div>
                           </div>
                        </div>
                     </div>

                     {/* Neural Predictions */}
                     <div className="card mb-6 glass-morphism-premium space-y-6">
                        <div className="flex items-center gap-3">
                           <ShieldCheck size={20} className="text-neon-blue" />
                           <h3 className="font-bold font-grotesk">Neural Breakdown Forecast</h3>
                        </div>
                        
                        <div className="space-y-6 border-b border-white/5 pb-4">
                           {/* Emotional Breakdown Probability Slider */}
                           <div>
                              <div className="flex justify-between text-xs mb-2">
                                 <span className="text-text-dim">Emotional Breakdown Probability</span>
                                 <span className={parseInt(prediction.emotional_breakdown_prob || '0') > 50 ? 'text-red-500 font-bold' : 'text-green-500 font-bold'}>
                                    {prediction.emotional_breakdown_prob}
                                 </span>
                              </div>
                              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                 <div
                                    className={`h-full ${parseInt(prediction.emotional_breakdown_prob || '0') > 50 ? 'bg-red-500' : 'bg-green-500'}`}
                                    style={{ width: prediction.emotional_breakdown_prob }}
                                 />
                              </div>
                           </div>
                           
                           {/* Panic Response Threshold Slider */}
                           <div>
                              <div className="flex justify-between text-xs mb-2">
                                 <span className="text-text-dim">Panic Response Threshold</span>
                                 <span className={prediction.panic_threshold === 'Critical' ? 'text-red-500 font-bold' : 'text-green-500 font-bold'}>
                                    {prediction.panic_threshold}
                                 </span>
                              </div>
                              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                 <div
                                    className={`h-full ${prediction.panic_threshold === 'Critical' ? 'bg-red-500' : 'bg-green-500'}`}
                                    style={{ width: prediction.panic_threshold === 'Critical' ? '90%' : '20%' }}
                                 />
                              </div>
                           </div>
                        </div>

                        <div className="text-[11px] text-text-dim space-y-4">
                           <div className="space-y-1.5">
                              <div className="text-xs text-white font-bold">Emotional Breakdown Probability</div>
                              <div>💡 <strong>What it is:</strong> Likelihood of trading off-plan due to stress accumulation.</div>
                              <div>🔧 <strong>How it is calculated:</strong> Scales directly with overtrading frequency (Low: 15%, Moderate: 45%, High: 75%).</div>
                              <div>🎯 <strong>Why it is needed:</strong> Flags cognitive fatigue before it impairs your judgment.</div>
                           </div>
                           <div className="space-y-1.5 border-t border-white/5 pt-3">
                              <div className="text-xs text-white font-bold">Panic Response Threshold</div>
                              <div>💡 <strong>What it is:</strong> Vulnerability to erratic panic selling under market pressure.</div>
                              <div>🔧 <strong>How it is calculated:</strong> Evaluated as 'Critical' if overtrading risk is High, indicating an unstable mindset.</div>
                              <div>🎯 <strong>Why it is needed:</strong> Alerts you when your stress tolerance is compromised, advising you to take a break.</div>
                           </div>
                        </div>
                     </div>

                     {/* Emotional Heatmap */}
                     <div className="card p-6 glass-morphism-premium space-y-6">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2">
                              <TrendingUp size={18} className="text-neon-blue" />
                              <h3 className="font-bold font-grotesk">Weekly Emotional Stability</h3>
                           </div>
                           <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-text-dim font-bold">{week_range}</span>
                        </div>
                        <div className="h-48">
                           <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={heatmap}>
                                 <XAxis dataKey="day" stroke="#4B5563" fontSize={10} axisLine={false} tickLine={false} />
                                 <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={{ backgroundColor: '#0d1220', border: '1px solid #1f2937', borderRadius: '12px' }} />
                                 <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                                    {heatmap.map((entry, index) => (
                                       <Cell 
                                          key={`cell-${index}`} 
                                          fill={entry.score === 0 ? 'rgba(255,255,255,0.07)' : entry.score > 80 ? '#22C55E' : entry.score > 70 ? '#ff8c00' : '#ef4444'} 
                                       />
                                    ))}
                                 </Bar>
                              </BarChart>
                           </ResponsiveContainer>
                        </div>

                        {/* Dynamic Breakdown List */}
                        <div className="border-t border-white/5 pt-4 space-y-4">
                           <h4 className="text-xs font-bold uppercase tracking-wider text-text-dim">Daily Behavioral Breakdown</h4>
                           <div className="space-y-3">
                              {heatmap.map((dayData, index) => {
                                 const scans = dayData.scans || []
                                 const sims = dayData.sims || []
                                 const hasActivity = scans.length > 0 || sims.length > 0;
                                 return (
                                    <div key={index} className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-2 text-left">
                                       <div className="flex justify-between items-center">
                                          <span className="text-xs font-bold text-white">{dayData.day} ({dayData.date})</span>
                                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                             dayData.score === 0 
                                                ? 'bg-white/5 text-text-dim' 
                                                : dayData.score > 80 
                                                   ? 'bg-green-500/10 text-green-500' 
                                                   : dayData.score > 70 
                                                      ? 'bg-amber-500/10 text-amber-500' 
                                                      : 'bg-red-500/10 text-red-500'
                                          }`}>
                                             {dayData.score === 0 ? 'No Activity' : `Score: ${dayData.score}%`}
                                          </span>
                                       </div>

                                       {hasActivity ? (
                                          <div className="text-[11px] space-y-1.5 pl-1">
                                             {scans.length > 0 && (
                                                <div className="text-text-dim flex items-start gap-1.5">
                                                   <span className="text-neon-blue">🔍</span>
                                                   <span><strong>Smart K-Scans:</strong> {scans.join(', ')}</span>
                                                </div>
                                             )}
                                             {sims.length > 0 && (
                                                <div className="space-y-1">
                                                   {sims.map((sim, sIdx) => {
                                                      const netReturn = sim.net_return ?? 0
                                                      const simScores = sim.scores || { discipline: 100, execution: 100, stability: 100 }
                                                      return (
                                                         <div key={sIdx} className="text-text-dim flex flex-col pl-4 border-l border-white/10">
                                                            <div className="text-white flex justify-between">
                                                               <span>🎮 {sim.name || 'Demo Trade'} ({sim.symbol || 'MOCK'})</span>
                                                               <span className={netReturn >= 0 ? 'text-green-500' : 'text-red-500'}>
                                                                  {netReturn >= 0 ? '+' : ''}₹{parseFloat(netReturn).toFixed(2)}
                                                               </span>
                                                            </div>
                                                            <div className="text-[10px] text-text-dim mt-0.5">
                                                               Discipline: {simScores.discipline ?? 100}% | Execution: {simScores.execution ?? 100}% | Stability: {simScores.stability ?? 100}%
                                                            </div>
                                                         </div>
                                                      )
                                                   })}
                                                </div>
                                             )}
                                          </div>
                                       ) : (
                                          <div className="text-[11px] text-text-dim/60 italic pl-1">
                                             💤 No simulation or scanning sessions recorded.
                                          </div>
                                       )}
                                    </div>
                                 );
                              })}
                           </div>
                        </div>
                     </div>

                     <div className="mt-8 p-4 bg-neon-blue/5 border border-neon-blue/20 rounded-2xl text-center">
                        <p className="text-xs text-text-dim mb-3">Your Behavioral Profile is synced with <strong>AI Risk Shield</strong>.</p>
                        <button onClick={onViewReport} className="text-xs font-bold text-neon-blue hover:underline">VIEW FULL INSTITUTIONAL REPORT →</button>
                     </div>
                  </>
               )
            })()}
          </div>
       </div>
    )
}

