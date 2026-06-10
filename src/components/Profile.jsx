import React, { useState, useEffect } from 'react'
import { Globe, Moon, Bell, Sliders, RefreshCw, ArrowLeft, ChevronRight, Save, CheckCircle, Activity, Mail, KeyRound, LogOut, User as UserIcon, Camera, Phone, FileText, Edit3, TrendingUp, Coins, ShieldAlert } from 'lucide-react'

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

  const getIcon = (key) => {
    switch (key) {
      case 'stocks': return <TrendingUp size={18} color="var(--neon-blue)" />
      case 'commodities': return <Coins size={18} color="var(--neon-orange)" />
      case 'indices': return <Activity size={18} color="var(--neon-green)" />
      case 'forex': return <Globe size={18} color="var(--neon-purple)" />
      case 'crypto': return <Coins size={18} color="var(--neon-cyan)" />
      default: return <Sliders size={18} />
    }
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
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="settings-icon">{getIcon(key)}</div>
              <div>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>{label}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: 2 }}>Multiplicative k parameter</div>
              </div>
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

// ── Edit Profile Sub-screen ──
function EditProfile({ user, onSave, onBack }) {
  const [name, setName] = useState(user.name || '')
  const [bio, setBio] = useState(user.bio || '')
  const [phone, setPhone] = useState(user.phone || '')
  const [pic, setPic] = useState(user.pic || '')
  const [saving, setSaving] = useState(false)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    // File size check: limit to 2MB for localStorage stability
    if (file.size > 2 * 1024 * 1024) {
      alert("Please upload an image smaller than 2MB.")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setPic(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updatedUser = {
        ...user,
        name,
        bio,
        phone,
        pic
      }
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      })
      if (res.ok) {
        const data = await res.json()
        onSave(data.user)
      } else {
        onSave(updatedUser)
      }
    } catch (e) {
      console.error("Failed to save profile on backend:", e)
      onSave({
        ...user,
        name,
        bio,
        phone,
        pic
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fade-in slide-up">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}><ArrowLeft size={16} color="#94A3B8" /></button>
        <div className="page-title">Edit Profile</div>
        <div style={{ width: 34 }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '24px 0' }}>
        <div style={{ position: 'relative', width: 100, height: 100, borderRadius: '50%', overflow: 'visible', border: '2px solid var(--neon-blue)', boxShadow: '0 0 15px rgba(0, 229, 255, 0.2)' }}>
          {pic ? (
            <img src={pic} alt="Avatar Preview" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--card-bg-dim, #1E293B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, color: 'var(--text)' }}>
              {name ? name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </div>
          )}
          
          <label style={{ position: 'absolute', bottom: -5, right: -5, width: 34, height: 34, borderRadius: '50%', background: 'var(--neon-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', border: '2px solid var(--card)' }} title="Upload Photo">
            <Camera size={16} color="#000" />
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
          </label>
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: 12 }}>Allowed formats: JPG, PNG, GIF (Max 2MB)</div>
      </div>

      <div className="settings-card" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '20px' }}>
        <div className="input-group-edit">
          <label style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600, display: 'block', marginBottom: 6 }}>Full Name</label>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--card-bg-dim, #0F172A)', borderRadius: 8, border: '1px solid var(--border)', padding: '10px 14px' }}>
            <UserIcon size={16} color="var(--text-dim)" style={{ marginRight: 10 }} />
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter full name" style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text)', width: '100%', fontSize: '0.88rem' }} />
          </div>
        </div>

        <div className="input-group-edit">
          <label style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600, display: 'block', marginBottom: 6 }}>Phone Number</label>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--card-bg-dim, #0F172A)', borderRadius: 8, border: '1px solid var(--border)', padding: '10px 14px' }}>
            <Phone size={16} color="var(--text-dim)" style={{ marginRight: 10 }} />
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Enter phone number" style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text)', width: '100%', fontSize: '0.88rem' }} />
          </div>
        </div>

        <div className="input-group-edit">
          <label style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600, display: 'block', marginBottom: 6 }}>Trading Style / Bio</label>
          <div style={{ display: 'flex', alignItems: 'flex-start', background: 'var(--card-bg-dim, #0F172A)', borderRadius: 8, border: '1px solid var(--border)', padding: '10px 14px' }}>
            <FileText size={16} color="var(--text-dim)" style={{ marginRight: 10, marginTop: 3 }} />
            <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about your trading style or strategy..." rows={3} style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text)', width: '100%', fontSize: '0.88rem', resize: 'none', fontFamily: 'inherit' }} />
          </div>
        </div>
      </div>

      <button className="btn-save" onClick={handleSave} disabled={saving} style={{ marginTop: 20 }}>
        {saving ? 'SAVING CHANGES...' : 'SAVE CHANGES'}
      </button>
    </div>
  )
}

