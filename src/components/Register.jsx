import React, { useState } from 'react'
import { User, Mail, Lock, Zap, ShieldCheck, ArrowRight, Brain } from 'lucide-react'

export default function Register({ onRegister, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    username: '',
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
    
    if (!formData.username || !formData.email || !formData.password) {
      setError('All fields are required')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    
    // Simulate "Temporary Storage" registration
    setTimeout(() => {
      const userData = {
        ...formData,
        registeredAt: new Date().toISOString(),
        id: Math.random().toString(36).substr(2, 9)
      }
      
      // Store in localStorage
      localStorage.setItem('user_profile', JSON.stringify(userData))
      
      setLoading(false)
      onRegister(userData)
    }, 1500)
  }

  return (
    <div className="auth-container fade-in">
      <div className="auth-header slide-up">
        <div className="auth-brand-icon neural-pulse">
          <Brain size={32} color="var(--neon-cyan)" />
        </div>
        <h1 className="auth-title">Initialize Neural OS</h1>
        <p className="auth-subtitle">Create your institutional trading identity</p>
      </div>

      <div className="auth-card holographic slide-up slide-up-delay-1">
        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error shake">
              {error}
            </div>
          )}

          <div className="input-group">
            <User size={18} className="input-icon" />
            <input
              type="text"
              name="username"
              placeholder="Full Name / Handle"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
            />
          </div>

          <div className="input-group">
            <Mail size={18} className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Institutional Email"
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
              placeholder="Security Access Key"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          <button 
            type="submit" 
            className="btn-generate" 
            disabled={loading}
            style={{ marginTop: '8px' }}
          >
            {loading ? (
              <>
                <Zap size={20} className="animate-spin-slow" />
                Initializing...
              </>
            ) : (
              <>
                Deploy Profile
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>SECURED BY TRADEMIND AI</span>
        </div>

        <div className="flex items-center justify-center gap-2 text-[0.7rem] text-[var(--text-dim)] font-grotesk opacity-60">
          <ShieldCheck size={12} />
          End-to-End Encrypted Neural Uplink
        </div>
      </div>

      <div className="mt-8 text-center slide-up slide-up-delay-3">
        <p className="text-[var(--text-dim)] text-sm">
          Already have an account? 
          <button className="btn-auth-link ml-1" onClick={onSwitchToLogin}>Sign In</button>
        </p>
      </div>
    </div>
  )
}
