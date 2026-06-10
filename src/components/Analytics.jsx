import React, { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { TrendingUp, BarChart2, Shield } from 'lucide-react'

const PERF = [
  { d:'W1',v:6 },{ d:'W2',v:18 },{ d:'W3',v:11 },{ d:'W4',v:29 },
  { d:'W5',v:23 },{ d:'W6',v:42 },{ d:'W7',v:37 },{ d:'W8',v:52 },
]
const WIN_DATA = [{ name:'Win',value:72 },{ name:'Loss',value:28 }]
const COLORS   = ['#10B981','#E2E8F0']

const PerfTT = ({ active, payload, label }) => active && payload?.length ? (
  <div style={{ background:'var(--card)', border:'1px solid var(--green)', borderRadius:8, padding:'5px 10px', fontSize:'0.75rem', color:'var(--green)', fontFamily:'Space Grotesk', fontWeight:700, boxShadow:'0 4px 10px rgba(0,0,0,0.05)' }}>
    {label}: +{payload[0].value}%
  </div>
) : null

// ── Loss Recovery Tool ──
function RecoveryTool() {
  const [loss,     setLoss]     = useState('')
  const [currency, setCurrency] = useState('INR')
  const [results,  setResults]  = useState([])
  const [loading,  setLoading]  = useState(false)
  const [searched, setSearched] = useState(false)

  const find = async () => {
    if (!loss || isNaN(parseFloat(loss))) return alert('Please enter a valid loss amount')
    setLoading(true); setSearched(true)
    try {
      const res = await fetch(`/api/recover?loss=${encodeURIComponent(loss)}&currency=${currency}`)
      if (res.ok) setResults(await res.json())
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  return (
    <div className="card">
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
        <Shield size={16} color="#EF4444" />
        <div style={{ fontFamily:'Space Grotesk', fontWeight:700, fontSize:'0.95rem' }}>Loss Recovery Tool</div>
        <span style={{ fontSize:'0.6rem', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#EF4444', padding:'1px 6px', borderRadius:4, fontWeight:700 }}>UNIQUE</span>
      </div>
      <div style={{ fontSize:'0.75rem', color:'var(--text-dim)', marginBottom:12, lineHeight:1.6 }}>
        Lost money in a trade? Enter your loss — our AI will find the <strong style={{ color:'var(--text)' }}>best asset to recover it in a single day</strong>.
      </div>

      {/* Input Row */}
      <div style={{ display:'flex', gap:6, marginBottom:10 }}>
        <div style={{ display:'flex', gap:0, background:'var(--card2)', border:'1px solid var(--border)', borderRadius:8, overflow:'hidden', flex:1 }}>
          <select value={currency} onChange={e=>setCurrency(e.target.value)}
            style={{ background:'transparent', border:'none', color:'var(--text)', padding:'8px 10px', fontSize:'0.8rem', fontFamily:'Space Grotesk', fontWeight:700, outline:'none' }}>
            <option>INR</option>
            <option>USD</option>
          </select>
          <input type="number" placeholder="Enter loss amount" value={loss} onChange={e=>setLoss(e.target.value)}
            style={{ flex:1, background:'transparent', border:'none', borderLeft:'1px solid var(--border)', padding:'8px 10px', color:'var(--text)', fontSize:'0.88rem', fontFamily:'Space Grotesk', outline:'none' }} />
        </div>
        <button onClick={find} disabled={loading}
          style={{ padding:'8px 14px', background:'linear-gradient(135deg,#EF4444,#DC2626)', border:'none', borderRadius:8, color:'white', fontFamily:'Space Grotesk', fontWeight:700, fontSize:'0.8rem', cursor:'pointer', whiteSpace:'nowrap' }}>
          {loading ? '...' : 'Find Recovery'}
        </button>
      </div>

      {/* Results */}
      {loading && (
        <div style={{ textAlign:'center', padding:'16px 0', color:'#94A3B8', fontSize:'0.8rem' }}>
          <svg style={{ animation:'spin 1s linear infinite', marginBottom:4 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          <div>Scanning recovery opportunities...</div>
        </div>
      )}
      {!loading && searched && results.length === 0 && (
        <div style={{ textAlign:'center', padding:'12px', color:'#94A3B8', fontSize:'0.8rem' }}>
          No recovery opportunities found. Try again later.
        </div>
      )}
      {!loading && results.map((r, i) => (
        <div key={r.symbol} style={{
          background: i===0 ? 'rgba(239,68,68,0.06)' : 'var(--card2)',
          border:`1px solid ${i===0 ? 'rgba(239,68,68,0.2)' : 'var(--border)'}`,
          borderRadius:10, padding:'10px 12px', marginBottom:6,
        }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:'1.2rem' }}>{r.icon}</span>
              <div>
                <div style={{ fontFamily:'Space Grotesk', fontWeight:700, fontSize:'0.85rem', display:'flex', alignItems:'center', gap:5 }}>
                  {r.name}
                  {i===0 && <span style={{ fontSize:'0.55rem', background:'#EF4444', color:'white', padding:'1px 5px', borderRadius:4 }}>BEST BET</span>}
                </div>
                <div style={{ fontSize:'0.65rem', color:'#94A3B8' }}>Entry: {r.currency}{r.entry?.toFixed(2)} → T1: {r.currency}{r.t1?.toFixed(2)}</div>
              </div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:'Space Grotesk', fontWeight:700, color:'#22C55E', fontSize:'0.88rem' }}>+{r.gain_pct}%</div>
              <div style={{ fontSize:'0.6rem', color:'#4B5563' }}>{r.t1_prob}% probability</div>
            </div>
          </div>
          <div style={{ padding:'7px 10px', background:'rgba(34,197,94,0.04)', border:'1px solid rgba(34,197,94,0.1)', borderRadius:8, fontSize:'0.72rem', color:'#94A3B8', lineHeight:1.6 }}>
            💡 Invest <strong style={{ color:'#22C55E' }}>{r.currency} {r.invest?.toLocaleString()}</strong> in {r.name} to potentially recover your {r.currency} {parseFloat(loss).toLocaleString()} loss.
            <span style={{ color:'#F59E0B' }}> · {r.risk}</span>
          </div>
        </div>
      ))}

      {results.length > 0 && (
        <div style={{ marginTop:8, padding:'8px', background:'rgba(245,158,11,0.05)', border:'1px solid rgba(245,158,11,0.15)', borderRadius:8, fontSize:'0.68rem', color:'#94A3B8', lineHeight:1.5 }}>
          ⚠️ Recovery suggestions are probability-based. Never invest more than you can afford to lose. Consider your risk tolerance.
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

export default function Analytics() {
  const [tab, setTab] = useState('Performance')

  return (
    <div className="fade-in slide-up">
      <div style={{ padding:'20px 24px 0', fontFamily:'Space Grotesk', fontWeight:700, fontSize:'1.2rem' }}>Analytics</div>

      {/* Tabs */}
      <div className="tab-row" style={{ borderBottom:'1px solid var(--border)', marginBottom:2 }}>
        {['Performance','Statistics','Recovery'].map(t => (
          <button key={t} className={`analytics-tab ${tab===t?'active':''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {/* ── Donut + Stats (shown in Performance + Statistics) ── */}
      {tab !== 'Recovery' && (
        <div className="card" style={{ display:'flex', alignItems:'center', gap:16 }}>
          <div className="donut-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={WIN_DATA} innerRadius={44} outerRadius={60} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270} strokeWidth={0}>
                  {WIN_DATA.map((_,i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-center">
              <div style={{ fontFamily:'Space Grotesk', fontWeight:700, fontSize:'1.3rem', color:'var(--green)', lineHeight:1 }}>72%</div>
              <div style={{ fontSize:'0.55rem', color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Win Rate</div>
            </div>
          </div>
          <div style={{ flex:1 }}>
            {[
              { label:'Total Trades', val:'25',  color:'var(--text)' },
              { label:'Win Rate',     val:'72%', color:'var(--green)' },
              { label:'Avg R:R',      val:'2.18',color:'var(--blue)' },
              { label:'Profit Factor',val:'1.85',color:'var(--text)' },
            ].map(({ label,val,color }) => (
              <div key={label} className="stat-row">
                <span style={{ fontSize:'0.78rem', color:'var(--text-dim)' }}>{label}</span>
                <span style={{ fontFamily:'Space Grotesk', fontWeight:700, fontSize:'0.9rem', color }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance chart */}
      {tab === 'Performance' && (
        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <span style={{ fontSize:'0.82rem', color:'#94A3B8' }}>Performance (Last 30 Days)</span>
            <span style={{ fontFamily:'Space Grotesk', fontWeight:700, fontSize:'0.82rem', color:'#22C55E' }}>+18.6%</span>
          </div>
          <div style={{ height:120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PERF} margin={{ top:4, right:4, bottom:0, left:-28 }}>
                <defs>
                  <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#22C55E" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="d" tick={{ fill:'var(--text-dim)', fontSize:10, fontFamily:'Space Grotesk' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:'var(--text-dim)', fontSize:10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<PerfTT />} />
                <Area type="monotone" dataKey="v" stroke="var(--green)" strokeWidth={2} fill="url(#pg)" dot={false}
                  activeDot={{ r:4, fill:'var(--green)', strokeWidth:0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Statistics grid */}
      {tab === 'Statistics' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, padding:'0 16px 12px' }}>
          {[
            { label:'Total Trades',  val:'25',   sub:'Last 30 days',    color:'var(--text)' },
            { label:'Avg R:R',       val:'2.18', sub:'Per trade avg',    color:'var(--blue)' },
            { label:'Profit Factor', val:'1.85', sub:'Gross/loss ratio', color:'var(--green)' },
            { label:'Win Streak',    val:'5',    sub:'Current streak',   color:'#F59E0B' },
            { label:'Avg Hold Time', val:'1.3d', sub:'Per trade',        color:'var(--text)' },
            { label:'Max Drawdown',  val:'8.2%', sub:'Worst loss streak',color:'#EF4444' },
          ].map(({ label,val,sub,color }) => (
            <div key={label} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:16, boxShadow:'0 4px 10px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize:'0.65rem', color:'var(--text-dim)', marginBottom:6, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</div>
              <div style={{ fontFamily:'Space Grotesk', fontWeight:700, fontSize:'1.25rem', color, lineHeight:1 }}>{val}</div>
              <div style={{ fontSize:'0.63rem', color:'#4B5563', marginTop:4 }}>{sub}</div>
            </div>
          ))}
        </div>
      )}

      {/* 🛡️ Recovery Tool */}
      {tab === 'Recovery' && <RecoveryTool />}
    </div>
  )
}
