import React, { useState, useEffect } from 'react'
import { ArrowLeft, Share2, Star, Calculator, Repeat2, ShieldCheck, Zap, Activity, BookOpen } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine,
  ResponsiveContainer, CartesianGrid
} from 'recharts'

// ── Real Price Chart with T1/T2/T3/E/SL reference lines ──
function PriceChart({ priceData, entry, sl, t1, t2, t3, atr, auraColor, currency = '$', predictedPrice, aiSignal }) {
  if (!Array.isArray(priceData) || !priceData.length || !entry) return null
  
  const recent = priceData.slice(-20).map((d, i) => ({ i: i+1, close: Number(d.close) }))
  const chartData = recent.map(d => ({ i: d.i, close: d.close, forecast: undefined }))
  
  const allLevels = [entry, sl, t1, t2, t3]
    .map(Number)
    .filter(val => !isNaN(val) && val > 0)
    
  const recentCloses = recent.map(d => d.close).filter(val => !isNaN(val) && val > 0)
  const safeAtr = Number(atr) || 0
  
  let hasForecast = false
  if (predictedPrice && !isNaN(Number(predictedPrice))) {
    const lastPoint = recent[recent.length - 1]
    chartData[chartData.length - 1].forecast = lastPoint.close
    
    const predNum = Number(predictedPrice)
    const entryNum = Number(entry)
    const slNum = Number(sl)

    chartData.push({ i: recent.length + 1, forecast: predNum })
    recentCloses.push(predNum)
    hasForecast = true
  }
  
  const minLevel = allLevels.length ? Math.min(...allLevels) : Number(entry)
  const maxLevel = allLevels.length ? Math.max(...allLevels) : Number(entry)
  const minRecent = recentCloses.length ? Math.min(...recentCloses) : Number(entry)
  const maxRecent = recentCloses.length ? Math.max(...recentCloses) : Number(entry)

  const minY = Math.min(minLevel, minRecent) - safeAtr * 0.3
  const maxY = Math.max(maxLevel, maxRecent) + safeAtr * 0.3

  const LabelRight = ({ viewBox, value, fill }) => {
    if (!viewBox) return null
    return (
      <text x={viewBox.width + viewBox.x + 3} y={viewBox.y + 4} fill={fill}
        fontSize={8} fontWeight="700" fontFamily="Space Grotesk, sans-serif">
        {value}
      </text>
    )
  }

  return (
    <div style={{ height:180, margin:'12px 0 4px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top:4, right:72, bottom:0, left:-36 }}>
          <defs>
            <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={auraColor || "#22C55E"} stopOpacity={0.2} />
              <stop offset="95%" stopColor={auraColor || "#22C55E"} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
          <XAxis dataKey="i" hide />
          <YAxis domain={[isNaN(minY) ? 'auto' : minY, isNaN(maxY) ? 'auto' : maxY]} hide />
          <Tooltip
            content={({ active, payload }) =>
              active && payload?.length && payload[0].value !== undefined && !isNaN(Number(payload[0].value)) ? (
                <div style={{ background:'#131929', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, padding:'4px 8px', fontSize:'0.72rem', color:auraColor || '#22C55E', fontFamily:'Space Grotesk', fontWeight:700 }}>
                  {currency}{Number(payload[0].value).toFixed(2)}
                </div>
              ) : null
            }
          />
          <Area type="monotone" dataKey="close" stroke={auraColor || "#22C55E"} strokeWidth={1.8} fill="url(#cg)" dot={false}
            activeDot={{ fill:auraColor || '#22C55E', r:4, strokeWidth:0 }} />
          {hasForecast && (
            <Area type="monotone" dataKey="forecast" stroke={auraColor || "#22C55E"} strokeWidth={1.8} strokeDasharray="3 3" fill="none" dot={{ r: 3, fill: auraColor || "#22C55E" }} />
          )}

          {/* Reference lines */}
          {t3 && !isNaN(Number(t3)) && <ReferenceLine y={Number(t3)} stroke="#3B82F6" strokeDasharray="3 3" strokeWidth={1}
            label={<LabelRight fill="#3B82F6" value={`T3 ${currency}${Number(t3).toFixed(2)}`} />} />}
          {t2 && !isNaN(Number(t2)) && <ReferenceLine y={Number(t2)} stroke="#60A5FA" strokeDasharray="3 3" strokeWidth={1}
            label={<LabelRight fill="#60A5FA" value={`T2 ${currency}${Number(t2).toFixed(2)}`} />} />}
          {t1 && !isNaN(Number(t1)) && <ReferenceLine y={Number(t1)} stroke="#93C5FD" strokeDasharray="3 3" strokeWidth={1}
            label={<LabelRight fill="#93C5FD" value={`T1 ${currency}${Number(t1).toFixed(2)}`} />} />}
          {entry && !isNaN(Number(entry)) && <ReferenceLine y={Number(entry)} stroke={auraColor || "#22C55E"} strokeDasharray="4 2" strokeWidth={1.5}
            label={<LabelRight fill={auraColor || "#22C55E"} value={`E  ${currency}${Number(entry).toFixed(2)}`} />} />}
          {sl && !isNaN(Number(sl)) && <ReferenceLine y={Number(sl)} stroke="#EF4444" strokeWidth={1.5}
            label={<LabelRight fill="#EF4444" value={`SL ${currency}${Number(sl).toFixed(2)}`} />} />}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}


// ── AI Signal Banner ──
function AISignalCard({ signal, score, color, reason, ui_effects }) {
  if (!signal) return null
  const [brief, setBrief] = useState(null)
  const bg = signal === 'STRONG BUY' ? 'rgba(34,197,94,0.07)' :
             signal === 'BUY'        ? 'rgba(134,239,172,0.06)' :
             signal === 'NEUTRAL'    ? 'rgba(245,158,11,0.06)' :
             'rgba(239,68,68,0.06)'
  const border = signal === 'STRONG BUY' ? 'rgba(34,197,94,0.25)' :
                 signal === 'BUY'        ? 'rgba(134,239,172,0.2)' :
                 signal === 'NEUTRAL'    ? 'rgba(245,158,11,0.2)' :
                 'rgba(239,68,68,0.2)'
  
  const waveform = ui_effects?.waveform_data || Array.from({length:20}).map(() => Math.random() * 100)

  const toggleBrief = async () => {
    if (brief) { setBrief(null); return }
    const res = await fetch('/api/academy/indicator-briefing/atr')
    setBrief(await res.json())
  }

  return (
    <div 
      style={{ 
        background:bg, 
        border:`1px solid ${border}`, 
        borderRadius:14, 
        padding:'14px 16px', 
        margin:'0 16px 10px',
        position: 'relative',
        '--aura-color-low': `${color}22`,
        '--aura-color-high': `${color}66`
      }} 
      className={`holo-card ${ui_effects?.glow_intensity === 'high' ? 'confidence-aura' : ''}`}
    >
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span className="probability-glow" style={{ fontSize:'1.1rem', '--glow-color': color }}>🤖</span>
          <span style={{ fontFamily:'Space Grotesk', fontWeight:700, fontSize:'0.8rem', color:'#94A3B8' }}>AI EXECUTION CORE</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6, marginLeft: 'auto' }}>
          <div style={{ height:4, width:60, background:'rgba(255,255,255,0.06)', borderRadius:2, overflow:'hidden' }}>
            <div style={{ width:`${score}%`, height:'100%', background:color, borderRadius:2 }} />
          </div>
          <span style={{ fontSize:'0.65rem', color:'#94A3B8' }}>{score}/100</span>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontFamily:'Space Grotesk', fontWeight:700, fontSize:'1.4rem', color, lineHeight:1 }}>
          {signal}
        </div>
        <button onClick={toggleBrief} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '4px 8px', color: '#94A3B8', fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
          <BookOpen size={12} /> {brief ? 'CLOSE BRIEF' : 'NEURAL BRIEFING'}
        </button>
      </div>
      
      {brief && (
        <div className="fade-in" style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: 12, border: '1px solid rgba(255,255,255,0.1)', marginBottom: 12 }}>
          <div style={{ fontSize: '0.75rem', color: '#F1F5F9', lineHeight: 1.4 }}>{brief.usage}</div>
          <div style={{ fontSize: '0.65rem', color: '#EF4444', marginTop: 4, fontWeight: 700 }}>CAUTION: {brief.dangers}</div>
        </div>
      )}

      {/* Risk Waveform (Tier 4) */}
      <div style={{ height:30, display:'flex', alignItems:'flex-end', gap:2, marginBottom:12 }}>
        {waveform.map((val, i) => (
          <div 
            key={i} 
            className="risk-waveform-bar"
            style={{ 
              flex:1, 
              background:color, 
              opacity:0.3 + (i/waveform.length)*0.5, 
              height:`${val}%`,
              animationDelay: `${i*0.05}s`
            }} 
          />
        ))}
      </div>

      <div style={{ background:'rgba(0,0,0,0.2)', padding:'12px', borderRadius:'10px', border:'1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
          <div style={{ fontSize:'0.75rem', fontWeight:700, color:'#94A3B8', fontFamily:'Space Grotesk' }}>AI DECISION MATRIX</div>
          <div style={{ fontSize:'0.6rem', color:color, fontWeight:700, border:`1px solid ${color}`, padding:'1px 4px', borderRadius:4 }}>EXPLAINED</div>
        </div>
        <div style={{ fontSize:'0.85rem', color:'#F8FAFC', lineHeight:1.5 }}>{reason}</div>
      </div>
    </div>
  )
}

