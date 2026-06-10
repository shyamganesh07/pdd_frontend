import React, { useState, useEffect } from 'react'
import { Trophy, Star, Shield, Cpu, Zap, ChevronLeft, Lock } from 'lucide-react'

export default function Evolution({ onBack }) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const userProfile = JSON.parse(localStorage.getItem('user_profile') || '{}')
    const email = userProfile?.email || ''
    fetch(`/api/evolution?email=${encodeURIComponent(email)}`)
      .then(res => {
        if (!res.ok) throw new Error('Evolution Engine Offline')
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
       <div className="text-text-dim font-grotesk animate-pulse">Calculating User Evolution...</div>
    </div>
  )

  if (error) return (
    <div className="p-8 text-center mt-20">
       <Trophy size={48} className="mx-auto text-red-500 mb-4" />
       <div className="text-xl font-bold mb-2">Evolution Sync Failed</div>
       <div className="text-text-dim mb-6">{error}</div>
       <button onClick={() => window.location.reload()} className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10">Retry DNA Scan</button>
    </div>
  )

  if (!data) return null

  const skills = [
    { name: 'Risk Management', val: data.skills.risk_management, icon: Shield, color: 'text-red-500' },
    { name: 'Technical Analysis', val: data.skills.technical_analysis, icon: Cpu, color: 'text-blue-500' },
    { name: 'Emotional Control', val: data.skills.emotional_control, icon: Zap, color: 'text-yellow-500' },
    { name: 'Pattern Recognition', val: data.skills.pattern_recognition, icon: Star, color: 'text-green-500' },
  ]

  const levels = ["Beginner", "Disciplined Trader", "Quant Analyst", "Institutional Trader", "Elite Risk Master"]

  return (
    <div className="fade-in slide-up pb-24">
      <div className="page-header" style={{ marginBottom: 20 }}>
        <button onClick={onBack} className="back-btn">
          <ChevronLeft size={20} />
        </button>
        <div className="page-title">Trader Evolution Hub</div>
        <div style={{ width: 32 }} />
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px' }}>
        <div className="card mb-6 glass-morphism-premium overflow-hidden relative">
           <div className="absolute top-0 right-0 p-4">
              <div className="text-[10px] text-text-dim uppercase font-bold text-right">Global Rank</div>
              <div className="text-xl font-bold font-grotesk text-neon-blue">{data.rank}</div>
           </div>

           <div className="flex flex-col items-center py-8">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/20 relative">
                 <Trophy size={48} className="text-white" />
                 <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-bg border-4 border-card-solid flex items-center justify-center text-xs font-bold">
                    {levels.indexOf(data.current_level) + 1}
                 </div>
              </div>
              
              <h2 className="text-2xl font-bold font-grotesk mb-2">{data.current_level}</h2>
              <p className="text-sm text-text-dim mb-6">Level {levels.indexOf(data.current_level) + 1} System Access</p>
              
              <div className="w-full max-w-sm">
                 <div className="flex justify-between text-[10px] font-bold uppercase mb-2">
                    <span className="text-text-dim">Experience Points</span>
                    <span>{data.xp} / {data.next_level_xp} XP</span>
                 </div>
                 <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${(data.xp / data.next_level_xp) * 100}%` }} />
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
           {skills.map((skill, i) => (
              <div key={i} className="card p-5 glass-morphism-premium">
                 <div className="flex items-center gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center`}>
                       <skill.icon size={18} className={skill.color} />
                    </div>
                    <span className="text-[10px] font-bold uppercase text-text-dim">{skill.name}</span>
                 </div>
                 <div className="text-xl font-bold font-grotesk mb-2">{skill.val}%</div>
                 <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${skill.color.replace('text', 'bg')}`} style={{ width: `${skill.val}%` }} />
                 </div>
              </div>
           ))}
        </div>

        {/* ── REAL LEADERBOARD CARD ── */}
        {data.leaderboard && data.leaderboard.length > 0 && (
          <div className="card mb-6 glass-morphism-premium">
             <div className="flex justify-between items-center mb-6">
                <div className="section-title">Global Leaderboard</div>
                <div className="text-[10px] bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2 py-0.5 rounded font-bold uppercase font-grotesk tracking-wide">
                   REAL-TIME SYNCED
                </div>
             </div>
             
             <div className="flex flex-col gap-3">
                {data.leaderboard.map((trader, i) => {
                   const isGold = trader.rank === 1
                   const isSilver = trader.rank === 2
                   const isBronze = trader.rank === 3
                   
                   return (
                      <div 
                         key={i} 
                         className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                            trader.is_current 
                               ? 'bg-blue-500/10 border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                               : 'bg-white/3 border-white/5 hover:border-white/10'
                         }`}
                      >
                         {/* Rank Position Badge */}
                         <div className="w-8 h-8 rounded-lg flex items-center justify-center font-grotesk font-bold text-sm" style={{
                            background: isGold ? 'linear-gradient(135deg, #F59E0B, #D97706)' :
                                        isSilver ? 'linear-gradient(135deg, #94A3B8, #64748B)' :
                                        isBronze ? 'linear-gradient(135deg, #B45309, #78350F)' :
                                        'rgba(255,255,255,0.03)',
                            color: isGold || isSilver || isBronze ? 'white' : '#94A3B8'
                         }}>
                            {trader.rank}
                         </div>
                         
                         {/* Avatar */}
                         <img 
                            src={trader.pic} 
                            alt={trader.name} 
                            className="w-9 h-9 rounded-full border border-white/10 bg-white/5"
                         />
                         
                         {/* Name & Title */}
                         <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                               <span className="font-bold text-sm truncate font-grotesk">{trader.name}</span>
                               {trader.is_current && (
                                  <span className="text-[8px] bg-blue-500 text-white font-bold px-1.5 py-0.5 rounded font-grotesk tracking-wide">YOU</span>
                               )}
                            </div>
                            <div className="text-[10px] text-text-dim uppercase font-bold tracking-wider">{trader.level}</div>
                         </div>
                         
                         {/* Experience */}
                         <div className="text-right">
                            <div className="text-xs font-bold text-neon-blue font-grotesk">{trader.xp} XP</div>
                            <div className="text-[8px] text-text-dim font-medium uppercase font-grotesk">VERIFIED</div>
                         </div>
                      </div>
                   )
                })}
             </div>
          </div>
        )}

        <div className="card glass-morphism-premium">
           <div className="section-title mb-6">Evolution Path</div>
           <div className="space-y-6">
              {levels.map((lvl, i) => {
                 const isUnlocked = data.unlocked_features.includes(lvl)
                 return (
                    <div key={lvl} className={`flex items-center gap-4 ${isUnlocked ? 'opacity-100' : 'opacity-40'}`}>
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isUnlocked ? 'bg-blue-500 text-white' : 'bg-white/5 text-text-dim'}`}>
                          {isUnlocked ? <Zap size={18} /> : <Lock size={18} />}
                       </div>
                       <div className="flex-1">
                          <div className="font-bold text-sm">{lvl}</div>
                          <div className="text-[10px] text-text-dim">
                             {isUnlocked ? 'Features fully unlocked' : `Unlock at ${5000 * i} XP`}
                          </div>
                       </div>
                       {isUnlocked && <div className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded font-bold uppercase">ACTIVE</div>}
                    </div>
                 )
              })}
           </div>
        </div>
      </div>
    </div>
  )
}
