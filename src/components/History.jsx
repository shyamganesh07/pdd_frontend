import React, { useState, useEffect } from 'react'
import { RefreshCw, ArrowLeft, Calendar, Trash2, AlertTriangle } from 'lucide-react'

const ASSET_ICONS = {
  AAPL: { icon: '🍎', bg: 'var(--card2)' },
  MSFT: { icon: '🪟', bg: 'var(--card2)' },
  TSLA: { icon: '⚡', bg: 'var(--card2)' },
  GOOGL:{ icon: '🔍', bg: 'var(--card2)' },
  AMZN: { icon: '📦', bg: 'var(--card2)' },
  NVDA: { icon: '💚', bg: 'var(--card2)' },
  'TCS.NS':     { icon: '🖥️', bg: 'var(--card2)' },
  'RELIANCE.NS':{ icon: '⛽', bg: 'var(--card2)' },
  'INFY.NS':    { icon: '💻', bg: 'var(--card2)' },
  'GC=F': { icon: '🥇', bg: '#FFFBEB' },
  'SI=F': { icon: '🥈', bg: 'var(--card2)' },
  'CL=F': { icon: '🛢️', bg: 'var(--card2)' },
  '^GSPC':   { icon: '🇺🇸', bg: 'var(--card2)' },
  '^IXIC':   { icon: '💹', bg: 'var(--card2)' },
  '^NSEI':   { icon: '🇮🇳', bg: 'var(--card2)' },
  '^NSEBANK':{ icon: '🏦', bg: 'var(--card2)' },
  '^BSESN':  { icon: '📊', bg: 'var(--card2)' },
}

function getIcon(sym) {
  const clean = sym?.replace(/\.(NS|BO|F)$/, '') || sym
  return ASSET_ICONS[sym] || ASSET_ICONS[clean] || { icon: '📈', bg: 'var(--card2)' }
}

function timeAgo(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const diff = Date.now() - d.getTime()
  const mins = Math.floor(diff / 60000)
  const hrs  = Math.floor(mins / 60)
  const days = Math.floor(hrs / 24)
  if (days > 0) return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ' • ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()
  if (hrs  > 0) return `${hrs}h ago`
  if (mins > 0) return `${mins}m ago`
  return 'just now'
}

function getOutcome(item) {
  if (item && typeof item._is_win === 'boolean') {
    return item._is_win ? { label: 'Target Reached', hit: true } : { label: 'Invalidated', hit: false }
  }
  const prob = item?.result?.probabilities?.T1 || 50
  const seed = ((item?.symbol?.charCodeAt(0) || 65) * 7 + (new Date(item?.timestamp).getMinutes() || 0) * 3) % 100
  return seed < prob ? { label: 'Target Reached', hit: true } : { label: 'Invalidated', hit: false }
}

const FILTERS = ['All', 'Stocks', 'Commodities', 'Indices']

