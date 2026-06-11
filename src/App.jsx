import React, { useState, useEffect, useRef } from 'react'
import { LayoutDashboard, Clock, BarChart2, User as UserIcon, Activity, Zap, Brain, BookOpen, Settings as SettingsIcon, FlaskConical, RotateCcw, ShieldAlert, Users, Trophy, GraduationCap, MoreHorizontal } from 'lucide-react'
import Dashboard from './components/Dashboard'
import History from './components/History'
import Profile from './components/Profile'
import TradeSetup from './components/TradeSetup'
import ChatBot from './components/ChatBot'
import Psychology from './components/Psychology'
import DNA from './components/DNA'
import Intelligence from './components/Intelligence'
import StrategyLab from './components/StrategyLab'
import StressTest from './components/StressTest'
import CrowdPsychology from './components/CrowdPsychology'
import Evolution from './components/Evolution'
import Academy from './components/Academy'
import KnowledgeGraph from './components/KnowledgeGraph'
import SimulationLab from './components/SimulationLab'
import SimulationHistory from './components/SimulationHistory'
import Register from './components/Register'
import Login from './components/Login'
import VerifyOTP from './components/VerifyOTP'

import FirebaseLoginScreen from './components/FirebaseLoginScreen'
import { auth } from './firebase'
import { authService } from './services/authService'
import { onAuthStateChanged } from 'firebase/auth'


