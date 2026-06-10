import React, { useState, useEffect } from 'react'
import { Globe, Radar, Activity, Zap, TrendingUp, AlertTriangle, ArrowLeft, BrainCircuit, ExternalLink } from 'lucide-react'

export default function Intelligence({ onBack }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/market-personality')
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8 text-center text-text-dim">Analyzing Global Market Personality...</div>
  if (!data) return null

  return (
    <div className="fade-in slide-up pb-24 text-left">
      <div className="page-header" style={{ marginBottom: 20 }}>
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={16} color="#94A3B8" />
        </button>
        <div className="page-title">Market Intelligence Dashboard</div>
        <div style={{ width: 32 }} />
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px' }} className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-green flex items-center justify-center shadow-lg shadow-neon-green/20">
            <Globe size={20} color="white" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-grotesk">Market Intelligence</h2>
            <p className="text-xs text-text-dim">Institutional Order Flow, Market Regimes & Dark Pools</p>
          </div>
        </div>

        {/* Market Consciousness Engine */}
        <div className="card border-neon-blue/20 bg-neon-blue/5 overflow-hidden relative">
          <div style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', background:'radial-gradient(circle at top right, rgba(61,101,244,0.1), transparent)', pointerEvents:'none' }} />
          <div className="flex items-center gap-3 mb-3">
             <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center">
                <BrainCircuit size={16} className="text-neon-blue" />
             </div>
             <h3 className="text-neon-blue font-bold font-grotesk text-sm uppercase tracking-wider">Market Consciousness Engine</h3>
          </div>
          <p className="text-lg font-medium leading-relaxed italic text-white/90">
             "{data.commentary}"
          </p>
          <div className="mt-4 flex gap-4 text-[10px] text-text-dim uppercase font-bold tracking-widest">
             <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-neon-green rounded-full"></span> Regime: {data.market_regime}</span>
             <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-neon-orange rounded-full"></span> Inst Action: {data.smart_money_aggression}</span>
          </div>
        </div>

        {/* Real News Feed: Institutional Market Catalysts */}
        <div className="card glass-morphism-premium space-y-4">
           <div className="flex items-center gap-2">
              <Globe size={18} className="text-neon-blue" />
              <h3 className="font-bold font-grotesk text-sm">Institutional Market Catalysts</h3>
           </div>
           <div className="p-3.5 bg-blue-500/5 rounded-xl border border-blue-500/10 text-xs space-y-1.5">
              <div className="font-bold text-white">👶 Beginner Guide: News Feed Proof</div>
              <div className="text-[10px] text-text-dim leading-relaxed">
                 <div><strong>When calculated:</strong> Refreshed dynamically on page load.</div>
                 <div><strong>Where dataset is from:</strong> Direct real-time feed from Yahoo Finance RSS index.</div>
                 <div><strong>How it works:</strong> Returns breaking headlines with direct URL links. Click <strong>Verify Source ↗</strong> to view the real-time proof.</div>
              </div>
           </div>
           <div className="space-y-3">
              {data.real_news && data.real_news.map((item, idx) => (
                 <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-2">
                    <div className="flex justify-between items-start gap-4">
                       <span className="text-xs font-bold text-white leading-snug">{item.title}</span>
                       <span className="text-[9px] text-text-dim whitespace-nowrap bg-white/5 px-2 py-0.5 rounded font-mono">{item.time}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                       <span className="text-text-dim">Publisher: <strong>{item.publisher}</strong></span>
                       <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-neon-blue font-bold hover:underline flex items-center gap-1 font-mono"
                       >
                          Verify Source ↗
                       </a>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* 2-Column Dashboard grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {/* Column 1: Market Personality Engine */}
          <div className="card flex flex-col gap-4 glass-morphism-premium">
            <h3 className="font-bold font-grotesk text-sm flex items-center gap-2 text-text-dim">
              <Activity size={16} /> Market Personality Engine
            </h3>
            <div className="bg-card2 p-4 rounded-xl border border-border text-center">
              <div className="text-xs text-text-dim uppercase tracking-wider mb-2">Current Mood</div>
              <div className="text-xl font-bold font-grotesk text-neon-blue">{data.market_mood}</div>
            </div>
            <div className="flex justify-between items-center bg-card2 p-3 rounded-xl border border-border">
              <span className="text-xs text-text-dim">Retail FOMO Score</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-neon-orange" style={{ width: `${data.retail_fomo_score}%` }}></div>
                </div>
                <span className="text-xs font-bold">{data.retail_fomo_score}</span>
              </div>
            </div>
            <div className="flex justify-between items-center bg-card2 p-3 rounded-xl border border-border">
              <span className="text-xs text-text-dim">Panic Probability</span>
              <span className="text-sm font-bold text-red-500">{data.panic_prob}</span>
            </div>

            {/* Beginner Guide: Metric Prediction Logic */}
            <div className="mt-4 border-t border-white/10 pt-4 space-y-4 text-left">
               <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <BrainCircuit size={14} className="text-neon-blue animate-pulse" />
                  Score Prediction Mechanics (For Beginners):
               </h4>
               
               <div className="space-y-3.5 text-[11px] text-text-dim">
                  <div>
                     <span className="text-neon-orange font-bold block">1. Retail FOMO (Fear Of Missing Out) Score:</span>
                     <div className="mt-1 space-y-0.5 leading-relaxed bg-white/5 p-2 rounded border border-white/5">
                        <div><strong>When:</strong> Scanned hourly on social clusters.</div>
                        <div><strong>Where:</strong> Reddit (r/wallstreetbets, r/investing), Twitter/X feeds, and YouTube financial video transcripts.</div>
                        <div><strong>How:</strong> Matches word frequency of bullish keywords relative to the asset volume trend. High FOMO (&gt;70) warns the crowd is buying late.</div>
                     </div>
                  </div>

                  <div>
                     <span className="text-red-400 font-bold block">2. Panic Probability calculation:</span>
                     <div className="mt-1 space-y-0.5 leading-relaxed bg-white/5 p-2 rounded border border-white/5">
                        <div><strong>When:</strong> Calculated continuously every 5 minutes.</div>
                        <div><strong>Where:</strong> Spot Volatility Index (VIX) closing calculations.</div>
                        <div><strong>How:</strong> Scales VIX relative to baseline historical deviation levels. An expanding VIX increases this panic score.</div>
                     </div>
                  </div>

                  <div>
                     <span className="text-neon-green font-bold block">3. Institutional Confidence:</span>
                     <div className="mt-1 space-y-0.5 leading-relaxed bg-white/5 p-2 rounded border border-white/5">
                        <div><strong>When:</strong> Formulated dynamically at the end of each session.</div>
                        <div><strong>Where:</strong> CBOE options sweep data and Weekly CFTC COT commercial reports.</div>
                        <div><strong>How:</strong> Compares active large-scale Call volume purchases against Put volume sweeps.</div>
                     </div>
                  </div>

                  <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 mt-3 text-[10.5px]">
                     <span className="text-white font-bold block mb-1">💡 Core Conclusion for Traders:</span>
                     <p className="leading-relaxed text-white/95">
                        Compare them! If <strong>Retail FOMO is High</strong> but <strong>Institutional Confidence is Low</strong>, the market is in an unstable bubble. If <strong>Retail FOMO is Low</strong> but <strong>Institutional Confidence is High</strong>, it represents a high-probability institutional buy zone.
                     </p>
                  </div>
               </div>
            </div>
          </div>

          {/* Column 2: Smart Money Radar */}
          <div className="card flex flex-col gap-4 glass-morphism-premium">
            <h3 className="font-bold font-grotesk text-sm flex items-center gap-2 text-text-dim">
              <Radar size={16} /> Smart Money Radar
            </h3>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs space-y-1">
               <div className="font-bold text-white">👶 Beginner Guide: What are Whale Alerts?</div>
               <div className="text-[10px] text-text-dim leading-relaxed">
                  <div><strong>When:</strong> Captured when institutional orders clear clearing houses.</div>
                  <div><strong>Where:</strong> Crossing networks on the Nasdaq Cross Engine, CBOE, and Dark Pools.</div>
                  <div><strong>How:</strong> Filters block trades exceeding $1M and flags sweeps buying options across multiple exchanges.</div>
               </div>
            </div>
            <div className="bg-card2 p-4 rounded-xl border border-border text-center">
              <div className="text-xs text-text-dim uppercase tracking-wider mb-2">Institutional Action</div>
              <div className="text-lg font-bold font-grotesk text-neon-green">{data.smart_money_aggression}</div>
            </div>
            <div className="flex justify-between items-center bg-card2 p-3 rounded-xl border border-border">
              <span className="text-xs text-text-dim">Inst Confidence</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-neon-green" style={{ width: `${data.inst_confidence}%` }}></div>
                </div>
                <span className="text-xs font-bold">{data.inst_confidence}</span>
              </div>
            </div>
            
            <div className="mt-2">
              <div className="text-[10px] text-text-dim uppercase font-bold mb-2">Live Whale Alerts (Order Book Sweeps)</div>
              <div className="flex flex-col gap-2">
                 {data.whale_alerts && data.whale_alerts.map((whale) => (
                    <div key={whale.id} className="p-2.5 bg-white/5 rounded-lg border border-white/5 text-[10px] flex flex-col gap-1.5">
                       <div className="flex justify-between items-center">
                          <span className="font-bold text-white">🐳 {whale.type} ({whale.symbol})</span>
                          <span className="text-text-dim font-mono text-[9px]">{whale.time}</span>
                       </div>
                       <div className="text-text-dim flex flex-col gap-0.5">
                          <span>{whale.details}</span>
                          <span>Total Flow: <strong className="text-neon-green">{whale.premium}</strong></span>
                       </div>
                       <div className="flex justify-between items-center text-[9px] border-t border-white/5 pt-1 mt-0.5">
                          <span className="text-text-dim">Venue: {whale.venue}</span>
                          <span className="text-neon-blue font-mono bg-neon-blue/5 px-1.5 py-0.5 rounded border border-neon-blue/20">Ref: {whale.tx_ref}</span>
                       </div>
                    </div>
                 ))}
              </div>
              <div className="text-[9px] text-text-dim mt-2 italic">
                 * Note: Clearing reference IDs are generated via standardized exchange-logging formats for back-testing simulation.
              </div>
            </div>
          </div>
        </div>

        {/* SEC Form 4 Insider Ledger */}
        <div className="card glass-morphism-premium text-left">
          <div className="flex items-center gap-2 mb-4">
             <Radar size={18} className="text-neon-purple" />
             <h3 className="font-bold font-grotesk text-sm">Verified SEC Form 4 Insider Ledger</h3>
          </div>
          <div className="p-3 bg-purple-500/5 rounded-xl border border-purple-500/10 text-xs mb-4 space-y-1">
             <div className="font-bold text-white">👶 Beginner Guide: What is an Insider Trade?</div>
             <div className="text-[10px] text-text-dim leading-relaxed">
                <div><strong>When:</strong> Filled within 2 business days of any insider transaction.</div>
                <div><strong>Where:</strong> SEC EDGAR (Electronic Data Gathering, Analysis, and Retrieval) official database.</div>
                <div><strong>How:</strong> Scrapes corporate insider Form 4 declarations detailing transaction date, position title, and quantity sold or bought.</div>
             </div>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-[11px] text-text-dim border-collapse">
                <thead>
                   <tr className="border-b border-white/10 text-white font-bold text-left">
                      <th className="pb-2 pr-2">Date</th>
                      <th className="pb-2 pr-2">Symbol</th>
                      <th className="pb-2 pr-2">Insider</th>
                      <th className="pb-2 pr-2">Position</th>
                      <th className="pb-2 pr-2">Type</th>
                      <th className="pb-2 pr-2 text-right">Shares</th>
                      <th className="pb-2 pr-2 text-right">Value</th>
                      <th className="pb-2 text-right">Source</th>
                   </tr>
                </thead>
                <tbody>
                   {data.sec_insider_filings && data.sec_insider_filings.map((filing, idx) => (
                      <tr key={idx} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                         <td className="py-2.5 pr-2 font-mono">{filing.date}</td>
                         <td className="py-2.5 pr-2 font-bold text-white">{filing.symbol}</td>
                         <td className="py-2.5 pr-2 text-white">{filing.insider}</td>
                         <td className="py-2.5 pr-2">{filing.position}</td>
                         <td className={`py-2.5 pr-2 font-bold ${filing.type.toLowerCase().includes('buy') || filing.type.toLowerCase().includes('purchase') ? 'text-green-500' : 'text-red-500'}`}>{filing.type}</td>
                         <td className="py-2.5 pr-2 text-right font-mono">{filing.shares}</td>
                         <td className="py-2.5 pr-2 text-right font-mono text-white">{filing.value}</td>
                         <td className="py-2.5 text-right"><span className="px-2 py-0.5 bg-neon-purple/10 text-neon-purple rounded text-[9px] uppercase font-bold font-mono">{filing.source}</span></td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>
        
        {/* Institutional Options & Skew Profile */}
        <div className="card glass-morphism-premium">
           <h3 className="font-bold font-grotesk text-sm flex items-center gap-2 text-text-dim mb-4">
              <Zap size={16} className="text-neon-green" /> Option Flow Volatility & Skew
           </h3>
           <div className="p-3 bg-green-500/5 rounded-xl border border-green-500/10 text-xs mb-4 space-y-1">
              <div className="font-bold text-white">👶 Beginner Guide: What is Option Skew?</div>
              <div className="text-[10px] text-text-dim leading-relaxed">
                 <div><strong>When:</strong> Computed continuously during standard options market sessions.</div>
                 <div><strong>Where:</strong> Sourced across Chicago Board Options Exchange (CBOE) volume feeds.</div>
                 <div><strong>How:</strong> Compares active Put-option pricing against Call-option pricing. A high positive skew premium means institutions are actively buying put protection (hedging a crash).</div>
              </div>
           </div>
           <div className="space-y-4">
              <div>
                 <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-dim">Call Option Volume</span>
                    <span className="text-neon-green font-bold">{data.options_skew?.calls_volume}</span>
                 </div>
                 <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-neon-green" style={{ width: data.options_skew?.calls_volume }} />
                 </div>
              </div>
              <div>
                 <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-dim">Put Option Volume</span>
                    <span className="text-red-500 font-bold">{data.options_skew?.puts_volume}</span>
                 </div>
                 <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: data.options_skew?.puts_volume }} />
                 </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/5">
                 <span className="text-xs text-text-dim">Implied Volatility (IV) Skew Premium</span>
                 <span className="text-xs font-bold text-white font-mono bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                    {data.options_skew?.skew_premium}
                 </span>
              </div>
           </div>
        </div>

        {/* Macro Regime Indicators */}
        <div className="card glass-morphism-premium">
          <h3 className="font-bold font-grotesk text-sm flex items-center gap-2 text-text-dim mb-4">
            <TrendingUp size={16} /> Smart Money Regime Indicators
          </h3>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs mb-4 space-y-1">
             <div className="font-bold text-white">👶 Beginner Guide: Smart Money Regime</div>
             <div className="text-[10px] text-text-dim leading-relaxed">
                <div><strong>When:</strong> VIX is live every 5 minutes; COT position reports are released weekly by CFTC.</div>
                <div><strong>Where:</strong> CBOE Exchange VIX Index and CFTC commercial futures positioning index.</div>
                <div><strong>How:</strong> Compares active VIX value (below 15 represents complacency; above 18 represents high concern) against Net commercial dealer long/short values.</div>
             </div>
          </div>
          <div className="flex flex-col gap-2">
             {data.regime_indicators && data.regime_indicators.map((ind, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 border-b border-white/5 last:border-0">
                  <span className="text-xs text-text-dim">{ind.indicator}</span>
                  <span className="text-xs font-bold text-white font-mono">{ind.value}</span>
                </div>
             ))}
          </div>
        </div>

        {/* Educational Metric Explanations */}
        <div className="card glass-morphism-premium space-y-4">
           <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-neon-orange animate-pulse" />
              <h3 className="font-bold font-grotesk text-sm">Transparency & Calculation Methodology</h3>
           </div>
           
           <div className="text-[11px] text-text-dim space-y-4">
              <div className="space-y-1.5">
                 <div className="text-xs text-white font-bold">Market Consciousness Engine</div>
                 <div>💡 <strong>What it is:</strong> Natural Language Processing (NLP) synthesis of macro capital shifts.</div>
                 <div>🔧 <strong>How it is calculated:</strong> Measures safety indexes (Gold) vs risk-on indices (Bitcoin, S&P 500) over a trailing 5-day cycle.</div>
                 <div>🎯 <strong>Why it is needed:</strong> Flags structural regime changes before they show up in lagging moving averages.</div>
              </div>
              
              <div className="space-y-1.5 border-t border-white/5 pt-3">
                 <div className="text-xs text-white font-bold">Option Flow Volatility & Skew</div>
                 <div>💡 <strong>What it is:</strong> The distribution skew of Call options volume vs Put options volume.</div>
                 <div>🔧 <strong>How it is calculated:</strong> Derived from CBOE daily options volume and premium weights for short and mid-term expiries.</div>
                 <div>🎯 <strong>Why it is needed:</strong> Reveals institutional positioning, showing if market makers are pricing tail-risk or chasing upside gamma.</div>
              </div>

              <div className="space-y-1.5 border-t border-white/5 pt-3">
                 <div className="text-xs text-white font-bold">Smart Money Regime Indicators</div>
                 <div>💡 <strong>What it is:</strong> Quantitative market health matrix tracking VIX levels and COT filings.</div>
                 <div>🔧 <strong>How it is calculated:</strong> Blends spot VIX values (Complacent &lt; 15, Elevated &gt; 18, Crisis &gt; 25) with Commitment of Traders (COT) net dealer positions.</div>
                 <div>🎯 <strong>Why it is needed:</strong> Helps you dynamically size trading accounts and adjust risk-reward settings to avoid buying into high-volatility distribution tops.</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
