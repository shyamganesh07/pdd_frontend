import React, { useState } from 'react'
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck } from 'lucide-react'

export default function Login({ onLogin, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password')
      return
    }

    setLoading(true)

    // Verify against localStorage
    setTimeout(async () => {
      const storedUser = JSON.parse(localStorage.getItem('user_profile'))
      const isMobileApp = (window.Capacitor && window.Capacitor.getPlatform && window.Capacitor.getPlatform() !== 'web') || 
                          window.location.origin.startsWith('capacitor://');

      if (storedUser && storedUser.email === formData.email && storedUser.password === formData.password) {
        if (isMobileApp) {
          setLoading(false)
          onLogin(formData.email)
          return
        }
        try {
          // Trigger OTP send on backend
          const res = await fetch(`http://localhost:8000/send_otp?email=${encodeURIComponent(formData.email)}`, {
            method: 'POST'
          })

          if (res.ok) {
            setLoading(false)
            onLogin(formData.email) // Pass email to App to switch to VerifyOTP
          } else {
            const data = await res.json()
            setLoading(false)
            setError(data.detail || 'Failed to send verification code')
          }
        } catch (err) {
          setLoading(false)
          setError('Communication failure with neural server')
        }
      } else {
        setLoading(false)
        setError('Invalid email or password access key')
      }
    }, 1200)
  }

  return (
    <div className="auth-container fade-in">
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
            />
          </div>

          <button
            type="submit"
            className="btn-auth-primary"
            disabled={loading}
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

        <button className="btn-google" onClick={() => alert('Biometric login coming soon...')}>
          <LogIn size={18} />
          Biometric Auth
        </button>
      </div>

      <div className="mt-8 text-center slide-up slide-up-delay-3" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <p className="text-[var(--text-dim)] text-sm">
          New operative?
          <button className="btn-auth-link ml-1" onClick={onSwitchToRegister}>Register Profile</button>
        </p>

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
    </div>
  )
}