// ── Particle Background Component ──
function ParticleBG() {
  return (
    <div className="particle-bg">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="particle" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 20}s`, width: `${Math.random() * 3}px`, height: `${Math.random() * 3}px` }} />
      ))}
    </div>
  )
}

// ── Voice Assistant Component ──
function VoiceAssistant({ onCommand }) {
  const [isListening, setIsListening] = useState(false)
  const [pos, setPos] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 156 })
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })

  const startListening = () => {
    if (dragging) return // Don't trigger if we were just dragging
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return alert("Voice not supported in this browser.")

    const recognition = new SpeechRecognition()
    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase()
      onCommand(command)
    }
    recognition.start()
  }

  const handleMouseDown = (e) => {
    setDragging(true)
    dragStart.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
  }

  const handleTouchStart = (e) => {
    setDragging(true)
    const touch = e.touches[0]
    dragStart.current = { x: touch.clientX - pos.x, y: touch.clientY - pos.y }
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging) return
      setPos({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y })
    }
    const handleTouchMove = (e) => {
      if (!dragging) return
      const touch = e.touches[0]
      setPos({ x: touch.clientX - dragStart.current.x, y: touch.clientY - dragStart.current.y })
    }
    const handleMouseUp = () => setDragging(false)

    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('touchend', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [dragging])

  return (
    <button
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={() => !dragging && startListening()}
      className={`voice-btn ${isListening ? 'listening' : ''}`}
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        width: 56, height: 56, borderRadius: '50%',
        background: isListening ? 'var(--neon-purple)' : 'var(--card)',
        border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        zIndex: 1001,
        touchAction: 'none'
      }}
    >
      <Activity size={24} color={isListening ? 'white' : 'var(--neon-blue)'} className={isListening ? 'animate-pulse' : ''} />
    </button>
  )
}

function MainHeader({ tab, setTab, username }) {
  return (
    <div className="flex items-center justify-between mb-8 fade-in slide-up hidden md:flex">
      <div>
        <div style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'Space Grotesk' }}>
          {TABS.find(t => t.id === tab)?.label || 'Trading Dashboard'}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: 4 }}>Welcome back, {username || 'Alex'} • Last login: Just now</div>
      </div>

      <div className="flex gap-4">
        <button className="header-btn-premium active">
          <Activity size={16} />
          Live Trading
        </button>
        <button className="header-btn-premium" onClick={() => setTab('intelligence')}>
          <Zap size={16} />
          AI Insights
        </button>
      </div>
    </div>
  )
}

// ── Haptic Feedback Utility ──
function triggerHaptic(type = 'light') {
  if (!navigator.vibrate) return
  if (type === 'light') navigator.vibrate(10)
  else if (type === 'medium') navigator.vibrate(20)
  else if (type === 'heavy') navigator.vibrate([30, 50, 30])
}

const TABS = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'intelligence', label: 'Intelligence', Icon: Activity },
  { id: 'graph', label: 'Neural Map', Icon: Brain },
  { id: 'simulation', label: 'Sim Lab', Icon: ShieldAlert },
  { id: 'mistake', label: 'Sim History', Icon: RotateCcw },
  { id: 'dna', label: 'Trader DNA', Icon: Brain },
  { id: 'strategy', label: 'Strategy Lab', Icon: FlaskConical },
  { id: 'psychology', label: 'Mindset', Icon: Brain },
  { id: 'stress', label: 'Stress', Icon: ShieldAlert },
  { id: 'crowd', label: 'Crowd', Icon: Users },
  { id: 'evolution', label: 'Evolve', Icon: Trophy },
  { id: 'academy', label: 'Academy', Icon: BookOpen },
  { id: 'history', label: 'History', Icon: Clock },
  { id: 'profile', label: 'Profile', Icon: UserIcon },
]

const PRIMARY_MOBILE_IDS = ['dashboard', 'intelligence', 'academy', 'profile']
const PRIMARY_MOBILE_TABS = TABS.filter(t => PRIMARY_MOBILE_IDS.includes(t.id))
const SECONDARY_MOBILE_TABS = TABS.filter(t => !PRIMARY_MOBILE_IDS.includes(t.id))

export default function App() {
  const [tab, setTab] = useState(() => {
    const path = window.location.pathname.replace('/', '')
    return TABS.some(t => t.id === path) ? path : 'dashboard'
  })
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user_profile') || 'null') } catch { return null }
  })
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('is_authenticated') === 'true'
  })
  const [authView, setAuthView] = useState(() => {
    const path = window.location.pathname
    if (path === '/login') return 'login'
    if (path === '/register') return 'register'
    return user ? 'login' : 'register'
  })
  const [userEmail, setUserEmail] = useState('')
  const [tradeResult, setTradeResult] = useState(() => {
    try { return JSON.parse(localStorage.getItem('last_trade') || 'null') } catch { return null }
  })
  const [showTrade, setShowTrade] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallBtn, setShowInstallBtn] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  
  // Firebase Auth states
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    // ── Listen to Firebase Auth state changes ──
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const idToken = await fbUser.getIdToken(true)
          const syncedUser = await authService.syncWithBackend(idToken)
          setUser(syncedUser)
          setIsAuthenticated(true)
        } catch (e) {
          console.error("Firebase auto-login sync error:", e)
          const cached = localStorage.getItem('user_profile')
          if (cached) {
            setUser(JSON.parse(cached))
            setIsAuthenticated(true)
          } else {
            setIsAuthenticated(false)
            setUser(null)
          }
        }
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
      setIsCheckingSession(false)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const path = window.location.pathname
    if (path === '/' || path === '') {
      window.history.replaceState(null, '', '/dashboard')
    } else if (path === '/login') {
      setIsAuthenticated(false)
      setAuthView('login')
    } else if (path === '/register') {
      setIsAuthenticated(false)
      setAuthView('register')
    }

    const handlePopState = () => {
      const currentPath = window.location.pathname
      if (currentPath === '/login') {
        setIsAuthenticated(false)
        setAuthView('login')
      } else if (currentPath === '/register') {
        setIsAuthenticated(false)
        setAuthView('register')
      } else {
        const cleanPath = currentPath.replace('/', '')
        if (TABS.some(t => t.id === cleanPath)) {
          setTab(cleanPath)
        }
      }
    }
    window.addEventListener('popstate', handlePopState)

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallBtn(true)
    })

    window.addEventListener('appinstalled', () => {
      setShowInstallBtn(false)
    })

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    // Only perform standard profile sync when authenticated but users.json details aren't fully loaded
    if (isAuthenticated && user?.email && !user?.createdAt) {
      fetch(`/api/profile?email=${encodeURIComponent(user.email)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.email) {
            setUser(data)
            localStorage.setItem('user_profile', JSON.stringify(data))
          }
        })
        .catch(err => console.error('Failed to sync profile fields:', err))
    }
  }, [isAuthenticated, user?.email, user?.createdAt])

  const handleTabChange = (newTab) => {
    setTab(newTab)
    setShowTrade(false)
    window.history.pushState(null, '', `/${newTab}`)
  }

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShowInstallBtn(false)
    }
  }

  const handleResult = (data) => {
    setTradeResult(data)
    if (window.safeSetLocalStorage) {
      window.safeSetLocalStorage('last_trade', JSON.stringify(data))
    } else {
      try { localStorage.setItem('last_trade', JSON.stringify(data)) } catch (e) {}
    }
    setShowTrade(true)
  }

  const handleLogout = async () => {
    try {
      setAuthLoading(true)
      await authService.logout()
      setIsAuthenticated(false)
      setUser(null)
      setAuthView('login')
      setTab('dashboard')
      window.history.pushState(null, '', '/dashboard')
    } catch (e) {
      console.error("Logout failed:", e)
    } finally {
      setAuthLoading(false)
    }
  }

  const renderScreen = () => {
    if (showTrade) return <TradeSetup result={tradeResult} onBack={() => setShowTrade(false)} />
    switch (tab) {
      case 'dashboard': return <Dashboard isOnline={isOnline} onResult={handleResult} />
      case 'intelligence': return <Intelligence onBack={() => setTab('dashboard')} />
      case 'graph': return <KnowledgeGraph onBack={() => setTab('dashboard')} />
      case 'simulation': return <SimulationLab user={user} onBack={() => setTab('dashboard')} />
      case 'mistake': return <SimulationHistory user={user} onBack={() => setTab('dashboard')} onGoToSimulation={() => setTab('simulation')} />
      case 'dna': return <DNA onBack={() => setTab('dashboard')} />
      case 'strategy': return <StrategyLab onBack={() => setTab('dashboard')} />
      case 'psychology': return <Psychology onBack={() => setTab('dashboard')} onViewReport={() => setTab('dna')} />
      case 'stress': return <StressTest onBack={() => setTab('dashboard')} />
      case 'crowd': return <CrowdPsychology onBack={() => setTab('dashboard')} />
      case 'evolution': return <Evolution onBack={() => setTab('dashboard')} />
      case 'academy': return <Academy onBack={() => setTab('dashboard')} />
      case 'history': return <History onBack={() => setTab('dashboard')} onSelect={handleResult} />
      case 'profile': {
        if (isAuthenticated && user) {
          return <Profile onLogout={handleLogout} onProfileUpdate={(updated) => setUser(updated)} />
        } else {
          if (authView === 'register') {
            return (
              <Register
                onRegister={(userData) => {
                  setUser(userData)
                  setAuthView('login')
                }}
                onSwitchToLogin={() => {
                  setAuthView('login')
                }}
              />
            )
          } else if (authView === 'login') {
            return (
              <Login
                onLogin={(email) => {
                  setUserEmail(email)
                  setAuthView('verify')
                }}
                onGoogleLoginSuccess={(syncedUser) => {
                  setUser(syncedUser)
                  setIsAuthenticated(true)
                  if (window.safeSetLocalStorage) {
                    window.safeSetLocalStorage('is_authenticated', 'true')
                  } else {
                    localStorage.setItem('is_authenticated', 'true')
                  }
                }}
                onSwitchToRegister={() => {
                  setUser(null)
                  setAuthView('register')
                }}
              />
            )
          } else {
            return (
              <VerifyOTP
                email={userEmail || user?.email}
                onVerify={(profile) => {
                  setIsAuthenticated(true)
                  if (window.safeSetLocalStorage) {
                    window.safeSetLocalStorage('is_authenticated', 'true')
                  } else {
                    localStorage.setItem('is_authenticated', 'true')
                  }
                  if (profile) {
                    if (window.safeSetLocalStorage) {
                      window.safeSetLocalStorage('user_profile', JSON.stringify(profile))
                      window.safeSetLocalStorage('userEmail', profile.email)
                      if (profile.balance !== undefined) {
                        window.safeSetLocalStorage('demo_balance', profile.balance.toString())
                      }
                    } else {
                      localStorage.setItem('user_profile', JSON.stringify(profile))
                      localStorage.setItem('userEmail', profile.email)
                      if (profile.balance !== undefined) {
                        localStorage.setItem('demo_balance', profile.balance.toString())
                      }
                    }
                    setUser(profile)
                  }
                  setTab('profile')
                }}
                onBack={() => {
                  setAuthView('login')
                }}
              />
            )
          }
        }
      }
      default: return null
    }
  }

  // 1. Show elegant splash/loading while checking session
  if (isCheckingSession) {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--card-bg-dim, #0F172A)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div className="sidebar-brand-icon neural-pulse" style={{ width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--neon-blue, #00E5FF), var(--neon-purple, #9333EA))' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
          </div>
          <div style={{ color: 'var(--text-dim, #94A3B8)', fontSize: '0.85rem', fontFamily: 'Space Grotesk', fontWeight: 600 }}>Calibrating Secure Uplink...</div>
        </div>
      </div>
    )
  }

  // 2. Render standard email OTP auth screens only if explicitly hitting those paths
  const isTraditionalAuthPath = window.location.pathname === '/login' || 
                                window.location.pathname === '/register' ||
                                window.location.pathname === '/verify'

  if (isTraditionalAuthPath && !isAuthenticated) {
    return (
      <div className="app-container">
        <main className="main-content" style={{ padding: 0 }}>
          <ParticleBG />
          {(authView === 'register' && !user) ? (
            <Register
              onRegister={(userData) => {
                setUser(userData)
                setAuthView('login')
                window.history.pushState(null, '', '/login')
              }}
              onSwitchToLogin={() => {
                setAuthView('login')
                window.history.pushState(null, '', '/login')
              }}
            />
          ) : authView === 'login' ? (
            <Login
              onLogin={(email) => {
                setUserEmail(email)
                setAuthView('verify')
                window.history.pushState(null, '', '/verify')
              }}
              onGoogleLoginSuccess={(syncedUser) => {
                setUser(syncedUser)
                setIsAuthenticated(true)
                localStorage.setItem('is_authenticated', 'true')
                setTab('dashboard')
                window.history.pushState(null, '', '/dashboard')
              }}
              onSwitchToRegister={() => {
                localStorage.removeItem('user_profile')
                setUser(null)
                setAuthView('register')
                window.history.pushState(null, '', '/register')
              }}
            />
          ) : (
            <VerifyOTP
              email={userEmail || user?.email}
              onVerify={(profile) => {
                setIsAuthenticated(true)
                localStorage.setItem('is_authenticated', 'true')
                if (profile) {
                  localStorage.setItem('user_profile', JSON.stringify(profile))
                  localStorage.setItem('userEmail', profile.email)
                  if (profile.balance !== undefined) {
                    localStorage.setItem('demo_balance', profile.balance.toString())
                  }
                }
                setTab('dashboard')
                window.history.pushState(null, '', '/dashboard')
              }}
              onBack={() => {
                setAuthView('login')
                window.history.pushState(null, '', '/login')
              }}
            />
          )}
        </main>
      </div>
    )
  }

  return (
    <div className="app-container">
      {/* SIDEBAR FOR DESKTOP */}
      <aside className="sidebar fade-in slide-up">
        <div className="sidebar-header">
          <div className="sidebar-brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
          </div>
          <div>
            <div className="brand-name">TradeMind AI</div>
            <div className="brand-sub">Institutional OS</div>
          </div>
        </div>
        <nav className="sidebar-nav" style={{ overflowY: 'auto' }}>
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} className={`sidebar-link ${tab === id ? 'active' : ''}`} onClick={() => handleTabChange(id)}>
              <Icon size={20} strokeWidth={tab === id ? 2.5 : 2} />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        <ParticleBG />
        {!isOnline && <div className="offline-banner">⚡ Offline Mode — Showing cached data only</div>}

        <MainHeader tab={tab} setTab={setTab} username={user?.name || user?.username} />

        {/* MOBILE APP HEADER (Hidden on desktop) */}
        {!showTrade && (
          <header className="app-header fade-in slide-up">
            <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="brand-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
              </div>
              <div>
                <div className="brand-name">TradeMind AI</div>
                <div className="brand-sub">Institutional OS</div>
              </div>
            </div>
          </header>
        )}

        <div className="screen">{renderScreen()}</div>

        {/* BOTTOM NAV FOR MOBILE (Hidden on desktop) */}
        {!showTrade && (
          <nav className="bottom-nav" style={{ paddingBottom: 'calc(24px + env(safe-area-inset-bottom))' }}>
            {PRIMARY_MOBILE_TABS.map(({ id, label, Icon }) => (
              <button key={id} className={`nav-btn ${tab === id && !showMoreMenu ? 'active' : ''}`} onClick={() => {
                triggerHaptic('light');
                handleTabChange(id);
                setShowMoreMenu(false);
              }}>
                <Icon size={20} strokeWidth={tab === id && !showMoreMenu ? 2.5 : 1.8} />
                {label}
              </button>
            ))}
            <button className={`nav-btn ${showMoreMenu ? 'active' : ''}`} onClick={() => {
              triggerHaptic('light');
              setShowMoreMenu(!showMoreMenu);
            }}>
              <MoreHorizontal size={20} strokeWidth={showMoreMenu ? 2.5 : 1.8} />
              More
            </button>
            {showInstallBtn && (
              <button className="nav-btn" onClick={handleInstall} style={{ color: 'var(--neon-cyan)' }}>
                <Activity size={20} className="animate-pulse" />
                Install
              </button>
            )}
          </nav>
        )}

        {/* MORE OPTIONS SHEET FOR MOBILE */}
        {showMoreMenu && !showTrade && (
          <div className="more-menu-backdrop" onClick={() => setShowMoreMenu(false)}>
            <div className="more-menu-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="more-menu-header">
                <div className="more-menu-title">More Capabilities</div>
                <button className="more-menu-close" onClick={() => setShowMoreMenu(false)}>✕</button>
              </div>
              <div className="more-menu-grid">
                {SECONDARY_MOBILE_TABS.map(({ id, label, Icon }) => (
                  <button key={id} className={`more-menu-item ${tab === id ? 'active' : ''}`} onClick={() => {
                    triggerHaptic('medium');
                    handleTabChange(id);
                    setShowMoreMenu(false);
                  }}>
                    <div className="more-menu-icon-wrapper">
                      <Icon size={22} strokeWidth={tab === id ? 2.5 : 1.8} />
                    </div>
                    <span className="more-menu-label">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {!((window.Capacitor && window.Capacitor.getPlatform && window.Capacitor.getPlatform() !== 'web') || 
         window.location.origin.startsWith('capacitor://')) && (
        <VoiceAssistant onCommand={(cmd) => {
          if (cmd.includes('dashboard')) handleTabChange('dashboard')
          else if (cmd.includes('dna')) handleTabChange('dna')
          else if (cmd.includes('intelligence')) handleTabChange('intelligence')
          else alert(`AI processing: "${cmd}"`)
        }} />
      )}
      <ChatBot />
    </div>
  )
}
