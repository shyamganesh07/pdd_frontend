import React, { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Bot, User, Loader2, Mic, Zap, ShieldAlert } from 'lucide-react'

// Simple markdown formatter for bold and line breaks
const formatMessage = (text) => {
  if (!text) return ''
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br />')
  return html
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Institutional OS Copilot online. I am monitoring volatility and institutional pressure. How can I assist your execution today?' }
  ])
  const [isVoice, setIsVoice] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [pos, setPos] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 80 })
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const messagesEndRef = useRef(null)

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e) => {
    e?.preventDefault()
    if (!input.trim() || loading) return

    const userMsg = input.trim()
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.detail || 'Failed to get response')
      
      setMessages(prev => [...prev, { sender: 'bot', text: data.response }])
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: `⚠️ Error: ${err.message}` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="chat-fab" 
        onClick={() => !dragging && setIsOpen(true)}
        style={{
          position: 'fixed', 
          left: pos.x,
          top: pos.y,
          zIndex: 999,
          width: 56, height: 56, borderRadius: 28,
          background: 'linear-gradient(135deg, #3D65F4, #60A5FA)',
          border: 'none', color: 'white',
          boxShadow: '0 8px 24px rgba(61,101,244,0.4)',
          display: isOpen ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: dragging ? 'none' : 'transform 0.2s',
          touchAction: 'none'
        }}
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: 85, right: 20, zIndex: 1000,
          width: 340, height: 500, maxHeight: 'calc(100vh - 100px)',
          background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20,
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}>
          
          {/* Header */}
          <div style={{
            padding: '16px 20px', background: 'rgba(255,255,255,0.05)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 16, background: 'linear-gradient(135deg, #3D65F4, #A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={18} color="white" />
              </div>
              <div>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.95rem', color: 'white' }}>TradeMind AI</div>
                <div style={{ fontSize: '0.65rem', color: '#22C55E', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: 3, background: '#22C55E' }}></span>
                  Online
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={() => setIsVoice(!isVoice)} style={{ background: isVoice ? 'rgba(34,197,94,0.1)' : 'none', border: 'none', color: isVoice ? '#22C55E' : '#94A3B8', cursor: 'pointer', display:'flex', padding:4, borderRadius:8 }}>
                <Mic size={18} className={isVoice ? 'animate-pulse' : ''} />
              </button>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Contextual Intelligence Banner */}
          <div style={{ background:'rgba(168,85,247,0.1)', padding:'8px 16px', borderBottom:'1px solid rgba(168,85,247,0.2)', display:'flex', alignItems:'center', gap:8 }}>
            <Zap size={14} className="text-neon-purple" />
            <span style={{ fontSize:'0.65rem', color:'var(--text)', fontWeight:700, fontFamily:'Space Grotesk' }}>LIVE EXECUTION GUIDANCE ACTIVE</span>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%', display: 'flex', gap: 8,
                flexDirection: m.sender === 'user' ? 'row-reverse' : 'row'
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 13, flexShrink: 0,
                  background: m.sender === 'user' ? '#1E293B' : 'linear-gradient(135deg, #3D65F4, #A855F7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {m.sender === 'user' ? <User size={14} color="#94A3B8" /> : <Bot size={14} color="white" />}
                </div>
                <div 
                  style={{
                    background: m.sender === 'user' ? '#3D65F4' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${m.sender === 'user' ? '#3D65F4' : 'rgba(255,255,255,0.1)'}`,
                    padding: '10px 14px', borderRadius: '16px',
                    borderTopRightRadius: m.sender === 'user' ? 4 : 16,
                    borderTopLeftRadius: m.sender === 'bot' ? 4 : 16,
                    color: 'white', fontSize: '0.85rem', lineHeight: 1.5,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  dangerouslySetInnerHTML={{ __html: formatMessage(m.text) }}
                />
              </div>
            ))}
            
            {loading && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 8 }}>
                 <div style={{ width: 26, height: 26, borderRadius: 13, flexShrink: 0, background: 'linear-gradient(135deg, #3D65F4, #A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={14} color="white" />
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 14px', borderRadius: '16px', borderTopLeftRadius: 4, display: 'flex', alignItems: 'center' }}>
                  <Loader2 size={16} color="#94A3B8" className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} style={{
            padding: '12px 16px', background: 'rgba(255,255,255,0.03)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', gap: 10, alignItems: 'center'
          }}>
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything..." 
              style={{
                flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 20, padding: '10px 16px', color: 'white', fontSize: '0.85rem',
                outline: 'none', fontFamily: 'Inter, sans-serif'
              }}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || loading}
              style={{
                background: input.trim() && !loading ? '#3D65F4' : 'rgba(255,255,255,0.1)',
                border: 'none', width: 38, height: 38, borderRadius: 19,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', cursor: input.trim() && !loading ? 'pointer' : 'default',
                transition: 'background 0.2s'
              }}
            >
              <Send size={16} style={{ marginLeft: 2 }} />
            </button>
          </form>
          
        </div>
      )}
      <style>{`
        .chat-fab:hover { transform: scale(1.05); }
        .chat-fab:active { transform: scale(0.95); }
      `}</style>
    </>
  )
}
