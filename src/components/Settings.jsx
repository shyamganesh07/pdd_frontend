import React, { useState } from 'react'
import { Globe, Moon, Bell, Sliders, RefreshCw, ArrowLeft, ChevronRight, Save, CheckCircle, Activity } from 'lucide-react'

const DEFAULT_K = {
  stocks:      { label: 'Stocks',      k: 1.2 },
  commodities: { label: 'Commodities', k: 2.5 },
  indices:     { label: 'Indices',     k: 1.8 },
  forex:       { label: 'Forex',       k: 1.5 },
  crypto:      { label: 'Crypto',      k: 2.2 },
}

// ── Asset Parameters Sub-screen ──
function AssetParameters({ onBack }) {
  const [params, setParams] = useState(() => {
    try { return JSON.parse(localStorage.getItem('k_params') || 'null') || DEFAULT_K }
    catch { return DEFAULT_K }
  })
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      const config = {}
      Object.entries(params).forEach(([k, v]) => { config[k] = { k: parseFloat(v.k) } })
      await fetch('/api/config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) })
      localStorage.setItem('k_params', JSON.stringify(params))
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch { localStorage.setItem('k_params', JSON.stringify(params)); setSaved(true); setTimeout(() => setSaved(false), 2000) }
    finally { setSaving(false) }
  }

  return (
    <>
      <div className="page-header">
        <button className="back-btn" onClick={onBack}><ArrowLeft size={16} color="#94A3B8" /></button>
        <div className="page-title">Asset Parameters</div>
        <div style={{ width: 34 }} />
      </div>

      <div className="settings-card">
        {Object.entries(params).map(([key, { label, k }]) => (
          <div key={key} className="param-row">
            <div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.9rem' }}>{label}</div>
              <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: 2 }}>k Value</div>
            </div>
            <input type="number" step="0.1" min="0.5" max="5" value={k} className="k-input"
              onChange={e => setParams(p => ({ ...p, [key]: { ...p[key], k: e.target.value } }))} />
          </div>
        ))}
      </div>

      <button className="btn-save" onClick={save} disabled={saving}>
        {saved ? '✓ SAVED!' : saving ? 'SAVING...' : 'SAVE CHANGES'}
      </button>
    </>
  )
}

// ── Main Settings Screen ──
export default function Settings() {
  const [showParams, setShowParams] = useState(false)
  const [darkMode,   setDarkMode]   = useState(true)
  const [notifs,     setNotifs]     = useState(true)
  const [backendIp,   setBackendIp]   = useState(() => {
    const saved = localStorage.getItem('backend_ip');
    return (!saved || saved === '192.168.137.1') ? 'https://trademind-backend-vldj.onrender.com' : saved;
  })
  const [backendPort, setBackendPort] = useState(() => localStorage.getItem('backend_port') || '8000')

  if (showParams) return <AssetParameters onBack={() => setShowParams(false)} />

  return (
    <>
      <div style={{ padding: '20px 16px 0', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.2rem' }}>Settings</div>

      {/* General */}
      <p className="settings-section-title">General</p>
      <div className="settings-card">
        {/* Unit System */}
        <div className="settings-row">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="settings-icon"><Globe size={14} color="#94A3B8" /></div>
            <div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '0.88rem' }}>Unit System</div>
            </div>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Metric (Default)</span>
        </div>
        {/* Theme */}
        <div className="settings-row">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="settings-icon"><Moon size={14} color="#94A3B8" /></div>
            <div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '0.88rem' }}>Theme</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#94A3B8', fontSize: '0.78rem' }}>
            Dark <ChevronRight size={14} />
          </div>
        </div>
        {/* Notifications */}
        <div className="settings-row">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="settings-icon"><Bell size={14} color="#94A3B8" /></div>
            <div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '0.88rem' }}>Notifications</div>
            </div>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={notifs} onChange={e => setNotifs(e.target.checked)} />
            <span className="toggle-track" />
          </label>
        </div>
      </div>

      {/* User Profile Mode */}
      <p className="settings-section-title">Multi-Mode Experience</p>
      <div className="settings-card">
        <div className="settings-row" style={{ paddingBottom: 10, borderBottom: 'none' }}>
          <div>
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '0.88rem', color: '#F1F5F9' }}>Active Profile</div>
            <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: 1 }}>Adapts UI and AI recommendations</div>
          </div>
        </div>
        <div style={{ padding: '0 24px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {['Beginner Investor', 'Swing Trader', 'Intraday Trader', 'Conservative', 'Aggressive'].map(mode => (
            <label key={mode} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 12px', background: 'var(--card2)', borderRadius: 8, border: '1px solid transparent' }} className="hover:border-blue transition-colors">
              <input type="radio" name="traderMode" defaultChecked={mode === 'Beginner Investor'} style={{ accentColor: 'var(--blue)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{mode}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Trading Parameters */}
      <p className="settings-section-title">Trading Parameters</p>
      <div className="settings-card">
        <button className="settings-row" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          onClick={() => setShowParams(true)}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="settings-icon"><Sliders size={14} color="#94A3B8" /></div>
            <div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '0.88rem', color: '#F1F5F9' }}>Asset Parameters</div>
              <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: 1 }}>Manage k values, ATR settings</div>
            </div>
          </div>
          <ChevronRight size={16} color="#4B5563" />
        </button>
        <button className="settings-row" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderBottom: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="settings-icon"><Activity size={14} color="#94A3B8" /></div>
            <div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '0.88rem', color: '#F1F5F9' }}>Pattern Settings</div>
              <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: 1 }}>Manage pattern thresholds</div>
            </div>
          </div>
          <ChevronRight size={16} color="#4B5563" />
        </button>
      </div>

      {/* Data */}
      <p className="settings-section-title">Data</p>
      <div className="settings-card">
        <button className="settings-row" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderBottom: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="settings-icon"><RefreshCw size={14} color="#94A3B8" /></div>
            <div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '0.88rem', color: '#F1F5F9' }}>Refresh Data</div>
              <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: 1 }}>Update market data manually</div>
            </div>
          </div>
          <ChevronRight size={16} color="#4B5563" />
        </button>
      </div>

      {/* Connection (Mobile App) */}
      <p className="settings-section-title">Connection (Mobile App)</p>
      <div className="settings-card" style={{ padding: '16px' }}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '0.88rem', color: '#F1F5F9' }}>Backend Server Connection</div>
          <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: 2 }}>Set to your PC's IP and port if running on a mobile device.</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input 
            type="text" 
            placeholder="IP Address (e.g. 192.168.137.1)" 
            value={backendIp} 
            onChange={e => {
              setBackendIp(e.target.value)
              localStorage.setItem('backend_ip', e.target.value)
            }}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '8px 12px',
              color: 'white',
              fontSize: '0.82rem',
              outline: 'none'
            }}
          />
          <input 
            type="text" 
            placeholder="Port" 
            value={backendPort} 
            onChange={e => {
              setBackendPort(e.target.value)
              localStorage.setItem('backend_port', e.target.value)
            }}
            style={{
              width: 70,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '8px 12px',
              color: 'white',
              fontSize: '0.82rem',
              textAlign: 'center',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Version */}
      <div style={{ textAlign: 'center', padding: '16px', color: '#4B5563', fontSize: '0.7rem' }}>
        TradeMind AI v3.0 • Institutional OS
      </div>
    </>
  )
}
