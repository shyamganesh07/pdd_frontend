import React, { useState } from 'react'
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck, Server, X } from 'lucide-react'
import { authService } from '../services/authService'

export default function Login({ onLogin, onGoogleLoginSuccess, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [showConfig, setShowConfig] = useState(false)
  const [configIp, setConfigIp] = useState(localStorage.getItem('backend_ip') || '192.168.137.1')
  const [configPort, setConfigPort] = useState(localStorage.getItem('backend_port') || '8000')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      const data = await res.json()

      if (res.ok) {
        setLoading(false)
        onLogin(formData.email) // Pass email to App to switch to VerifyOTP
      } else {
        setLoading(false)
        setError(data.detail || 'Incorrect email or password access key')
      }
    } catch (err) {
      console.warn("Backend server unreachable. Attempting offline local verification...", err)
      const storedUser = JSON.parse(localStorage.getItem('user_profile'))
      if (storedUser && storedUser.email.toLowerCase() === formData.email.trim().toLowerCase() && storedUser.password === formData.password) {
        setLoading(false)
        onLogin(formData.email) // Switches to VerifyOTP which will also fallback to local mock login
      } else {
        setLoading(false)
        setError('Connection to server failed, and no matching offline profile was found on this device.')
      }
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setGoogleLoading(true)
    try {
      const userProfile = await authService.login()
      setGoogleLoading(false)
      if (onGoogleLoginSuccess) {
        onGoogleLoginSuccess(userProfile)
      }
    } catch (err) {
      console.error('Google Auth flow error:', err)
      let friendlyMessage = err.message || 'Authentication failed. Please try again.'
      const errMsg = err.message || ''
      const errCode = err.code || ''
      
      if (errCode) {
        friendlyMessage = `[${errCode}] ${friendlyMessage}`
      }
      
      if (errCode === 'auth/invalid-api-key') {
        friendlyMessage = `[${errCode}] The Firebase API Key in frontend/.env is a placeholder. Please configure it with your actual Firebase API Key from the Firebase Console.`
      } else if (errCode === 'auth/operation-not-allowed') {
        friendlyMessage = `[${errCode}] Google Sign-In is not enabled in your Firebase Console. Go to Build > Authentication > Sign-in method and enable Google.`
      } else if (errCode === 'auth/popup-closed-by-user') {
        friendlyMessage = 'Sign-in cancelled. Please click the button again to authenticate.'
      }
      
      setGoogleLoading(false)
      setError(friendlyMessage)
    }
  }

  const handleSaveConfig = () => {
    localStorage.setItem('backend_ip', configIp.trim())
    localStorage.setItem('backend_port', configPort.trim())
    alert('Server config saved successfully!')
    setShowConfig(false)
  }

  return (
    <div className="auth-container fade-in" style={{ paddingBottom: '80px' }}>
      <div className="auth-header slide-up">
        <div className="auth-brand-icon neural-pulse" style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))' }}>
          <ShieldCheck size={32} color="white" />
        </div>
        <h1 className="auth-title">Neural Authentication</h1>
        <p className="auth-subtitle">Verify your institutional credentials</p>
      </div>

      <div className="auth-card holographic slide-up slide-up-delay-1">
        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error shake">
              {error}
            </div>
          )}

          <div className="input-group">
            <Mail size={18} className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Gmail ID"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="input-group">
            <Lock size={18} className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-auth-primary"
            disabled={loading || googleLoading}
            style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          >
            {loading ? (
              'Verifying Uplink...'
            ) : (
              <>
                Initialize Session
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>SECURED TERMINAL</span>
        </div>

        <button 
          className="btn-google" 
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading}
          style={{
            width: '100%',
            height: '48px',
            borderRadius: '8px',
            border: '1px solid var(--border, rgba(255,255,255,0.15))',
            background: googleLoading ? 'rgba(255,255,255,0.05)' : 'var(--card-bg-dim, #0F172A)',
            color: 'var(--text, #FFFFFF)',
            fontWeight: 600,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            cursor: (loading || googleLoading) ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease'
          }}
        >
          {googleLoading ? (
            'Connecting Google...'
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </>
          )}
        </button>
      </div>

      <div className="mt-8 text-center slide-up slide-up-delay-3" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <p className="text-[var(--text-dim)] text-sm">
          New operative?
          <button className="btn-auth-link ml-1" onClick={onSwitchToRegister}>Register Profile</button>
        </p>

        <button
          className="btn-auth-link text-xs flex items-center justify-center gap-2"
          style={{ color: 'var(--text-dim)', opacity: 0.8, alignSelf: 'center' }}
          onClick={() => setShowConfig(true)}
        >
          <Server size={14} />
          Server Config
        </button>

        <button
          className="btn-auth-link text-xs"
          style={{ color: 'var(--neon-cyan)', opacity: 0.6 }}
          onClick={() => {
            localStorage.setItem('is_authenticated', 'true');
            window.location.href = '/dashboard';
          }}
        >
          [DEV BYPASS: GO DIRECTLY TO DASHBOARD]
        </button>
      </div>

      {/* Server Config Modal */}
      {showConfig && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            className="card"
            style={{
              background: 'var(--card-solid, #0F172A)',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              padding: '30px',
              width: '100%',
              maxWidth: '380px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
              position: 'relative'
            }}
          >
            <button 
              onClick={() => setShowConfig(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <h3 
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'Space Grotesk'
              }}
            >
              <Server size={20} style={{ color: 'var(--blue)' }} />
              Server Config
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '20px' }}>
              Configure backend server host IP to establish mobile/Vercel debug connection.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)' }}>SERVER IP / DOMAIN</label>
                <input 
                  type="text" 
                  value={configIp} 
                  onChange={(e) => setConfigIp(e.target.value)}
                  placeholder="e.g. 192.168.1.100 or https://my-backend.com"
                  className="search-input"
                  style={{ paddingLeft: '16px', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)' }}>PORT</label>
                <input 
                  type="text" 
                  value={configPort} 
                  onChange={(e) => setConfigPort(e.target.value)}
                  placeholder="8000"
                  className="search-input"
                  style={{ paddingLeft: '16px', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setShowConfig(false)}
                className="type-btn"
                style={{ flex: 1, border: '1px solid var(--border)' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveConfig}
                className="btn-generate"
                style={{ flex: 1, padding: '10px', fontSize: '0.9rem', boxShadow: 'none' }}
              >
                Save Config
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