// ── AI Risk Firewall (Protective System) ──
function AIRiskFirewall({ active, reason, onAbort }) {
  if (!active) return null
  return (
    <div style={{ margin:'0 16px 16px', background:'rgba(239,68,68,0.1)', border:'2px solid var(--red)', borderRadius:16, padding:'20px', textAlign:'center', position:'relative', overflow:'hidden' }} className="shake">
      <div style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', background:'repeating-linear-gradient(45deg, rgba(239,68,68,0.05) 0, rgba(239,68,68,0.05) 10px, transparent 10px, transparent 20px)', opacity:0.3 }} />
      <div style={{ width:50, height:50, background:'var(--red)', borderRadius:'50%', margin:'0 auto 12px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 20px rgba(239,68,68,0.4)' }}>
         <ShieldCheck size={28} color="white" />
      </div>
      <div style={{ fontFamily:'Space Grotesk', fontWeight:700, fontSize:'1.1rem', color:'var(--red)', marginBottom:8, position:'relative' }}>AI RISK FIREWALL ACTIVE</div>
      <div style={{ fontSize:'0.85rem', color:'#F1F5F9', lineHeight:1.5, marginBottom:16, position:'relative' }}>
        <strong>TRADE BLOCKED:</strong> {reason}
      </div>
      <div style={{ display:'flex', gap:10, justifyContent:'center', position:'relative' }}>
         <button style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', color:'white', padding:'8px 16px', borderRadius:8, fontSize:'0.75rem', fontWeight:700, cursor:'not-allowed', opacity:0.5 }}>FORCE EXECUTE</button>
         <button style={{ background:'var(--red)', border:'none', color:'white', padding:'8px 16px', borderRadius:8, fontSize:'0.75rem', fontWeight:700, cursor:'pointer' }} onClick={onAbort}>ABORT TRADE</button>
      </div>
    </div>
  )
}