// ── Pattern Settings Sub-screen ──
const DEFAULT_PATTERNS = {
  double_bottom: { label: 'Double Bottom Confidence', min: 70 },
  double_top:    { label: 'Double Top Confidence',    min: 70 },
  head_shoulders: { label: 'Head & Shoulders Confidence', min: 65 },
  breakout:      { label: 'Breakout Threshold',      min: 75 }
}

function PatternSettings({ onBack }) {
  const [patterns, setPatterns] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pattern_settings') || 'null') || DEFAULT_PATTERNS }
    catch { return DEFAULT_PATTERNS }
  })
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const save = () => {
    setSaving(true)
    setTimeout(() => {
      localStorage.setItem('pattern_settings', JSON.stringify(patterns))
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      setSaving(false)
    }, 600)
  }

  return (
    <>
      <div className="page-header">
        <button className="back-btn" onClick={onBack}><ArrowLeft size={16} color="#94A3B8" /></button>
        <div className="page-title">Pattern Settings</div>
        <div style={{ width: 34 }} />
      </div>

      <div className="settings-card">
        {Object.entries(patterns).map(([key, { label, min }]) => (
          <div key={key} className="param-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.88rem', color: 'var(--text)' }}>{label}</div>
              <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: 2 }}>Minimum detection confidence</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="range" min="50" max="95" value={min} className="pattern-range"
                onChange={e => setPatterns(p => ({ ...p, [key]: { ...p[key], min: parseInt(e.target.value) } }))} style={{ accentColor: 'var(--neon-blue)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--neon-blue)', width: 34, textAlign: 'right' }}>{min}%</span>
            </div>
          </div>
        ))}
      </div>

      <button className="btn-save" onClick={save} disabled={saving} style={{ marginTop: 20 }}>
        {saved ? '✓ SAVED!' : saving ? 'SAVING...' : 'SAVE CHANGES'}
      </button>
    </>
  )
}

