import React, { useState, useEffect } from 'react'
import { Users, Twitter, Youtube, Newspaper, TrendingUp, Zap, ChevronLeft, MessageCircle } from 'lucide-react'

export default function CrowdPsychology({ onBack }) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/crowd-psychology')
      .then(res => {
        if (!res.ok) throw new Error('Crowd Data Feed Offline')
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
       <div className="text-text-dim font-grotesk animate-pulse">Scanning Social Neurons...</div>
    </div>
  )

  if (error) return (
    <div className="p-8 text-center mt-20">
       <Users size={48} className="mx-auto text-red-500 mb-4" />
       <div className="text-xl font-bold mb-2">Crowd Link Severed</div>
       <div className="text-text-dim mb-6">{error}</div>
       <button onClick={() => window.location.reload()} className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10">Re-sync Social Feed</button>
    </div>
  )

  if (!data) return null

  return (
    <div className="fade-in slide-up pb-24">
      <div className="page-header" style={{ marginBottom: 20 }}>
        <button onClick={onBack} className="back-btn">
          <ChevronLeft size={20} />
        </button>
        <div className="page-title">Crowd Psychology Engine</div>
        <div style={{ width: 32 }} />
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px' }}>
        <div className="card mb-6 glass-morphism-premium text-center py-10 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          
          <div className="text-sm text-text-dim uppercase tracking-widest font-bold mb-4">Market Hype Score</div>
          <div className="relative inline-block mb-4">
             <svg width="240" height="240" viewBox="0 0 100 100">
               <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
               <circle 
                 cx="50" cy="50" r="45" fill="none" 
                 stroke="var(--neon-blue)" strokeWidth="8" 
                 strokeDasharray={`${data.hype_score * 2.82} 282`}
                 strokeLinecap="round"
                 transform="rotate(-90 50 50)"
                 className="probability-glow"
                 style={{ '--glow-color': 'var(--neon-blue)' }}
               />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
               <div className="text-5xl font-bold font-grotesk">{data.hype_score}</div>
               <div className="text-[10px] text-text-dim uppercase font-bold">{data.retail_mood} Mood</div>
             </div>
          </div>
          
          <div className="flex justify-center gap-8 mt-6">
             <div>
                <div className="text-2xl font-bold font-grotesk text-red-500">{data.panic_intensity}%</div>
                <div className="text-[10px] text-text-dim uppercase tracking-wider font-bold">Panic Intensity</div>
             </div>
             <div className="w-px h-10 bg-white/10" />
             <div>
                <div className="text-2xl font-bold font-grotesk text-blue-500">{data.speculative_activity}</div>
                <div className="text-[10px] text-text-dim uppercase tracking-wider font-bold">Speculative Activity</div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="card p-5 glass-morphism-premium">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <MessageCircle size={18} className="text-orange-500" />
                 </div>
                 <span className="font-bold font-grotesk text-sm">Reddit Sentiment</span>
              </div>
              <div className="flex justify-between items-end">
                 <div className="text-lg font-bold">{data.platforms.reddit.sentiment}</div>
                 <div className="text-[10px] px-2 py-0.5 bg-orange-500/10 text-orange-500 rounded uppercase font-bold">{data.platforms.reddit.volume} Vol</div>
              </div>
           </div>

           <div className="card p-5 glass-morphism-premium">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-8 h-8 rounded-lg bg-blue-400/10 flex items-center justify-center">
                    <Twitter size={18} className="text-blue-400" />
                 </div>
                 <span className="font-bold font-grotesk text-sm">X / Twitter</span>
              </div>
              <div className="flex justify-between items-end">
                 <div className="text-lg font-bold">{data.platforms.twitter.sentiment}</div>
                 <div className="text-[10px] px-2 py-0.5 bg-blue-400/10 text-blue-400 rounded uppercase font-bold">{data.platforms.twitter.volume} Vol</div>
              </div>
           </div>

           <div className="card p-5 glass-morphism-premium">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <Youtube size={18} className="text-red-500" />
                 </div>
                 <span className="font-bold font-grotesk text-sm">YouTube Crypto</span>
              </div>
              <div className="flex justify-between items-end">
                 <div className="text-lg font-bold">{data.platforms.youtube.sentiment}</div>
                 <div className="text-[10px] px-2 py-0.5 bg-red-500/10 text-red-500 rounded uppercase font-bold">{data.platforms.youtube.volume} Vol</div>
              </div>
           </div>

           <div className="card p-5 glass-morphism-premium">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Newspaper size={18} className="text-green-500" />
                 </div>
                 <span className="font-bold font-grotesk text-sm">Finance News</span>
              </div>
              <div className="flex justify-between items-end">
                 <div className="text-lg font-bold">{data.platforms.news.sentiment}</div>
                 <div className="text-[10px] px-2 py-0.5 bg-green-500/10 text-green-500 rounded uppercase font-bold">{data.platforms.news.volume} Vol</div>
              </div>
           </div>
        </div>

        {/* Social Buzz & Ticker Velocity */}
        <div className="card glass-morphism-premium mb-6">
           <div className="flex items-center gap-2 mb-4">
              <Zap size={18} className="text-neon-blue animate-pulse" />
              <h3 className="font-bold font-grotesk">Social Buzz & Ticker Velocity</h3>
           </div>
           
           <div className="space-y-4 text-xs">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                 <h4 className="font-bold text-white mb-3 flex items-center gap-1.5">
                    Trending retail assets by social mention velocity:
                 </h4>
                 <div className="space-y-2">
                    {data.trending_tickers && data.trending_tickers.map((ticker, idx) => (
                       <div key={idx} className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/5">
                          <div className="flex items-center gap-2">
                             <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 font-bold flex items-center justify-center text-[10px]">#{idx+1}</span>
                             <span className="font-bold text-white text-sm">{ticker.symbol}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs font-mono">
                             <span className="text-text-dim">{ticker.mentions} discussions</span>
                             <span className={ticker.change_pct.startsWith('+') ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>{ticker.change_pct}</span>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-left">
                 <h4 className="font-bold text-white mb-3 flex items-center gap-1.5">
                    🗣️ Real-time Social Insights:
                 </h4>
                 <div className="space-y-2">
                    {data.viral_tweets && data.viral_tweets.map((tweet, idx) => (
                       <div key={idx} className="p-2.5 bg-white/5 rounded-lg border border-white/5 text-text-dim text-[11px] leading-relaxed">
                          {tweet}
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        <div className="card glass-morphism-premium mb-6">
           <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-neon-blue" />
              <h3 className="font-bold font-grotesk">Social Hype vs Hard Flows</h3>
           </div>
           <div className="space-y-4">
              <div>
                 <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-dim">Retail Position</span>
                    <span className="text-neon-blue font-bold">82% LONG</span>
                 </div>
                 <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-neon-blue" style={{ width: '82%' }} />
                 </div>
              </div>
              <div>
                 <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-dim">Institutional Flow</span>
                    <span className="text-neon-purple font-bold">Diverging (Selling)</span>
                 </div>
                 <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-neon-purple" style={{ width: '35%' }} />
                 </div>
              </div>
           </div>
        </div>

        <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center gap-4">
           <Zap size={24} className="text-red-500 flex-shrink-0" />
           <div className="text-xs leading-relaxed text-left">
              <strong className="text-red-500">Retail Capitulation Risk:</strong> Crowd sentiment is reaching peak euphoria while volumes on main exchanges are thinning. High probability of a "Bull Trap" in the next 48 hours.
           </div>
        </div>
      </div>
    </div>
  )
}
