import React, { useState } from 'react'
import { User as UserIcon, Mail, KeyRound, UserPlus } from 'lucide-react'

export default function AuthPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form Data
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match!")
      setLoading(false)
      return
    }

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const payload = isLogin 
        ? { email, password } 
        : { name, email, password }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(errText || 'Authentication failed')
      }

      if (isLogin) {
        const data = await res.json()
        localStorage.setItem('jwt_token', data.token)
        localStorage.setItem('user_profile', JSON.stringify({ name: data.name, email: data.email }))
        onLoginSuccess(data)
      } else {
        // Auto-switch to login after register
        setIsLogin(true)
        setError('Registration successful! Please login.')
      }

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container" style={{ paddingBottom: '80px' }}>
      <div className="auth-header">
        <div className="auth-brand-icon">
          <UserIcon size={32} color="#fff" />
        </div>
        <h2 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="auth-subtitle">
          {isLogin ? 'Sign in to access your trading dashboard' : 'Join the TradeEdge AI network'}
        </p>
      </div>

      <div className="auth-card">
        {error && (
          <div className="auth-error" style={{ backgroundColor: error.includes('successful') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239,68,68,0.1)', color: error.includes('successful') ? '#22C55E' : '#EF4444', borderColor: error.includes('successful') ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239,68,68,0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="input-group">
              <UserPlus size={18} className="input-icon" />
              <input 
                type="text" 
                placeholder="Full Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="input-group">
            <Mail size={18} className="input-icon" />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <KeyRound size={18} className="input-icon" />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div className="input-group">
              <KeyRound size={18} className="input-icon" />
              <input 
                type="password" 
                placeholder="Confirm Password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button type="submit" className="btn-auth-primary" disabled={loading}>
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Register'}
          </button>
        </form>

        <div className="auth-divider"><span>OR</span></div>

        <button 
          className="btn-google" 
          style={{ background: 'var(--card2)', color: 'var(--text)' }}
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }}
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  )
}
