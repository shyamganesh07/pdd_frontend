import React from 'react'
import { ShieldCheck, Loader2, AlertCircle } from 'lucide-react'

export default function FirebaseLoginScreen({ onLoginSuccess, onLoginStart, onLoginError, loading, error, setError }) {
  const handleGoogleLogin = async () => {
    setError('')
    if (onLoginStart) onLoginStart()
    
    try {
      // Import dynamically to avoid loading issues in early boot
      const { authService } = await import('../services/authService')
      const userProfile = await authService.login()
      if (onLoginSuccess) {
        onLoginSuccess(userProfile)
      }
    } catch (err) {
      console.error('Google Auth flow error:', err)
      
      // Detailed error alert for user diagnostics
      const errObj = {};
      Object.getOwnPropertyNames(err).forEach(key => {
        errObj[key] = err[key];
      });
      const rawErrorDetails = JSON.stringify(errObj, null, 2);
      alert(`[DIAGNOSTIC ALERT] Firebase Sign-In Failed:\n\n${rawErrorDetails}\n\nPlease check this message to identify missing configuration.`);
      
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
      } else if (errMsg.includes('popup-closed-by-user') || errMsg.includes('cancelled') || errMsg.includes('closed')) {
        friendlyMessage = 'Sign-in cancelled. Please click the button again to authenticate.'
      } else if (errMsg.includes('network-request-failed')) {
        friendlyMessage = 'Network connection issue. Please check your uplink and try again.'
      } else if (errMsg.includes('configuration') || errMsg.includes('Client ID')) {
        friendlyMessage = 'Google OAuth Client ID is misconfigured. Please check environment configuration.'
      }
      
      if (onLoginError) {
        onLoginError(friendlyMessage)
      } else {
        setError(friendlyMessage)
      }
    }
  }

  return (
    <div className="auth-container fade-in" style={{ maxWidth: '420px', margin: '60px auto 40px', padding: '0 20px' }}>
      <div className="auth-header" style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div 
          className="auth-brand-icon neural-pulse" 
          style={{ 
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--neon-blue, #00E5FF), var(--neon-purple, #9333EA))',
            boxShadow: '0 0 20px rgba(0, 229, 255, 0.4)'
          }}
        >
          <ShieldCheck size={32} color="#FFFFFF" />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'Space Grotesk', margin: '0 0 8px', color: 'var(--text, #FFFFFF)' }}>
          Secure Uplink
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-dim, #94A3B8)', margin: 0 }}>
          Connect your Google Account to access the TradeMind AI dashboard
        </p>
      </div>

      <div 
        className="auth-card holographic"
        style={{
          background: 'var(--card, rgba(30, 41, 59, 0.7))',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--border, rgba(255,255,255,0.08))',
          borderRadius: '16px',
          padding: '32px 24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
        }}
      >
        {error && (
          <div 
            className="auth-error shake"
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '12px 14px',
              color: '#F87171',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              marginBottom: '20px'
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}

        <button 
          onClick={handleGoogleLogin} 
          disabled={loading}
          className="btn-google"
          style={{
            width: '100%',
            height: '48px',
            borderRadius: '8px',
            border: '1px solid var(--border, rgba(255,255,255,0.15))',
            background: loading ? 'rgba(255,255,255,0.05)' : 'var(--card-bg-dim, #0F172A)',
            color: 'var(--text, #FFFFFF)',
            fontWeight: 600,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease'
          }}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" style={{ color: 'var(--neon-blue, #00E5FF)' }} />
              Connecting Uplink...
            </>
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

        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '10px',
            margin: '24px 0 0', 
            fontSize: '0.7rem', 
            color: 'var(--text-dim, #64748B)',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          <span style={{ width: '20px', height: '1px', background: 'var(--border, rgba(255,255,255,0.08))' }}></span>
          <span>Secured Terminal</span>
          <span style={{ width: '20px', height: '1px', background: 'var(--border, rgba(255,255,255,0.08))' }}></span>
        </div>
      </div>
      
      <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-dim, #64748B)', marginTop: '20px', lineHeight: 1.4 }}>
        This terminal enforces high-grade Firebase authentication. By continuing, you agree to secure synchronization of your configuration settings.
      </p>
    </div>
  )
}
