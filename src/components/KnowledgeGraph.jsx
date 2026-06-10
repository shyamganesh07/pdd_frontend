import React, { useState, useEffect, useRef } from 'react'
import { Brain, Zap, Activity, Target, Shield, Info, ArrowLeft, Maximize2, Share2, XCircle } from 'lucide-react'

const NODES = [
  { id: 'rsi', label: 'RSI', type: 'momentum', x: 200, y: 150, color: '#3B82F6', info: 'The Relative Strength Index (RSI) is a momentum oscillator that measures the speed and change of price movements. It ranges from 0 to 100.', beginner: 'Think of RSI as a "Tension Meter." When it goes above 70, the market is stretched too high (Overbought). Below 30, it\'s stretched too low (Oversold). Beginners use it to avoid "buying the top."', institutional: 'Institutional traders use RSI to find "Divergences"—hidden signals where the price moves one way but the RSI moves the other, signaling a major trend reversal.' },
  { id: 'momentum', label: 'Momentum', type: 'momentum', x: 350, y: 80, color: '#3B82F6', info: 'Momentum is the rate of acceleration of a security\'s price or volume.', beginner: 'Momentum is like the speed of a car. If a stock is moving up fast, it has "Bullish Momentum." It tells you if the current move has enough power to keep going.', institutional: 'Quants measure momentum to identify "Trend Persistence." We look for high-momentum breakouts that suggest institutional accumulation.' },
  { id: 'atr', label: 'ATR', type: 'volatility', x: 200, y: 300, color: '#10B981', info: 'Average True Range (ATR) is a volatility indicator that shows how much an asset moves, on average, during a given time frame.', beginner: 'ATR is the "Volatility Yardstick." It doesn\'t tell you direction, only how "bouncy" the price is. If ATR is high, expect big swings.', institutional: 'This is the most important tool for Risk Management. Professionals use ATR to set Stop-Losses far enough away so they don\'t get knocked out by "market noise."' },
  { id: 'volatility', label: 'Volatility', type: 'volatility', x: 380, y: 300, color: '#10B981', info: 'Volatility is a statistical measure of the dispersion of returns for a given security.', beginner: 'Volatility is "Market Fear and Greed" in numbers. High volatility means prices are jumping wildly.', institutional: 'Institutions price options and calculate "Value at Risk" using volatility. When volatility spikes, we adjust position sizes to protect capital.' },
  { id: 'volume', label: 'Volume', type: 'volume', x: 550, y: 200, color: '#F59E0B', info: 'Volume measures the number of shares or contracts traded in a security or an entire market during a given period.', beginner: 'Volume is the "Lie Detector." If price moves up but volume is low, the move is weak. If volume is huge, it means big players are active.', institutional: 'We look for "Volume Spikes" at key support levels to identify institutional buying interest, also known as Demand Zones.' },
  { id: 'breakouts', label: 'Breakouts', type: 'volume', x: 680, y: 200, color: '#F59E0B', info: 'A breakout is a stock price moving outside a defined support or resistance level with increased volume.', beginner: 'Imagine a lid on a boiling pot. When the lid flies off, that\'s a "Breakout." It marks the start of a new, powerful trend.', institutional: 'Breakouts are high-probability entry points. We use "Volume Confirmation" and "Statistical Drift" to ensure a breakout isn\'t a "Fakeout."' },
  { id: 'macd', label: 'MACD', type: 'momentum', x: 100, y: 220, color: '#3B82F6', info: 'Moving Average Convergence Divergence (MACD) is a trend-following momentum indicator.', beginner: 'MACD is the "Trend Compass." When the lines cross upwards, it\'s a signal to look for buys.', institutional: 'Institutions use the MACD Histogram to measure the strength of the "Market Impulse" and time exits before momentum fades.' },
  { id: 'ema', label: 'EMA', type: 'trend', x: 100, y: 100, color: '#8B5CF6', info: 'Exponential Moving Average gives more weight to recent prices, making it more responsive to new information.', beginner: 'The EMA is a smoothed line on your chart. When price is above the EMA, the trend is up. When below, the trend is down.', institutional: 'Institutional desks use the 20/50/200 EMA ribbon to define structural trend bias for position entries.' },
  { id: 'trend', label: 'Trend Analysis', type: 'trend', x: 300, y: 420, color: '#8B5CF6', info: 'Trend analysis is the study of the general direction in which a market or asset is moving.', beginner: 'The Trend is your friend. If the market is making Higher Highs, it\'s an "Uptrend." Never trade against the primary trend.', institutional: 'We use "Moving Average Ribbons" to define the structural trend. 80% of institutional profits come from catching mid-to-long term trends.' },
  { id: 'support', label: 'Support/Resistance', type: 'trend', x: 530, y: 370, color: '#8B5CF6', info: 'Support is a price level where buying interest is strong enough to overcome selling pressure. Resistance is the opposite.', beginner: 'Think of Support as the "floor" and Resistance as the "ceiling." Price bounces between these levels like a ball.', institutional: 'Institutional traders place large buy orders at key support zones to accumulate positions before major breakouts.' },
]