// ── AI Trade Copilot (Behavioral Partner) ──
function AICopilotFeedback({ symbol, score, onFirewall }) {
  const [emotion, setEmotion] = useState('Stable')
  const [riskAlert, setRiskAlert] = useState(false)
  
  useEffect(() => {
    // Mocking real-time behavioral check
    const prob = Math.random()
    if (prob > 0.9) { 
      setEmotion('Impulsive'); 
      setRiskAlert(true);
      onFirewall("You have already taken multiple trades today. AI Risk Firewall is now active to prevent overtrading.")
    }
    else if (prob > 0.7) { setEmotion('Anxious'); setRiskAlert(true) }
    else { setEmotion('Disciplined'); setRiskAlert(false) }
  }, [])

  return (
    <div style={{ margin:'0 16px 16px', background:'linear-gradient(135deg, rgba(61,101,244,0.1), rgba(34,197,94,0.1))', border:'1px solid rgba(255,255,255,0.1)', borderRadius:16, padding:'16px', position:'relative', overflow:'hidden' }} className="glass-morphism-premium">
      <div style={{ position:'absolute', top:-20, right:-20, width:100, height:100, background:'var(--blue)', filter:'blur(40px)', opacity:0.1 }} />
      
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
        <div className={`w-3 h-3 rounded-full ${riskAlert ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
        <span style={{ fontFamily:'Space Grotesk', fontWeight:700, fontSize:'0.85rem' }}>AI COPILOT PARTNER</span>
      </div>

      <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
        <div style={{ width:44, height:44, borderRadius:12, background:'var(--card2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', flexShrink:0 }}>🧑‍✈️</div>
        <div>
          <div style={{ fontSize:'0.85rem', color:'#F1F5F9', lineHeight:1.5, marginBottom:8 }}>
            "{score > 80 ? 'This setup looks professional, but watch the liquidity gap at entry.' : 'Momentum is weak. I recommend reducing your position size to stay within safety limits.'}"
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <div style={{ background:'rgba(0,0,0,0.2)', padding:'4px 8px', borderRadius:6, fontSize:'0.65rem' }}>
              <span style={{ color:'#94A3B8' }}>Your State:</span> <strong style={{ color: riskAlert ? 'var(--red)' : 'var(--green)' }}>{emotion}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Investment Calculator ──
function InvestmentCalc({ entry, sl, t1, t2, t3, currency = '$', priceData, timestamp }) {
  const [amount, setAmount] = useState('1000')
  const entryNum = Number(entry)
  const slNum = Number(sl)
  const t1Num = Number(t1)
  const t2Num = Number(t2)
  const t3Num = Number(t3)

  if (!entryNum || !slNum || isNaN(entryNum) || isNaN(slNum)) return null

  const inv    = parseFloat(amount) || 0
  const shares = inv / entryNum
  
  const lossValRaw = (slNum - entryNum) * shares
  const lossV      = Math.abs(lossValRaw).toFixed(2)
  const profT1 = (!isNaN(t1Num) ? ((t1Num - entryNum) * shares).toFixed(2) : '0.00')
  const profT2 = (!isNaN(t2Num) ? ((t2Num - entryNum) * shares).toFixed(2) : '0.00')
  const profT3 = (!isNaN(t3Num) ? ((t3Num - entryNum) * shares).toFixed(2) : '0.00')

  // Dynamic Hit Checking
  let t1Hit = false, t2Hit = false, t3Hit = false, slHit = false
  if (Array.isArray(priceData)) {
    const entryDateOnly = timestamp ? timestamp.split('T')[0] : null
    const entryIndex = priceData.findIndex(d => {
      if (entryDateOnly && d.date.startsWith(entryDateOnly)) return true
      return Math.abs(Number(d.close) - entryNum) < 0.001
    })
    const futureData = entryIndex !== -1 ? priceData.slice(entryIndex) : []
    
    t1Hit = futureData.some(d => Number(d.high) >= t1Num)
    t2Hit = futureData.some(d => Number(d.high) >= t2Num)
    t3Hit = futureData.some(d => Number(d.high) >= t3Num)
    slHit = futureData.some(d => Number(d.low) <= slNum)
  }

  return (
    <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:14, margin:'0 16px 10px' }} className="glass-morphism-premium">
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
        <Calculator size={15} color="var(--blue)" />
        <span style={{ fontFamily:'Space Grotesk', fontWeight:700, fontSize:'0.9rem' }}>Adaptive Risk Management</span>
      </div>
      <div style={{ display:'flex', gap:6, marginBottom:12, alignItems:'center' }}>
        <span style={{ color:'#94A3B8', fontWeight:700 }}>{currency}</span>
        <input type="number" value={amount} onChange={e=>setAmount(e.target.value)}
          style={{ flex:1, background:'var(--card2)', border:'1px solid var(--border)', borderRadius:8, padding:'8px 12px', color:'white', fontSize:'0.9rem', fontFamily:'Space Grotesk', fontWeight:700 }} />
      </div>
      {inv > 0 && <>
        <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
          {[
            { 
              label: t1Hit ? '🎯 Target 1 Hit' : '🎯 Target 1 Level', 
              val: profT1, 
              color: t1Hit ? '#86EFAC' : '#94A3B8', 
              bg: t1Hit ? 'rgba(34,197,94,0.09)' : 'rgba(255,255,255,0.02)', 
              border: t1Hit ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)' 
            },
            { 
              label: t2Hit ? '🎯 Target 2 Hit' : '🎯 Target 2 Level', 
              val: profT2, 
              color: t2Hit ? '#22C55E' : '#94A3B8', 
              bg: t2Hit ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.02)', 
              border: t2Hit ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.05)' 
            },
            { 
              label: t3Hit ? '🚀 Target 3 Hit' : '🚀 Target 3 Level', 
              val: profT3, 
              color: t3Hit ? '#16A34A' : '#94A3B8', 
              bg: t3Hit ? 'rgba(22,163,74,0.12)' : 'rgba(255,255,255,0.02)',  
              border: t3Hit ? 'rgba(22,163,74,0.25)' : 'rgba(255,255,255,0.05)' 
            },
            { 
              label: slHit ? '🛑 Stop Loss Hit' : '🛑 Stop Loss Level',
              val: lossV,  
              color: slHit ? '#EF4444' : '#94A3B8', 
              bg: slHit ? 'rgba(239,68,68,0.09)' : 'rgba(255,255,255,0.02)',  
              border: slHit ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)', 
              loss: true 
            },
          ].map(({ label,val,color,bg,border,loss }) => (
            <div key={label} style={{ display:'flex', justifyContent:'space-between', background:bg, border:`1px solid ${border}`, borderRadius:8, padding:'6px 10px' }}>
              <span style={{ fontSize:'0.76rem', color:'#94A3B8' }}>{label}</span>
              <span style={{ fontFamily:'Space Grotesk', fontWeight:700, fontSize:'0.88rem', color }}>
                {loss ? `-${currency}${val}` : `+${currency}${val}`}
              </span>
            </div>
          ))}
        </div>
      </>}
    </div>
  )
}

// ── Currency Converter ──
const CURRENCIES = ['USD','INR','EUR','GBP','JPY','AED','SGD']
function CurrencyConverter() {
  const [amount, setAmount] = useState('100')
  const [from,   setFrom]   = useState('USD')
  const [to,     setTo]     = useState('INR')
  const [rates,  setRates]  = useState({})
  const [result, setResult] = useState(null)

  useEffect(() => {
    fetch('/api/rates').then(r=>r.json()).then(setRates).catch(()=>{})
  }, [])

  const convert = () => {
    const pairFwd = `${from}${to}`, pairRev = `${to}${from}`
    let rate = rates[pairFwd] ?? (rates[pairRev] ? 1/rates[pairRev] : null)
    if (rate) {
      const amt = parseFloat(amount)
      if (!isNaN(amt) && !isNaN(rate)) {
        setResult((amt * rate).toFixed(4))
      } else {
        setResult('0.0000')
      }
    }
  }

  return (
    <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:14, margin:'0 16px 10px' }} className="glass-morphism-premium">
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
        <Repeat2 size={15} color="#A855F7" />
        <span style={{ fontFamily:'Space Grotesk', fontWeight:700, fontSize:'0.9rem' }}>Currency Converter</span>
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:10 }}>
        <input type="number" value={amount} onChange={e=>setAmount(e.target.value)}
          style={{ flex:1, background:'var(--card2)', border:'1px solid var(--border)', borderRadius:8, padding:'8px 12px', color:'white', fontSize:'1rem', fontFamily:'Space Grotesk', fontWeight:700 }} />
        <button onClick={convert} style={{ padding:'0 20px', borderRadius:10, background:'linear-gradient(135deg,#A855F7,#6B3FD4)', border:'none', color:'white', fontFamily:'Space Grotesk', fontWeight:700, cursor:'pointer' }}>Convert</button>
      </div>
      {result && <div style={{ textAlign:'center', color:'#A855F7', fontWeight:700, fontSize:'1.2rem' }}>{result} {to}</div>}
    </div>
  )
}

// ── Stars ──
function Stars({ count, max=5, label }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:4 }}>
      {Array.from({ length:max }).map((_,i) => (
        <Star key={i} size={20} fill={i<count?'#F59E0B':'none'} color={i<count?'#F59E0B':'#374151'} strokeWidth={1.5} />
      ))}
      {label && <span style={{ fontSize:'0.85rem', color:'#94A3B8', marginLeft:6, fontFamily:'Space Grotesk', fontWeight:600 }}>{label}</span>}
    </div>
  )
}

// ── Main Export ──
export default function TradeSetup({ result, onBack }) {
  const [firewallActive, setFirewallActive] = useState(false)
  const [firewallReason, setFirewallReason] = useState('')

  useEffect(() => {
    if (result) {
      const predNum = Number(result.predicted_price)
      const slNum = Number(result.stop_loss)
      const touchedStopLoss = !isNaN(predNum) && !isNaN(slNum) && (predNum <= slNum)
      
      if (touchedStopLoss) {
        setFirewallActive(true)
        setFirewallReason("Analysis reached Stop Loss (SL). The GARCH-LSTM forecast indicates the price will plunge into a steep loss. Capital protection system active—trade has been force-stopped to minimize overall loss.")
      } else {
        setFirewallActive(false)
        setFirewallReason("")
      }
    }
  }, [result])

  if (!result) return null

  const { symbol, entry, stop_loss, targets, risk_reward, atr, pattern,
          confidence, price_data, ai_signal, ai_score, ai_color, ai_reason,
          predicted_price, model_accuracy, ui_effects } = result
  const currency = result.currency || 
                   ((symbol?.endsWith('.NS') || symbol?.endsWith('.BO') || symbol === '^NSEI' || symbol === '^NSEBANK') ? '₹' : '$')
  const sym = symbol?.replace(/\.(NS|BO|F)$/, '') || symbol
  const entryNum = Number(entry)
  const slNum = Number(stop_loss)
  const slPct = (entryNum && !isNaN(slNum)) ? (((slNum - entryNum) / entryNum) * 100).toFixed(2) : '0.00'
  const confLabel = confidence>=5?'High':confidence>=4?'Good':confidence>=3?'Moderate':'Low'

  return (
    <>
      <div className="page-header">
        <button className="back-btn" onClick={onBack}><ArrowLeft size={16} color="#94A3B8" /></button>
        <div className="page-title">Execution Engine</div>
        <button className="back-btn"><Share2 size={15} color="#94A3B8" /></button>
      </div>

      <div className="ts-asset-card glass-morphism-premium">
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:38, height:38, borderRadius:'50%', background:'#1E293B', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem' }}>📈</div>
          <div>
            <div style={{ fontFamily:'Space Grotesk', fontWeight:700, fontSize:'0.95rem' }}>{sym}</div>
            <div style={{ fontSize:'0.7rem', color:'#94A3B8' }}>AI Analysis Platform</div>
          </div>
        </div>
        <div className="live-badge"><span className="live-dot" />LIVE</div>
      </div>

      {/* ── AI Signal ── */}
      <AISignalCard signal={ai_signal} score={ai_score} color={ai_color} reason={ai_reason} ui_effects={ui_effects} />

      {/* ── AI Risk Firewall ── */}
      <AIRiskFirewall active={firewallActive} reason={firewallReason} onAbort={onBack} />

      {/* ── AI Trade Copilot Partner ── */}
      <AICopilotFeedback symbol={sym} score={ai_score} onFirewall={(r) => { setFirewallActive(true); setFirewallReason(r); }} />

      {/* ── EXACT GARCH-LSTM PRICE & REGIME PREDICTION ── */}
      {predicted_price && (
        <div 
          className="glass-morphism-premium probability-glow" 
          style={{ 
            background:'var(--card)', 
            border:'1px solid rgba(168,85,247,0.3)', 
            borderRadius:14, 
            padding:'16px', 
            margin:'0 16px 16px',
            '--glow-color': 'rgba(168,85,247,0.2)' 
          }}
        >
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
            <span style={{ fontSize:'1.2rem' }}>🔮</span>
            <span style={{ fontFamily:'Space Grotesk', fontWeight:700, fontSize:'0.95rem', color:'#A855F7' }}>GARCH-LSTM Intelligence</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
             <div>
                <div style={{ fontSize: '1.875rem', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text)' }}>
                  {currency}{typeof predicted_price === 'number' ? predicted_price.toFixed(2) : Number(predicted_price).toFixed(2)}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: 500 }}>Neural Price Forecast</div>
             </div>
             <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--green)' }}>{model_accuracy}%</div>
                <div style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: 500 }}>Model Confidence</div>
             </div>
          </div>
          
          <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'10px 12px', border:'1px solid rgba(255,255,255,0.05)' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Market Regime (12 States)</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--neon-blue)', fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase' }}>{result.market_regime || 'Stable'}</div>
             </div>
             <div style={{ marginTop: '8px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                <div className="animate-pulse" style={{ height: '100%', background: 'var(--neon-blue)', width: '100%' }} />
             </div>
          </div>
        </div>
      )}

      {/* ── Price Levels + Chart ── */}
      <div className="ts-main-card glass-morphism-premium">
        <PriceChart priceData={price_data} entry={entry} sl={stop_loss} t1={targets?.T1} t2={targets?.T2} t3={targets?.T3} atr={atr} auraColor={ai_color} currency={currency} predictedPrice={predicted_price} aiSignal={ai_signal} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginTop:8 }}>
          <div style={{ background:'rgba(34,197,94,0.06)', borderRadius:8, padding:'8px 10px' }}>
            <div style={{ fontSize:'0.6rem', color:'#94A3B8' }}>ENTRY</div>
            <div style={{ fontFamily:'Space Grotesk', fontWeight:700, color:'#22C55E' }}>
              {currency}{entry !== undefined && !isNaN(Number(entry)) ? Number(entry).toFixed(2) : '0.00'}
            </div>
          </div>
          <div style={{ background:'rgba(239,68,68,0.06)', borderRadius:8, padding:'8px 10px' }}>
            <div style={{ fontSize:'0.6rem', color:'#94A3B8' }}>STOP LOSS ({slPct}%)</div>
            <div style={{ fontFamily:'Space Grotesk', fontWeight:700, color:'#EF4444' }}>
              {currency}{stop_loss !== undefined && !isNaN(Number(stop_loss)) ? Number(stop_loss).toFixed(2) : '0.00'}
            </div>
          </div>
        </div>
      </div>

      <div className="ts-conf-card glass-morphism-premium">
        <Stars count={confidence||3} label={confLabel} />
      </div>

      <InvestmentCalc entry={entry} sl={stop_loss} t1={targets?.T1} t2={targets?.T2} t3={targets?.T3} currency={currency} priceData={price_data} timestamp={result.timestamp} />
      <CurrencyConverter />

      {/* Important Note */}
      <div className="ts-imp-card" style={{ margin: '0 16px 10px' }}>
        <div style={{ fontSize:'0.72rem', color:'#94A3B8', lineHeight:1.5 }}>
          This trade setup is based on probability and market volatility. Targets are not guaranteed.
        </div>
      </div>
    </>
  )
}