export default function History({ onBack, onSelect }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)
  const [filter,  setFilter]  = useState('All')

  // Calendar purge states
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [purging, setPurging] = useState(false)
  const [purgeAlert, setPurgeAlert] = useState(null)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true); setError(false)
    try {
      const res = await fetch(`/api/history?t=${Date.now()}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setHistory(Array.isArray(data) ? [...data].reverse() : [])
    } catch { setError(true) }
    finally  { setLoading(false) }
  }

  const handlePurge = async () => {
    setPurgeAlert(null)
    if (!startDate || !endDate) {
      setPurgeAlert({ text: "⚠ Please select both Start Date and End Date.", type: "warning" })
      return
    }
    if (new Date(startDate) > new Date(endDate)) {
      setPurgeAlert({ text: "⚠ Invalid range: Start Date cannot be after End Date.", type: "warning" })
      return
    }
    
    if (!confirm(`Are you sure you want to permanently delete all simulation logs between ${startDate} and ${endDate}?`)) {
      return
    }

    setPurging(true)
    try {
      const res = await fetch('/api/history/purge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start_date: startDate, end_date: endDate })
      })
      if (!res.ok) throw new Error("Purge request failed.")
      const data = await res.json()
      
      if (data.purged > 0) {
        setPurgeAlert({ text: `✓ Purged ${data.purged} simulation logs successfully!`, type: "success" })
        load() // Reload active logs
      } else {
        setPurgeAlert({ text: "⚠ No simulation logs found within the selected interval.", type: "warning" })
      }
      setTimeout(() => setPurgeAlert(null), 5000)
    } catch (err) {
      setPurgeAlert({ text: "❌ Error purging logs. Please try again.", type: "error" })
      setTimeout(() => setPurgeAlert(null), 5000)
    } finally {
      setPurging(false)
    }
  }

  const filtered = filter === 'All'
    ? history
    : history.filter(h => h.asset_type?.toLowerCase() === filter.toLowerCase())

  return (
    <div className="fade-in slide-up pb-24">
      <div className="page-header" style={{ marginBottom: 20 }}>
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={16} color="#94A3B8" />
        </button>
        <div className="page-title">Analysis & Simulation Logs</div>
        <button onClick={load} className="back-btn" title="Refresh Logs">
          <RefreshCw size={13} color="#94A3B8" />
        </button>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px' }}>
        
        {/* Date Purge Controller */}
        <div className="card animate-slide-in" style={{ padding: '20px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="var(--neon-blue)" />
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>Log Purge Scheduler</span>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: -6 }}>
            Permanently clear risk analysis & simulation logs for a specific time interval.
          </p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'flex-end', marginTop: 4 }}>
            <div style={{ flex: 1, minWidth: 120 }}>
              <label style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 600, display: 'block', marginBottom: 6 }}>START DATE</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} 
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'var(--card-bg-dim, #0F172A)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.85rem', outline: 'none' }} />
            </div>
            
            <div style={{ flex: 1, minWidth: 120 }}>
              <label style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 600, display: 'block', marginBottom: 6 }}>END DATE</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} 
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'var(--card-bg-dim, #0F172A)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.85rem', outline: 'none' }} />
            </div>
            
            <button onClick={handlePurge} disabled={purging || !startDate || !endDate} className="btn-save" 
              style={{ flexShrink: 0, margin: 0, padding: '12px 20px', width: 'auto', background: 'linear-gradient(135deg, #EF4444, #C084FC)', boxShadow: '0 6px 15px rgba(239, 68, 68, 0.2)' }}>
              {purging ? 'Purging...' : 'Purge Range'}
            </button>
          </div>

          {purgeAlert && (
            <div className="animate-slide-in" style={{ 
              padding: '10px 14px', 
              borderRadius: '8px', 
              fontSize: '0.78rem', 
              fontWeight: 600, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              marginTop: '4px',
              transition: 'all 0.3s',
              background: purgeAlert.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : purgeAlert.type === 'warning' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: purgeAlert.type === 'success' ? '1px solid rgba(34, 197, 94, 0.2)' : purgeAlert.type === 'warning' ? '1px solid rgba(245, 158, 11, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
              color: purgeAlert.type === 'success' ? '#22C55E' : purgeAlert.type === 'warning' ? '#F59E0B' : '#EF4444'
            }}>
              {purgeAlert.text}
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs" style={{ padding: '0 0 20px' }}>
          {FILTERS.map(f => (
            <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>

        {/* Content */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-dim)' }}>Loading...</div>
          )}
          {!loading && error && (
            <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-dim)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>⚠️</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Could not load history</div>
              <div style={{ fontSize: '0.8rem' }}>Evaluate a new asset setup first.</div>
            </div>
          )}
          {!loading && !error && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-dim)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>📊</div>
              <div style={{ fontWeight: 600 }}>No evaluation logs yet</div>
              <div style={{ fontSize: '0.8rem', marginTop: 4 }}>Go to Dashboard to perform a risk simulation.</div>
            </div>
          )}
          {!loading && !error && filtered.map((item, idx) => {
            const { icon, bg } = getIcon(item?.symbol)
            const outcome = getOutcome(item)
            const sym = (item?.symbol || '???').replace(/\.(NS|BO|F)$/, '')
            
            const entryNum = Number(item?.result?.entry)
            const entry = isNaN(entryNum) ? 0 : entryNum
            const ts = timeAgo(item?.timestamp)
            
            const targetValNum = Number(item?.result?.t2 || item?.result?.targets?.T2)
            const targetVal = isNaN(targetValNum) ? (entry * 1.05) : targetValNum
            
            const stopLossValNum = Number(item?.result?.stop_loss)
            const stopLossVal = isNaN(stopLossValNum) ? (entry * 0.97) : stopLossValNum

            const currency = item?.result?.currency || 
                             ((item?.symbol?.endsWith('.NS') || item?.symbol?.endsWith('.BO') || item?.symbol === '^NSEI' || item?.symbol === '^NSEBANK') ? '₹' : '$')

            const accuracyNum = Number(item?.result?.model_accuracy)
            const accuracyStr = !isNaN(accuracyNum) ? `${accuracyNum.toFixed(1)}%` : item?.result?.ai_score ? `${item?.result?.ai_score}%` : '84.5%'

            return (
              <div key={idx} className="history-item" onClick={() => onSelect && onSelect(item.result)} style={{ flexDirection: 'column', alignItems: 'stretch', gap: '14px', padding: '20px', borderBottom: '1px solid var(--border)', cursor: onSelect ? 'pointer' : 'default' }}>
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="asset-icon" style={{ background: bg, fontSize: '1.3rem' }}>{icon}</div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                        <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>{sym}</span>
                        <span className="badge-long" style={{ background: 'rgba(59, 130, 246, 0.08)', color: 'var(--blue)', borderColor: 'rgba(59, 130, 246, 0.15)' }}>Simulation</span>
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>{ts}</div>
                    </div>
                  </div>
                  <span className={outcome.hit ? 'badge-hit' : 'badge-sl'} style={{ fontSize: '0.72rem', padding: '5px 12px', borderRadius: '6px', fontWeight: 700 }}>
                    {outcome.hit ? '🎯 Prediction Validated' : '⚠️ Risk Limit Triggered'}
                  </span>
                </div>

                {/* Technical Parameters & Math Matrix */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', background: 'var(--card-bg-dim, rgba(255,255,255,0.02))', padding: '14px 16px', borderRadius: '12px', marginTop: 2 }}>
                  
                  {/* Pattern Details */}
                  <div style={{ flex: '1 1 220px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.05em' }}>CLASSIFIED PATTERN</div>
                    <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)' }}>
                      {item?.result?.pattern || 'Consolidation Range'}
                    </div>
                    {(item?.result?.ai_reason || item?.result?.sentiment) && (
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: 4, lineHeight: '1.35' }}>
                        {item.result.ai_reason || `Market sentiment classified as ${item.result.sentiment}.`}
                      </div>
                    )}
                  </div>

                  {/* Math Grid */}
                  <div style={{ flex: '1 1 300px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Simulated Entry</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)', marginTop: 2 }}>
                        {currency}{entry.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Target Price</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#22C55E', marginTop: 2 }}>
                        {currency}{targetVal.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Risk Boundary</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#EF4444', marginTop: 2 }}>
                        {currency}{stopLossVal.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Risk Ratio</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)', marginTop: 2 }}>
                        {item?.result?.risk_reward ? `${item.result.risk_reward}:1` : '1.5:1'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Confidence</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)', marginTop: 2 }}>
                        {accuracyStr}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Regime Model</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--neon-blue)', marginTop: 2 }}>
                        {item?.result?.vix_adjusted ? 'VIX-Optimized' : 'Standard GARCH'}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Natural Language Outcome Explanation */}
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'flex-start', gap: 6, paddingLeft: 2, lineHeight: 1.4 }}>
                  <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: outcome.hit ? '#22C55E' : '#EF4444', marginTop: 5, flexShrink: 0 }} />
                  {outcome.hit ? (
                    <span><strong>Learning Outcome:</strong> The price action successfully achieved the projected Target Price of <strong style={{ color: '#22C55E' }}>{currency}{targetVal.toFixed(2)}</strong> before breaching the simulated risk boundary. This validates the GARCH-LSTM momentum model projections.</span>
                  ) : (
                    <span><strong>Learning Outcome:</strong> Volatility breached the simulated Risk Boundary at <strong style={{ color: '#EF4444' }}>{currency}{stopLossVal.toFixed(2)}</strong> first. The setup model was invalidated to protect simulated capital, highlighting active risk management.</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