const EDGES = [
  { from: 'rsi', to: 'momentum' },
  { from: 'atr', to: 'volatility' },
  { from: 'volume', to: 'breakouts' },
  { from: 'rsi', to: 'macd' },
  { from: 'macd', to: 'ema' },
  { from: 'volatility', to: 'breakouts' },
  { from: 'momentum', to: 'breakouts' },
  { from: 'ema', to: 'trend' },
  { from: 'trend', to: 'support' },
  { from: 'support', to: 'breakouts' },
  { from: 'volume', to: 'trend' },
]

const LEGEND = [
  { label: 'Momentum', color: '#3B82F6' },
  { label: 'Volatility', color: '#10B981' },
  { label: 'Trend', color: '#8B5CF6' },
  { label: 'Volume', color: '#F59E0B' },
]

export default function KnowledgeGraph({ onBack }) {
  const [selectedNode, setSelectedNode] = useState(null)
  const [hoveredNode, setHoveredNode] = useState(null)
  const containerRef = useRef(null)

  const handleNodeClick = (node) => {
    setSelectedNode(node === selectedNode ? null : node)
  }

  return (
    <div className="fade-in slide-up flex flex-col min-h-full overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/5 backdrop-blur-xl z-20" style={{ backgroundColor: 'rgba(13, 17, 28, 0.8)' }}>
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold font-grotesk flex items-center gap-2">
              <Brain size={20} className="text-neon-purple" />
              Neural Knowledge Map
            </h1>
            <p className="text-[10px] text-text-dim uppercase tracking-widest">Interactive Concept Engine</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" />
            <span className="text-[8px] font-bold text-neon-blue uppercase">Beginner Mode Active</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden flex flex-col graph-parent">
        {/* Graph Area */}
        <div className="flex-1 relative graph-svg-container bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent">
          {/* Decorative Grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none graph-grid"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          <svg className="w-full h-full graph-svg block mx-auto transition-all" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
            {/* Edges */}
            {EDGES.map((edge, i) => {
              const fromNode = NODES.find(n => n.id === edge.from)
              const toNode = NODES.find(n => n.id === edge.to)
              const isHighlighted = (selectedNode && (selectedNode.id === edge.from || selectedNode.id === edge.to)) ||
                (hoveredNode && (hoveredNode.id === edge.from || hoveredNode.id === edge.to))

              return (
                <line
                  key={i}
                  x1={fromNode.x} y1={fromNode.y}
                  x2={toNode.x} y2={toNode.y}
                  stroke={isHighlighted ? 'var(--neon-blue)' : 'rgba(255,255,255,0.1)'}
                  strokeWidth={isHighlighted ? 2 : 1}
                  className="transition-all duration-300"
                />
              )
            })}

            {/* Nodes */}
            {NODES.map((node) => {
              const isSelected = selectedNode?.id === node.id
              const isHovered = hoveredNode?.id === node.id
              const isRelated = selectedNode && EDGES.some(e => (e.from === node.id && e.to === selectedNode.id) || (e.to === node.id && e.from === selectedNode.id))

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => handleNodeClick(node)}
                  className="cursor-pointer"
                >
                  {/* Glow */}
                  {(isSelected || isHovered) && (
                    <circle r={40} fill={node.color} opacity={0.2} className="animate-pulse" />
                  )}

                  {/* Base Circle */}
                  <circle
                    r={isSelected ? 32 : 28}
                    fill="#0F172A"
                    stroke={isSelected ? 'var(--neon-green)' : isRelated ? 'var(--neon-blue)' : node.color}
                    strokeWidth={isSelected ? 4 : 2}
                    className="transition-all duration-300"
                  />

                  {/* Label */}
                  <text
                    textAnchor="middle"
                    dy=".3em"
                    fill="white"
                    className={`font-bold font-grotesk pointer-events-none transition-all ${isSelected ? 'text-[12px]' : 'text-[10px]'}`}
                    style={{ textShadow: '0 0 10px rgba(0,0,0,0.5)' }}
                  >
                    {node.label}
                  </text>

                  {/* Related Pulsar */}
                  {isRelated && !isSelected && (
                    <circle r={35} fill="none" stroke="var(--neon-blue)" strokeWidth={1} strokeDasharray="4 4" className="animate-spin-slow" />
                  )}
                </g>
              )
            })}
          </svg>

          {/* Helper Tooltip */}
          {!selectedNode && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2 animate-bounce">
              <Info size={14} className="text-neon-blue" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim">Tap a node to learn its secrets</span>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="legend-container" style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', gap: 24, background: 'rgba(13,17,28,0.8)' }}>
        {LEGEND.map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: l.color }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600 }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* ── CENTRAL KNOWLEDGE CARD OVERLAY (Fixed Viewport) ── */}
      <div className={`fixed inset-0 z-50 transition-all duration-500 ${selectedNode ? 'bg-black/85 opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} overflow-y-auto p-4 flex flex-col items-center justify-start md:justify-center`} style={{ WebkitOverflowScrolling: 'touch' }}>
        {selectedNode && (
          <div className="knowledge-card w-full max-w-md my-8 transform transition-all duration-500 scale-100 pointer-events-auto">
            <div className="card glass-morphism-premium p-5 md:p-8 border-neon-blue/30 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 md:p-4">
                 <button onClick={() => setSelectedNode(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors" aria-label="Close">
                    <XCircle size={24} className="text-text-dim" />
                 </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${selectedNode.color}20`, border: `1px solid ${selectedNode.color}40` }}>
                  {selectedNode.type === 'indicator' ? <Activity size={24} color={selectedNode.color} /> : <Zap size={24} color={selectedNode.color} />}
                </div>
                <div>
                  <div className="text-[10px] text-neon-blue font-bold uppercase tracking-[0.3em] mb-1">Neural Briefing</div>
                  <h2 className="text-2xl md:text-3xl font-bold font-grotesk text-white">{selectedNode.label}</h2>
                </div>
              </div>

              <div className="space-y-4 md:space-y-6">
                <div className="p-4 md:p-5 bg-white/5 rounded-2xl border border-white/10">
                   <div className="flex items-center gap-2 mb-2 text-neon-green">
                      <GraduationCap size={16} />
                      <span className="text-[10px] font-bold uppercase">Beginner Guide</span>
                   </div>
                   <p className="text-xs md:text-sm text-text-dim leading-relaxed font-medium">
                      {selectedNode.beginner}
                   </p>
                </div>

                <div className="p-4 md:p-5 bg-neon-purple/5 rounded-2xl border border-neon-purple/20">
                   <div className="flex items-center gap-2 mb-2 text-neon-purple">
                      <Shield size={16} />
                      <span className="text-[10px] font-bold uppercase">Institutional Usage</span>
                   </div>
                   <p className="text-xs md:text-sm text-text-dim leading-relaxed italic">
                      {selectedNode.institutional}
                   </p>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-white/5 flex flex-wrap gap-2">
                 <span className="text-[9px] font-bold text-text-dim uppercase flex-shrink-0 self-center">Related:</span>
                 {EDGES.filter(e => e.from === selectedNode.id || e.to === selectedNode.id).map(e => {
                    const otherId = e.from === selectedNode.id ? e.to : e.from
                    const otherNode = NODES.find(n => n.id === otherId)
                    return (
                       <span key={otherId} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[9px] font-bold text-neon-blue uppercase">{otherNode.label}</span>
                    )
                 })}
              </div>

              <button 
                 onClick={() => setSelectedNode(null)} 
                 className="w-full mt-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors text-white"
              >
                 Close Briefing
              </button>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        .knowledge-card {
           box-shadow: 0 0 50px rgba(59, 130, 246, 0.2);
           animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slide-up {
           from { transform: translateY(20px); opacity: 0; }
           to { transform: translateY(0); opacity: 1; }
        }

        /* Mobile Graph responsive rules */
        @media (max-width: 767px) {
          .graph-parent {
             flex-direction: column !important;
          }
          .graph-svg-container {
             overflow-x: auto !important;
             overflow-y: hidden !important;
             -webkit-overflow-scrolling: touch;
             min-height: 380px;
          }
          .graph-svg {
             min-width: 800px !important;
             height: 420px !important;
          }
          .graph-grid {
             width: 800px !important;
             height: 100% !important;
          }
          .legend-container {
             flex-wrap: wrap !important;
             gap: 12px 24px !important;
          }
        }
      `}} />
    </div>
  )
}

function GraduationCap(props) {
  return (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v5" /></svg>
  )
}