// ── Main Profile Screen ──
export default function Profile({ user: propUser, onLogout, onProfileUpdate }) {
  const [user, setUser] = useState(() => {
    if (propUser) return propUser
    try { return JSON.parse(localStorage.getItem('user_profile') || 'null') }
    catch { return null }
  })

  useEffect(() => {
    if (propUser) {
      setUser(propUser)
    }
  }, [propUser])

  const [showEditProfile, setShowEditProfile] = useState(false)

  // Auth States
  const [email, setEmail] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Settings States
  const [showParams, setShowParams] = useState(false)
  const [showPatternSettings, setShowPatternSettings] = useState(false)
  const [unitSystem, setUnitSystem] = useState(() => {
    return localStorage.getItem('unit_system') || 'Metric'
  })
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') !== 'light'
  })
  const [notifs, setNotifs] = useState(() => {
    return localStorage.getItem('notifs_enabled') !== 'false'
  })
  const [traderMode, setTraderMode] = useState(() => {
    return localStorage.getItem('trader_mode') || 'Beginner Investor'
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.remove('light-theme')
      document.documentElement.classList.add('dark-theme')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark-theme')
      document.documentElement.classList.add('light-theme')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  useEffect(() => {
    // Check for pending local storage login (e.g. from redirection on mobile)
    const pending = localStorage.getItem('google_login_pending')
    if (pending) {
      try {
        const { email, name, pic, timestamp } = JSON.parse(pending)
        localStorage.removeItem('google_login_pending')
        if (Date.now() - timestamp < 300000) { // 5 minutes validity
          const mockUser = {
            name: name,
            email: email,
            pic: pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}&backgroundColor=b6e3f4`
          }
          setUser(mockUser)
          localStorage.setItem('user_profile', JSON.stringify(mockUser))
          if (onProfileUpdate) onProfileUpdate(mockUser)
        }
      } catch (e) {
        console.error(e)
      }
    }

    const handleGoogleMessage = (event) => {
      if (event.origin !== window.location.origin) return
      if (event.data && event.data.type === 'GOOGLE_SIGN_IN_SUCCESS') {
        const { email, name, pic } = event.data
        const mockUser = {
          name: name,
          email: email,
          pic: pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}&backgroundColor=b6e3f4`
        }
        setUser(mockUser)
        localStorage.setItem('user_profile', JSON.stringify(mockUser))
        if (onProfileUpdate) onProfileUpdate(mockUser)
      }
    }
    window.addEventListener('message', handleGoogleMessage)
    return () => window.removeEventListener('message', handleGoogleMessage)
  }, [onProfileUpdate])

  const toggleUnitSystem = () => {
    const next = unitSystem === 'Metric' ? 'Imperial' : 'Metric'
    setUnitSystem(next)
    localStorage.setItem('unit_system', next)
  }

  const handleNotifsChange = (enabled) => {
    setNotifs(enabled)
    localStorage.setItem('notifs_enabled', enabled ? 'true' : 'false')
    if (enabled) {
      if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
        Notification.requestPermission()
      }
      alert("✓ AI Signals & Trade Notifications Enabled!")
    } else {
      alert("✗ Notifications Muted.")
    }
  }

  const handleModeChange = (mode) => {
    setTraderMode(mode)
    localStorage.setItem('trader_mode', mode)
  }

  const handleSendOTP = async (e) => {
    e.preventDefault()
    if (!email.includes('@')) return setError('Invalid email address')
    setError('')
    setLoading(true)
    try {
      // Assuming Vite proxy handles /api
      const res = await fetch(`/api/send_otp?email=${encodeURIComponent(email)}`, { method: 'POST' })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Failed to send OTP')
      }
      setOtpSent(true)
    } catch (err) {
      setError(err.message || 'Error connecting to server')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    if (otp.length < 4) return setError('Invalid OTP')
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`/api/verify_otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`, { method: 'POST' })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Invalid OTP')
      }
      const data = await res.json()
      setUser(data.user)
      localStorage.setItem('user_profile', JSON.stringify(data.user))
      if (onProfileUpdate) onProfileUpdate(data.user)
    } catch (err) {
      setError(err.message || 'Error verifying OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      const { authService } = await import('../services/authService')
      const loggedInUser = await authService.login()
      setUser(loggedInUser)
      if (onProfileUpdate) onProfileUpdate(loggedInUser)
    } catch (err) {
      console.error("Google login error:", err)
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setUser(null)
    setOtpSent(false)
    setEmail('')
    setOtp('')
    localStorage.removeItem('user_profile')
    if (onLogout) onLogout()
  }

  if (showParams) return <AssetParameters onBack={() => setShowParams(false)} />
  if (showPatternSettings) return <PatternSettings onBack={() => setShowPatternSettings(false)} />

  if (showEditProfile) {
    return (
      <EditProfile 
        user={user} 
        onSave={(updatedUser) => {
          setUser(updatedUser)
          localStorage.setItem('user_profile', JSON.stringify(updatedUser))
          if (onProfileUpdate) onProfileUpdate(updatedUser)
          setShowEditProfile(false)
        }} 
        onBack={() => setShowEditProfile(false)} 
      />
    )
  }

  if (!user) {
    return (
      <div className="auth-container fade-in slide-up">
        <div className="auth-header">
          <div className="auth-brand-icon">
            <UserIcon size={32} color="#fff" />
          </div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to sync your trading preferences</p>
        </div>

        <div className="auth-card">
          <button className="btn-google" onClick={handleGoogleLogin}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google
          </button>

          <div className="auth-divider"><span>OR CONTINUE WITH EMAIL</span></div>

          {error && <div className="auth-error">{error}</div>}

          {!otpSent ? (
            <form onSubmit={handleSendOTP} className="auth-form">
              <div className="input-group">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-auth-primary" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Send Magic OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="auth-form">
              <p className="auth-hint">Enter the OTP sent to <strong>{email}</strong></p>
              <div className="input-group">
                <KeyRound size={18} className="input-icon" />
                <input 
                  type="text" 
                  placeholder="Enter OTP" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                />
              </div>
              <button type="submit" className="btn-auth-primary" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Sign In'}
              </button>
              <button type="button" className="btn-auth-link" onClick={() => setOtpSent(false)}>
                Use a different email
              </button>
            </form>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="profile-header-bg fade-in">
        <div className="profile-user-info">
          <div className="profile-avatar">
            {user.pic ? (
              <img src={user.pic} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">{user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}</div>
            )}
          </div>
          <div>
            <h2 className="profile-name">Welcome, {user.name || user.email.split('@')[0]}!</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <p className="profile-email" style={{ margin: 0 }}>{user.email}</p>
                <button onClick={() => setShowEditProfile(true)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 4, padding: '2px 8px', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', color: 'var(--neon-blue)', fontSize: '0.72rem', fontWeight: 600 }}>
                  <Edit3 size={11} /> Edit
                </button>
              </div>
              {user.uid && (
                <p style={{ fontSize: '0.68rem', color: 'var(--text-dim)', opacity: 0.8, fontFamily: 'monospace', margin: 0 }}>
                  UID: {user.uid}
                </p>
              )}
              {user.createdAt && (
                <p style={{ fontSize: '0.68rem', color: 'var(--text-dim)', opacity: 0.8, margin: 0 }}>
                  Uplink Established: {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              )}
            </div>
          </div>
        </div>
        <button className="btn-logout" onClick={handleLogout} title="Log Out">
          <LogOut size={18} />
        </button>
      </div>

      {user && user.email === 'guest@trademind.com' && (
        <div className="guest-login-prompt" style={{
          background: 'linear-gradient(135deg, rgba(66, 133, 244, 0.1), rgba(147, 51, 234, 0.1))',
          border: '1px solid rgba(66, 133, 244, 0.25)',
          borderRadius: '12px',
          padding: '16px',
          marginTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={20} color="var(--neon-cyan)" />
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>Temporary Guest Session</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: 0, lineHeight: 1.4 }}>
            You are logged in as a Guest. Sign in with your Google Account to automatically sync your trading history, portfolio balance, and settings securely.
          </p>
          <button className="btn-google" onClick={handleGoogleLogin} style={{ width: '100%', maxWidth: '280px', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', fontSize: '0.85rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google
          </button>
        </div>
      )}

      <div style={{ marginTop: '20px' }} className="fade-in slide-up slide-up-delay-1">
        {/* General Settings */}
        <p className="settings-section-title">General</p>
      <div className="settings-card">
        <button className="settings-row" onClick={toggleUnitSystem} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="settings-icon"><Globe size={18} color="var(--text-dim)" /></div>
            <div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text)' }}>Unit System</div>
            </div>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>{unitSystem}</span>
        </button>
        <button className="settings-row" onClick={() => setDarkMode(!darkMode)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="settings-icon"><Moon size={18} color="var(--text-dim)" /></div>
            <div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text)' }}>Theme</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-dim)', fontSize: '0.78rem', fontWeight: 600 }}>
            {darkMode ? 'Dark' : 'Light'} <ChevronRight size={14} />
          </div>
        </button>
        <div className="settings-row">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="settings-icon"><Bell size={18} color="var(--text-dim)" /></div>
            <div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text)' }}>Notifications</div>
            </div>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={notifs} onChange={e => handleNotifsChange(e.target.checked)} />
            <span className="toggle-track" />
          </label>
        </div>
      </div>

        {/* Trading Parameters */}
        <p className="settings-section-title">Trading Parameters</p>
        <div className="settings-card">
          <button className="settings-row" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            onClick={() => setShowParams(true)}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="settings-icon"><Sliders size={18} color="var(--text-dim)" /></div>
              <div>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text)' }}>Asset Parameters</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: 1 }}>Manage k values, ATR settings</div>
              </div>
            </div>
            <ChevronRight size={18} color="var(--text-dim)" />
          </button>
          <button className="settings-row" onClick={() => setShowPatternSettings(true)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderBottom: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="settings-icon"><Activity size={18} color="var(--text-dim)" /></div>
              <div>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text)' }}>Pattern Settings</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: 1 }}>Manage pattern thresholds</div>
              </div>
            </div>
            <ChevronRight size={18} color="var(--text-dim)" />
          </button>
        </div>

        {/* Multi-Mode Experience */}
        <p className="settings-section-title">Multi-Mode Experience</p>
        <div className="settings-card">
          <div className="settings-row" style={{ paddingBottom: 10, borderBottom: 'none' }}>
            <div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text)' }}>Active Profile</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: 1 }}>Adapts UI and AI recommendations</div>
            </div>
          </div>
          <div style={{ padding: '0 24px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['Beginner Investor', 'Swing Trader', 'Intraday Trader', 'Conservative', 'Aggressive'].map(mode => (
              <label key={mode} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 12px', background: 'var(--card-bg-dim, #1E293B)', borderRadius: 8, border: '1px solid var(--border)' }} className="hover:border-blue transition-colors">
                <input type="radio" name="traderMode" checked={traderMode === mode} onChange={() => handleModeChange(mode)} style={{ accentColor: 'var(--neon-blue)' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>{mode}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Data */}
        <p className="settings-section-title">Data</p>
        <div className="settings-card">
          <button className="settings-row" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderBottom: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="settings-icon"><RefreshCw size={18} color="var(--text-dim)" /></div>
              <div>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text)' }}>Refresh Data</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: 1 }}>Update market data manually</div>
              </div>
            </div>
            <ChevronRight size={18} color="var(--text-dim)" />
          </button>
        </div>

        {/* Version */}
        <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-dim)', fontSize: '0.7rem' }}>
          TradeEdge AI v4.0 • Light Theme Overhaul
        </div>
      </div>
    </>
  )
}
