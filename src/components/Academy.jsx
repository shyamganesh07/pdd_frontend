import React, { useState, useEffect } from 'react'
import { BookOpen, Trophy, Play, CheckCircle2, XCircle, Brain, Target, ChevronLeft, Activity, Star, Info, Video, ChevronRight, Download, Book } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ReferenceLine } from 'recharts'

function HologramNarrator({ title, script }) {
   return (
      <div className="h-full w-full bg-black/40 flex flex-col items-center justify-center relative overflow-hidden">
         {/* Holographic Orb */}
         <div className="relative w-32 h-32 mb-6">
            <div className="absolute inset-0 bg-neon-blue/20 rounded-full blur-2xl animate-pulse" />
            <div className="absolute inset-0 border-2 border-neon-blue/30 rounded-full animate-spin-slow" />
            <div className="absolute inset-4 border border-neon-purple/50 rounded-full animate-reverse-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
               <Activity size={48} className="text-neon-blue animate-pulse" />
            </div>
         </div>
         
         {/* Narrator Identity */}
         <div className="text-center px-8 z-10">
            <div className="text-[10px] text-neon-blue font-bold uppercase tracking-[0.3em] mb-2">Neural Narrator Active</div>
            <h4 className="text-sm font-bold text-white mb-2 font-grotesk uppercase tracking-wider">{title}</h4>
            <div className="w-48 h-1 bg-white/5 rounded-full mx-auto mb-6 overflow-hidden">
               <div className="h-full bg-gradient-to-r from-neon-blue to-neon-purple animate-shimmer" style={{ width: '100%' }} />
            </div>
         </div>

         {/* Cyberpunk Grid Background */}
         <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
         
         <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <div className="flex gap-1">
               {[1,2,3,4].map(i => <div key={i} className="w-1 h-4 bg-neon-blue/50 rounded-full animate-bounce" style={{ animationDelay: `${i*0.2}s` }} />)}
            </div>
            <span className="text-[8px] font-bold text-neon-blue opacity-70">AUDIO SYNCED</span>
         </div>
      </div>
   )
}

function GenerativeAIVideo({ title, isPlayingAudio, caption, videoUrl }) {
   return (
      <div className="absolute inset-0 bg-black flex flex-col items-center justify-center overflow-hidden font-sans select-none">
         {/* Background Video Loop */}
         <video 
            key={videoUrl}
            src={videoUrl}
            className="absolute inset-0 w-full h-full object-cover opacity-80 z-0"
            autoPlay
            loop
            muted
            playsInline
         />
         {/* Embedded CSS Animations */}
         <style dangerouslySetInnerHTML={{__html: `
            @keyframes gridScroll {
               0% { background-position: 0 0; }
               100% { background-position: 0 24px; }
            }
            @keyframes scan {
               0% { top: 0%; }
               50% { top: 100%; }
               100% { top: 0%; }
            }
            @keyframes orbit-cw {
               0% { transform: rotate(0deg); }
               100% { transform: rotate(360deg); }
            }
            @keyframes orbit-ccw {
               0% { transform: rotate(360deg); }
               100% { transform: rotate(0deg); }
            }
            .glow-text {
               text-shadow: 0 0 10px rgba(34,211,238,0.5), 0 0 20px rgba(168,85,247,0.3);
            }
         `}} />

         {/* Moving Cyberpunk Grid Background */}
         <div 
            className="absolute inset-0 opacity-20 pointer-events-none" 
            style={{ 
               backgroundImage: 'linear-gradient(rgba(34,211,238,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.15) 1px, transparent 1px)', 
               backgroundSize: '24px 24px',
               transform: 'perspective(400px) rotateX(60deg) translateY(-20px)',
               transformOrigin: 'top center',
               animation: isPlayingAudio ? 'gridScroll 3s linear infinite' : 'none'
            }} 
         />

         {/* Holographic Orbit HUD Rings */}
         <div className="absolute w-[260px] h-[260px] rounded-full border border-cyan-500/10 flex items-center justify-center">
            <div 
               className="absolute w-[220px] h-[220px] rounded-full border border-dashed border-cyan-500/20"
               style={{ animation: isPlayingAudio ? 'orbit-cw 20s linear infinite' : 'none' }}
            />
            <div 
               className="absolute w-[180px] h-[180px] rounded-full border border-dotted border-purple-500/30"
               style={{ animation: isPlayingAudio ? 'orbit-ccw 15s linear infinite' : 'none' }}
            />
         </div>

         {/* Audio Frequency visualizer bars */}
         <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between h-8 opacity-25 pointer-events-none">
            {[...Array(28)].map((_, i) => (
               <div 
                  key={i} 
                  className="w-1 bg-cyan-400 rounded-t-sm transition-all duration-150"
                  style={{
                     height: isPlayingAudio ? `${Math.floor(Math.random() * 20) + 4}px` : '3px',
                     opacity: isPlayingAudio ? 0.8 : 0.3
                  }}
               />
            ))}
         </div>

         {/* Interactive dynamic chart vector layer inside video */}
         <div className="absolute inset-x-12 top-8 h-24 opacity-30">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
               <path 
                  d={isPlayingAudio ? "M 0 60 Q 20 20, 45 75 T 75 40 T 100 50" : "M 0 50 L 100 50"} 
                  fill="none" 
                  stroke="#22d3ee" 
                  strokeWidth="1.5"
               />
            </svg>
         </div>

         {/* Animated Hologram scanning laser beam line */}
         {isPlayingAudio && (
            <div 
               className="absolute left-0 w-full h-[2px] bg-cyan-400/40 shadow-[0_0_8px_rgba(34,211,238,0.6)]" 
               style={{ animation: 'scan 4s ease-in-out infinite' }}
            />
         )}

         {/* Central visual text container */}
         <div className="z-10 text-center px-6 max-w-sm pointer-events-none">
            <span className="text-[8px] text-cyan-400 font-bold uppercase tracking-[0.3em] mb-1 block">AI Neural Stream</span>
            
            <h4 className="text-[11px] font-bold text-white uppercase tracking-wider mb-4 opacity-50 max-w-[200px] mx-auto truncate">
               {title}
            </h4>

            {/* Kinetic Caption Layer */}
            <div className="min-h-[60px] flex items-center justify-center">
               <p className={`text-xs md:text-sm font-semibold text-cyan-100 leading-relaxed glow-text transition-all duration-300 ${isPlayingAudio ? 'scale-100 opacity-100' : 'scale-95 opacity-50'}`}>
                  {isPlayingAudio ? (caption || "Connecting to core matrix...") : "Activate 'AI Briefing' to stream generative masterclass lecture."}
               </p>
            </div>
         </div>
      </div>
   )
}

export default function Academy({ onBack }) {
    const [view, setView] = useState('hub') // 'hub', 'quiz', 'patterns', 'lessons', 'exams', 'personalized'
    const [data, setData] = useState(null)
    const [quiz, setQuiz] = useState(null)
    const [patterns, setPatterns] = useState(null)
    const [lessons, setLessons] = useState(null)
    const [weaknesses, setWeaknesses] = useState(null)
    const [exam, setExam] = useState(null)
    const [mistake, setMistake] = useState(null)
    const [scenarios, setScenarios] = useState([])
    const [graphData, setGraphData] = useState(null)
    const [institutionalMode, setInstitutionalMode] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [quizIndex, setQuizIndex] = useState(0)
    const [patternIndex, setPatternIndex] = useState(0)
    const [lessonIndex, setLessonIndex] = useState(0)
    const [examIndex, setExamIndex] = useState(0)
    const [selectedTrack, setSelectedTrack] = useState(null)
    const [downloading, setDownloading] = useState(false)
    const [isPlayingAudio, setIsPlayingAudio] = useState(false)
    const [caption, setCaption] = useState('')
    const [score, setScore] = useState(0)
    const [showResult, setShowResult] = useState(false)
    const [selectedOption, setSelectedOption] = useState(null)
    const [feedback, setFeedback] = useState(null)
    const [certification, setCertification] = useState(null)
    const [selectedNode, setSelectedNode] = useState(null)
    const [activeBookContent, setActiveBookContent] = useState(null)
    const [useBackupVideo, setUseBackupVideo] = useState(false)

    useEffect(() => {
       setUseBackupVideo(false)
    }, [lessonIndex, selectedTrack])

    useEffect(() => {
       setError(null)
       if (view === 'hub') {
          if (!data) {
             setLoading(true)
             fetch('/api/academy/suggested-path')
                .then(res => {
                   if (!res.ok) throw new Error('Academy Database Offline')
                   return res.json()
                })
                .then(d => { setData(d); setLoading(false) })
                .catch(e => { setError(e.message); setLoading(false) })
          } else {
             setLoading(false)
          }
       } else if (view === 'quiz') {
          if (!quiz) {
             setLoading(true)
             fetch('/api/academy/quiz')
                .then(res => {
                   if (!res.ok) throw new Error('AI Question Engine Offline')
                   return res.json()
                })
                .then(d => { setQuiz(d); setLoading(false); setQuizIndex(0); setScore(0); setShowResult(false); setSelectedOption(null); setFeedback(null) })
                .catch(e => { setError(e.message); setLoading(false) })
          } else {
             setQuizIndex(0)
             setScore(0)
             setShowResult(false)
             setSelectedOption(null)
             setFeedback(null)
             setLoading(false)
          }
       } else if (view === 'patterns') {
          if (!patterns) {
             setLoading(true)
             fetch('/api/academy/patterns')
                .then(res => {
                   if (!res.ok) throw new Error('Visual Pattern Engine Offline')
                   return res.json()
                })
                .then(d => { setPatterns(d); setLoading(false); setPatternIndex(0); setScore(0); setShowResult(false); setSelectedOption(null); setFeedback(null) })
                .catch(e => { setError(e.message); setLoading(false) })
          } else {
             setPatternIndex(0)
             setScore(0)
             setShowResult(false)
             setSelectedOption(null)
             setFeedback(null)
             setLoading(false)
          }
       } else if (view === 'track') {
          const isCorrectTrackLoaded = lessons && lessons.length > 0 && lessons[0].id.startsWith(selectedTrack)
          if (!isCorrectTrackLoaded) {
             setLoading(true)
             fetch(`/api/academy/track/${selectedTrack}`)
                .then(res => {
                   if (!res.ok) throw new Error('Course Matrix Unreachable')
                   return res.json()
                })
                .then(d => { setLessons(d); setLoading(false); setLessonIndex(0) })
                .catch(e => { setError(e.message); setLoading(false) })
          } else {
             setLessonIndex(0)
             setLoading(false)
          }
       } else if (view === 'personalized') {
          if (!weaknesses) {
             setLoading(true)
             fetch('/api/academy/personalized-lessons')
                .then(res => {
                    if (!res.ok) throw new Error('AI Personalization Engine Offline')
                    return res.json()
                 })
                .then(d => {
                    if (d.error) throw new Error(d.error)
                    if (!d.weaknesses || d.weaknesses.length === 0) {
                       throw new Error("No weaknesses identified yet. Complete some simulated trades first.")
                    }
                    setWeaknesses(d.weaknesses)
                    setLoading(false)
                 })
                .catch(e => { setError(e.message); setLoading(false) })
          } else {
             setLoading(false)
          }
       } else if (view === 'exam') {
          setLoading(true)
          fetch(`/api/academy/generate-exam?track_id=${selectedTrack}`)
             .then(res => res.json())
             .then(d => { setExam(d.questions); setLoading(false); setExamIndex(0); setScore(0); setShowResult(false) })
             .catch(e => { setError(e.message); setLoading(false) })
       } else {
          setLoading(false)
       }
    }, [view, selectedTrack])

    const fetchGraph = async () => {
       setLoading(true)
       try {
          const res = await fetch('/api/academy/knowledge-graph')
          setGraphData(await res.json())
          setView('graph')
       } catch {}
       finally { setLoading(false) }
    }

    const fetchMistake = async () => {
       setLoading(true)
       try {
          const res = await fetch('/api/academy/mistake-replay')
          setMistake(await res.json())
          setView('mistake')
       } catch {}
       finally { setLoading(false) }
    }

    const fetchScenarios = async () => {
       setLoading(true)
       try {
          const res = await fetch('/api/academy/simulation-scenarios')
          setScenarios(await res.json())
          setView('simulation')
       } catch {}
       finally { setLoading(false) }
    }

   const handleAnswer = (idx, type) => {
      if (selectedOption !== null) return
      setSelectedOption(idx)
      const currentList = type === 'quiz' ? quiz : type === 'patterns' ? patterns : exam
      const currentIndex = type === 'quiz' ? quizIndex : type === 'patterns' ? patternIndex : examIndex
      
      const correctIdx = type === 'exam' ? currentList[currentIndex].a : currentList[currentIndex].correct
      const isCorrect = idx === correctIdx
      if (isCorrect) setScore(s => s + 1)
      setFeedback(isCorrect ? 'correct' : 'incorrect')
   }

   const handleNext = (type) => {
      const currentList = type === 'quiz' ? quiz : type === 'patterns' ? patterns : exam
      const currentIndex = type === 'quiz' ? quizIndex : type === 'patterns' ? patternIndex : examIndex
      
      if (currentIndex < currentList.length - 1) {
         if (type === 'quiz') setQuizIndex(i => i + 1)
         else if (type === 'patterns') setPatternIndex(i => i + 1)
         else setExamIndex(i => i + 1)
         setSelectedOption(null)
         setFeedback(null)
      } else {
         setShowResult(true)
         if (type === 'exam' && score >= currentList.length - 1) {
            setCertification({
               title: `Certified ${selectedTrack.charAt(0).toUpperCase() + selectedTrack.slice(1)} Architect`,
               date: new Date().toLocaleDateString(),
               id: Math.random().toString(36).substr(2, 9).toUpperCase()
            })
         }
      }
   }

   const handleDownloadBook = async () => {
      setDownloading(true)
      try {
         const lesson = lessons[lessonIndex]
         const res = await fetch(`/api/academy/generate-book?lesson_id=${lesson.id}&title=${encodeURIComponent(lesson.title)}`)
         const data = await res.json()
         
         // Open the inline HTML viewer modal (fixes Android download blocking)
         setActiveBookContent(data.content)
      } catch (e) {
         setError('Failed to generate AI book')
      } finally {
         setDownloading(false)
      }
   }

   const toggleAudio = (lesson) => {
      const splitTextIntoTTSChunks = (text, maxLength = 180) => {
         const sentences = text.match(/[^.!?]+[.!?]*/g) || [text]
         const chunks = []
         for (let sentence of sentences) {
            sentence = sentence.trim()
            if (!sentence) continue
            if (sentence.length <= maxLength) {
               chunks.push(sentence)
            } else {
               const words = sentence.split(' ')
               let currentChunk = ''
               for (const word of words) {
                  if ((currentChunk + ' ' + word).trim().length <= maxLength) {
                     currentChunk = (currentChunk + ' ' + word).trim()
                  } else {
                     if (currentChunk) chunks.push(currentChunk)
                     currentChunk = word
                  }
               }
               if (currentChunk) chunks.push(currentChunk)
            }
         }
         return chunks
      }

      const synth = typeof window !== 'undefined' ? window.speechSynthesis : null

      if (isPlayingAudio) {
         if (window.activeSimulatedAudio) {
            clearInterval(window.activeSimulatedAudio)
            window.activeSimulatedAudio = null
         }
         if (window.activeAudioPlayer) {
            window.activeAudioPlayer.pause()
            window.activeAudioPlayer = null
         }
         if (synth) synth.cancel()
         setIsPlayingAudio(false)
         setCaption('')
      } else {
         const textToSpeak = lesson.full_concept || lesson.content
         
         const isMobileApp = typeof window !== 'undefined' && (
           window.Capacitor ||
           window.location.origin.startsWith('capacitor://') ||
           window.navigator.userAgent.includes('Android') ||
           window.navigator.userAgent.includes('iPhone') ||
           window.navigator.userAgent.includes('iPad')
         );

         if (isMobileApp) {
            setIsPlayingAudio(true)
            
            let savedIp = localStorage.getItem('backend_ip');
            if (!savedIp || savedIp === '192.168.137.1') {
               savedIp = 'https://trademind-backend-vldj.onrender.com';
            }
            const savedPort = localStorage.getItem('backend_port') || '8000';
            const baseUrl = (savedIp.startsWith('http://') || savedIp.startsWith('https://'))
               ? savedIp
               : `http://${savedIp}:${savedPort}`;
               
            const audioUrl = `${baseUrl}/api/tts?text=${encodeURIComponent(textToSpeak)}`
            const audio = new Audio(audioUrl)
            window.activeAudioPlayer = audio
            
            const words = textToSpeak.split(' ')
            let wordIdx = 0
            
            audio.onplay = () => {
               const intervalId = setInterval(() => {
                  if (wordIdx >= words.length) {
                     clearInterval(intervalId)
                     window.activeSimulatedAudio = null
                  } else {
                     setCaption(words.slice(Math.max(0, wordIdx - 3), wordIdx + 5).join(' ') + '...')
                     wordIdx += 3
                  }
               }, 750)
               window.activeSimulatedAudio = intervalId
            }
            
            audio.onended = () => {
               if (window.activeSimulatedAudio) {
                  clearInterval(window.activeSimulatedAudio)
                  window.activeSimulatedAudio = null
               }
               setIsPlayingAudio(false)
               setCaption('')
            }
            
            audio.onerror = (e) => {
               console.error("Audio error", e)
               if (window.activeSimulatedAudio) {
                  clearInterval(window.activeSimulatedAudio)
                  window.activeSimulatedAudio = null
               }
               setIsPlayingAudio(false)
               setCaption('')
            }
            
            audio.play().catch(err => {
               console.error("Play failed", err)
               if (window.activeSimulatedAudio) {
                  clearInterval(window.activeSimulatedAudio)
                  window.activeSimulatedAudio = null
               }
               setIsPlayingAudio(false)
               setCaption('')
            })
            return
         }

         if (!synth) {
            // System speech engine is unavailable (e.g. Capacitor custom scheme restriction)
            // Run visual audio simulation to keep the UI alive and premium
            setIsPlayingAudio(true)
            const words = textToSpeak.split(' ')
            let wordIdx = 0
            
            const intervalId = setInterval(() => {
               if (wordIdx >= words.length) {
                  clearInterval(intervalId)
                  window.activeSimulatedAudio = null
                  setIsPlayingAudio(false)
                  setCaption('')
               } else {
                  setCaption(words.slice(Math.max(0, wordIdx - 3), wordIdx + 5).join(' ') + '...')
                  wordIdx += 3
               }
            }, 600)
            
            window.activeSimulatedAudio = intervalId
            return
         }

         synth.cancel() // Cancel any ongoing speech first
         
         const utter = new SpeechSynthesisUtterance(textToSpeak)
         
         // Webview SpeechSynthesis Fix: select active English voice
         const voices = synth.getVoices()
         if (voices.length > 0) {
            const englishVoice = voices.find(v => v.lang.startsWith('en'))
            if (englishVoice) {
               utter.voice = englishVoice
            }
         }
         
         utter.rate = 1.0
         utter.volume = 1.0
         
         utter.onboundary = (event) => {
            const words = textToSpeak.split(' ')
            const wordIndex = Math.floor(event.charIndex / 10) 
            setCaption(words.slice(Math.max(0, wordIndex-3), wordIndex+5).join(' ') + '...')
         }
         
         utter.onend = () => {
            setIsPlayingAudio(false)
            setCaption('')
         }
         
         utter.onerror = (e) => {
            console.error("SpeechSynthesis error:", e)
            setIsPlayingAudio(false)
            setCaption('')
         }
         
         synth.speak(utter)
         setIsPlayingAudio(true)
      }
   }

   useEffect(() => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
         // Trigger voice load event for Android WebView compatibility
         window.speechSynthesis.getVoices()
         if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = () => {
               window.speechSynthesis.getVoices()
            }
         }
      }
      return () => {
         if (typeof window !== 'undefined') {
            if (window.speechSynthesis) {
               window.speechSynthesis.cancel()
            }
            if (window.activeAudioPlayer) {
               window.activeAudioPlayer.pause()
               window.activeAudioPlayer = null
            }
            if (window.activeSimulatedAudio) {
               clearInterval(window.activeSimulatedAudio)
               window.activeSimulatedAudio = null
            }
         }
      }
   }, [])

   if (loading) return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
         <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin" />
         <div className="text-text-dim font-grotesk animate-pulse">
            {view === 'hub' ? 'Initializing Educational Engine...' : 'Syncing AI Question Matrix...'}
         </div>
      </div>
   )

   if (error) return (
      <div className="p-8 text-center mt-20">
         <Info size={48} className="mx-auto text-red-500 mb-4" />
         <div className="text-xl font-bold mb-2">Neural Link Failed</div>
         <div className="text-text-dim mb-6">{error}</div>
         <button onClick={() => setView('hub')} className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10">Back to Academy</button>
      </div>
   )

   return (
      <div className="fade-in slide-up pb-24">
         <div className="page-header" style={{ marginBottom: 20 }}>
            <button onClick={view === 'hub' ? onBack : () => setView('hub')} className="back-btn">
               <ChevronLeft size={20} />
            </button>
            <div className="page-title">{view === 'hub' ? 'TradeMind Academy' : view.toUpperCase()}</div>
            <div style={{ width: 32 }} />
         </div>

         <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px' }}>
            {view === 'hub' && (
               <>
                  {/* Institutional Mode Toggle */}
                  <div className="flex items-center justify-between p-4 mb-6 glass-morphism-premium border-amber-500/30 rounded-2xl">
                     <div className="flex items-center gap-3">
                        <Star size={20} className={institutionalMode ? "text-amber-500 animate-pulse" : "text-text-dim"} />
                        <div>
                           <div className="text-[10px] text-amber-500 font-bold uppercase">Tier 5 Access</div>
                           <h4 className="font-bold font-grotesk text-sm">Institutional Mode</h4>
                        </div>
                     </div>
                     <button 
                        onClick={() => setInstitutionalMode(!institutionalMode)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${institutionalMode ? 'bg-amber-500' : 'bg-white/10'}`}
                     >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${institutionalMode ? 'translate-x-6' : 'translate-x-0'}`} />
                     </button>
                  </div>

                  {/* AI Suggestion */}
                  <div className="card mb-6 glass-morphism-premium relative overflow-hidden border-neon-purple/30">
                     <div className="absolute top-0 right-0 p-4">
                        <Activity size={20} className="text-neon-purple animate-pulse" />
                     </div>
                     <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center flex-shrink-0">
                           <Info size={24} className="text-neon-purple" />
                        </div>
                        <div className="flex-1">
                           <div className="text-[10px] text-neon-purple font-bold uppercase tracking-widest mb-1">AI Recommendation</div>
                           <h2 className="text-xl font-bold font-grotesk mb-2">Next Path: {data?.suggested?.name}</h2>
                           <p className="text-sm text-text-dim leading-relaxed mb-4">{data?.suggested?.desc}</p>
                           <div className="flex gap-3">
                              <button onClick={() => { setSelectedTrack(data?.suggested?.id); setView('track'); }} className="px-6 py-2 bg-neon-purple text-white rounded-xl font-bold text-xs shadow-lg shadow-neon-purple/30 hover:scale-105 transition-transform">START TRACK</button>
                              <button onClick={() => setView('personalized')} className="px-6 py-2 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-xs hover:bg-white/10 transition-colors">PERSONALIZED DRILLS</button>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Tools Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                     <div onClick={() => setView('quiz')} className="card p-6 glass-morphism-premium border-neon-blue/20 hover:border-neon-blue transition-colors cursor-pointer group">
                        <Brain size={32} className="text-neon-blue mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="font-bold font-grotesk">AI Quiz Engine</h3>
                        <p className="text-[10px] text-text-dim uppercase font-bold">Dynamic Challenges</p>
                     </div>
                     <div onClick={() => setView('patterns')} className="card p-6 glass-morphism-premium border-neon-green/20 hover:border-neon-green transition-colors cursor-pointer group">
                        <Target size={32} className="text-neon-green mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="font-bold font-grotesk">Pattern Mastery</h3>
                        <p className="text-[10px] text-text-dim uppercase font-bold">Visual Recognition</p>
                     </div>
                  </div>

                  {/* All Tracks */}
                  <div className="section-title mb-4 px-2 flex justify-between items-center">
                     <span>{institutionalMode ? 'Institutional Tracks' : 'Core Learning Tracks'}</span>
                     {institutionalMode && <span className="text-[8px] bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full font-bold uppercase">ELITE TIER</span>}
                  </div>
                  <div className="space-y-4">
                     {data?.all_paths?.filter(p => institutionalMode ? p.tier === 'elite' : !p.tier).map(path => (
                        <div key={path.id} onClick={() => { setSelectedTrack(path.id); setView('track'); }} className={`card p-5 glass-morphism-premium flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors ${institutionalMode ? 'border-amber-500/20' : ''}`}>
                           <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-neon-blue/50 transition-colors ${institutionalMode ? 'group-hover:border-amber-500/50' : ''}`}>
                                 <BookOpen size={20} className={`text-text-dim ${institutionalMode ? 'group-hover:text-amber-500' : 'group-hover:text-neon-blue'}`} />
                              </div>
                              <div>
                                 <h4 className="font-bold font-grotesk">{path.name}</h4>
                                 <p className="text-[10px] text-text-dim uppercase font-bold">12 Lessons · {institutionalMode ? 'Elite' : 'Professional'}</p>
                              </div>
                           </div>
                           <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition-colors ${institutionalMode ? 'group-hover:bg-amber-500' : 'group-hover:bg-neon-blue'}`}>
                              <Play size={14} className="group-hover:fill-white text-transparent group-hover:text-white" />
                           </div>
                        </div>
                     ))}
                  </div>
               </>
            )}

            {view === 'quiz' && !loading && quiz && (
               <div className="fade-in">
                  {!showResult ? (
                     <>
                        <div className="flex justify-between items-center mb-8">
                           <div className="text-xs font-bold text-text-dim uppercase tracking-widest">Question {quizIndex + 1} of {quiz.length}</div>
                           <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-neon-blue" style={{ width: `${((quizIndex + 1) / quiz.length) * 100}%` }} />
                           </div>
                        </div>

                        <div className="card p-8 glass-morphism-premium mb-8 border-neon-blue/30 text-center min-h-[200px] flex flex-col justify-center">
                           <h2 className="text-xl font-bold font-grotesk leading-relaxed">{quiz[quizIndex].question}</h2>
                        </div>

                        <div className="space-y-4">
                           {quiz[quizIndex].options.map((opt, i) => (
                              <button 
                                 key={i} 
                                 onClick={() => handleAnswer(i, 'quiz')}
                                 disabled={selectedOption !== null}
                                 className={`w-full p-5 rounded-2xl border text-left font-semibold transition-all flex items-center justify-between ${
                                    selectedOption === i 
                                       ? (i === quiz[quizIndex].correct ? 'bg-neon-green/10 border-neon-green text-neon-green' : 'bg-red-500/10 border-red-500 text-red-500')
                                       : (selectedOption !== null && i === quiz[quizIndex].correct ? 'bg-neon-green/10 border-neon-green text-neon-green' : 'bg-white/5 border-white/10 hover:bg-white/10')
                                 }`}
                              >
                                 <span>{opt}</span>
                                 {selectedOption === i && (
                                    i === quiz[quizIndex].correct ? <CheckCircle2 size={20} /> : <XCircle size={20} />
                                 )}
                              </button>
                           ))}
                        </div>

                        {feedback && (
                           <div className={`mt-8 p-6 rounded-2xl border slide-up ${feedback === 'correct' ? 'bg-neon-green/5 border-neon-green/20' : 'bg-red-500/5 border-red-500/20'}`}>
                              <div className="flex justify-between items-start mb-2 gap-4">
                                 <div className="flex items-center gap-3">
                                    {feedback === 'correct' ? <Star size={18} className="text-neon-green" /> : <Info size={18} className="text-neon-orange" />}
                                    <span className="font-bold uppercase text-[10px] tracking-widest">{feedback === 'correct' ? 'Genius Move!' : 'Learning Opportunity'}</span>
                                 </div>
                                 <button 
                                    onClick={() => handleNext('quiz')} 
                                    className="px-4 py-2 bg-neon-blue rounded-xl text-white font-bold text-xs hover:scale-105 transition-transform flex items-center gap-1 flex-shrink-0"
                                 >
                                    <span>{quizIndex < quiz.length - 1 ? 'NEXT QUESTION' : 'SEE RESULTS'}</span>
                                    <ChevronRight size={12} />
                                 </button>
                              </div>
                              <p className="text-sm leading-relaxed text-text-dim mt-2">{quiz[quizIndex].explanation}</p>
                           </div>
                        )}
                     </>
                  ) : (
                     <div className="text-center py-12 slide-up">
                        <div className="w-24 h-24 rounded-full bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-neon-blue/20">
                           <Trophy size={48} className="text-neon-blue" />
                        </div>
                        <h2 className="text-3xl font-bold font-grotesk mb-2">Quiz Complete!</h2>
                        <p className="text-text-dim mb-8">You scored {score} out of {quiz.length}</p>
                        
                        <div className="card p-6 glass-morphism-premium mb-8 max-w-sm mx-auto">
                           <div className="text-[10px] text-neon-green font-bold uppercase tracking-widest mb-4">Skill Update</div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-semibold">Risk Management</span>
                              <span className="text-sm font-bold text-neon-green">+15 XP</span>
                           </div>
                           <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-neon-green animate-grow" style={{ width: '75%' }} />
                           </div>
                        </div>

                        <button onClick={() => setView('hub')} className="px-12 py-4 bg-neon-blue text-white rounded-2xl font-bold shadow-lg shadow-neon-blue/30 hover:scale-105 transition-transform">RETURN TO ACADEMY</button>
                     </div>
                  )}
               </div>
            )}

            {view === 'patterns' && !loading && patterns && (
               <div className="fade-in">
                  {!showResult ? (
                     <>
                        <div className="flex justify-between items-center mb-6">
                           <div className="text-xs font-bold text-text-dim uppercase tracking-widest">Challenge {patternIndex + 1} of {patterns.length}</div>
                           <div className="flex gap-2">
                              <button onClick={() => setPatternIndex(i => Math.max(0, i-1))} className="p-1 text-text-dim hover:text-white"><ChevronLeft size={16}/></button>
                              <div className="h-1 w-24 bg-white/5 rounded-full mt-2 overflow-hidden">
                                 <div className="h-full bg-neon-green" style={{ width: `${((patternIndex + 1) / patterns.length) * 100}%` }} />
                              </div>
                           </div>
                        </div>

                        <div className="relative aspect-video rounded-3xl overflow-hidden mb-6 border border-white/10 shadow-2xl">
                           <img src={patterns[patternIndex].image} alt="Chart Pattern" className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                           <div className="absolute bottom-0 left-0 p-6">
                              <div className="text-xs text-neon-blue font-bold uppercase tracking-widest mb-1">{patterns[patternIndex].title}</div>
                              <h3 className="text-xl font-bold">{patterns[patternIndex].question}</h3>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           {patterns[patternIndex].options.map((opt, i) => (
                              <button 
                                 key={i} 
                                 onClick={() => handleAnswer(i, 'patterns')}
                                 disabled={selectedOption !== null}
                                 className={`p-4 rounded-xl border text-sm font-bold transition-all ${
                                    selectedOption === i 
                                       ? (i === patterns[patternIndex].correct ? 'bg-neon-green/10 border-neon-green text-neon-green' : 'bg-red-500/10 border-red-500 text-red-500')
                                       : (selectedOption !== null && i === patterns[patternIndex].correct ? 'bg-neon-green/10 border-neon-green text-neon-green' : 'bg-white/5 border-white/10')
                                 }`}
                              >
                                 {opt}
                              </button>
                           ))}
                        </div>

                        {feedback && (
                           <div className={`mt-6 p-5 rounded-2xl border slide-up ${feedback === 'correct' ? 'bg-neon-green/5 border-neon-green/20' : 'bg-red-500/5 border-red-500/20'}`}>
                              <div className="flex justify-between items-start mb-2 gap-4">
                                 <div className="flex items-center gap-3">
                                    <Star size={16} className={feedback === 'correct' ? 'text-neon-green' : 'text-neon-orange'} />
                                    <span className="font-bold uppercase text-[9px] tracking-widest">{feedback === 'correct' ? 'Pattern Identified' : 'Analysis Missed'}</span>
                                 </div>
                                 <button 
                                    onClick={() => handleNext('patterns')} 
                                    className="px-4 py-2 bg-neon-green rounded-xl text-black font-bold text-xs hover:scale-105 transition-transform flex items-center gap-1 flex-shrink-0"
                                 >
                                    <span>{patternIndex < patterns.length - 1 ? 'NEXT CHALLENGE' : 'SEE RESULTS'}</span>
                                    <ChevronRight size={12} />
                                 </button>
                              </div>
                              <p className="text-xs leading-relaxed text-text-dim mt-1">{patterns[patternIndex].explanation}</p>
                           </div>
                        )}
                     </>
                  ) : (
                     <div className="text-center py-12 slide-up">
                        <div className="w-24 h-24 rounded-full bg-neon-green/10 border border-neon-green/20 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-neon-green/20">
                           <Trophy size={48} className="text-neon-green" />
                        </div>
                        <h2 className="text-3xl font-bold font-grotesk mb-2">Mastery Improved!</h2>
                        <p className="text-text-dim mb-8">You correctly identified {score} patterns.</p>
                        <button onClick={() => setView('hub')} className="px-12 py-4 bg-neon-green text-black rounded-2xl font-bold hover:scale-105 transition-transform">CONTINUE TRAINING</button>
                     </div>
                  )}
               </div>
            )}

            {view === 'track' && !loading && lessons && (
               <div className="fade-in">
                  {/* Lesson Header */}
                  <div className="flex justify-between items-center mb-6">
                     <div>
                        <div className="text-[10px] text-neon-blue font-bold uppercase tracking-widest mb-1">Lesson {lessonIndex + 1} of {lessons.length}</div>
                        <h2 className="text-2xl font-bold font-grotesk">{lessons[lessonIndex].title}</h2>
                     </div>
                     <div className="flex gap-2">
                        <button 
                           onClick={() => setLessonIndex(i => Math.max(0, i-1))}
                           disabled={lessonIndex === 0}
                           className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 disabled:opacity-30"
                        >
                           <ChevronLeft size={20}/>
                        </button>
                        <button 
                           onClick={() => setLessonIndex(i => Math.min(lessons.length - 1, i+1))}
                           disabled={lessonIndex === lessons.length - 1}
                           className="w-10 h-10 rounded-full bg-neon-blue text-white flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-30"
                        >
                           <ChevronRight size={20}/>
                        </button>
                     </div>
                  </div>

                  {/* Video Section */}
                  <div className="w-full aspect-video rounded-3xl overflow-hidden bg-black border border-white/10 relative group shadow-2xl mb-8">
                        {!useBackupVideo && lessons[lessonIndex].youtube_id ? (
                           <iframe 
                              width="100%" 
                              height="100%" 
                              src={`https://www.youtube.com/embed/${lessons[lessonIndex].youtube_id}?rel=0&modestbranding=1&enablejsapi=1`} 
                              title="Masterclass" 
                              frameBorder="0" 
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                              allowFullScreen
                              className="absolute inset-0"
                           ></iframe>
                        ) : (
                           <GenerativeAIVideo 
                              title={lessons[lessonIndex].title}
                              isPlayingAudio={isPlayingAudio}
                              caption={caption}
                              videoUrl={lessons[lessonIndex].video_url}
                           />
                        )}
                        
                        {/* Neural Animation Overlay (Conditional) */}
                        {isPlayingAudio && (
                           <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
                              <div className="absolute inset-0 bg-neon-blue/10 backdrop-blur-[2px]" />
                              <div className="absolute top-0 left-0 w-full h-1 bg-neon-blue/40 animate-scan" />
                              <div className="absolute bottom-12 left-10 right-10 p-5 bg-black/80 backdrop-blur-xl rounded-3xl border border-neon-blue/30 text-center animate-slide-up shadow-2xl">
                                 <p className="text-sm font-bold text-white font-grotesk tracking-wide leading-relaxed italic">"{caption}"</p>
                              </div>
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                 <div className="w-64 h-64 border-2 border-neon-blue/30 rounded-full animate-ping opacity-30" />
                              </div>
                           </div>
                        )}

                        <button 
                           onClick={() => toggleAudio(lessons[lessonIndex])}
                           className={`absolute bottom-4 left-4 p-3 rounded-full backdrop-blur-md border border-white/20 transition-all z-20 ${isPlayingAudio ? 'bg-neon-blue text-white shadow-lg shadow-neon-blue/40' : 'bg-black/60 text-white hover:bg-black/95'}`}
                        >
                           {isPlayingAudio ? <Activity size={24} /> : <div className="flex items-center gap-2"><Play size={20} /><span className="text-[10px] font-bold">AI BRIEFING</span></div>}
                        </button>
                        
                        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10 pointer-events-none">
                           <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                           <span className="text-[10px] font-bold uppercase">AI VIDEO MASTERCLASS</span>
                        </div>

                        {lessons[lessonIndex].youtube_id && (
                           <button
                              onClick={() => setUseBackupVideo(!useBackupVideo)}
                              className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-black/60 hover:bg-black/85 backdrop-blur-md rounded-full border border-white/20 text-[9px] font-bold text-white transition-colors"
                           >
                              {useBackupVideo ? "📺 Watch YouTube Masterclass" : "✨ Stream Generative AI Video"}
                           </button>
                        )}
                     </div>

                      {false && <div className="aspect-video rounded-3xl glass-morphism-premium p-6 border border-white/5 relative flex flex-col justify-between">
                         <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-bold font-grotesk text-white">
                               {lessons[lessonIndex].chart_type === 'oscillator' && 'RSI Momentum Oscillator'}
                               {lessons[lessonIndex].chart_type === 'equity' && 'Strategy Expectancy Curve'}
                               {lessons[lessonIndex].chart_type === 'volatility' && 'Volatility ATR Envelope'}
                               {lessons[lessonIndex].chart_type === 'price_levels' && 'Liquidity Channel Boundaries (S/R)'}
                            </h4>
                            <span className="text-[9px] font-bold text-neon-green bg-neon-green/10 border border-neon-green/20 px-2 py-0.5 rounded-full uppercase">
                               Interactive Analysis
                            </span>
                         </div>
                         <div className="flex-1 w-full min-h-[60%]">
                            <ResponsiveContainer width="100%" height="100%">
                               {lessons[lessonIndex].chart_type === 'oscillator' && (
                                  <AreaChart data={lessons[lessonIndex].chart_data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                     <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" style={{ fontSize: 9 }} />
                                     <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.3)" style={{ fontSize: 9 }} />
                                     <Tooltip contentStyle={{ background: '#121214', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                                     <ReferenceLine y={70} stroke="rgba(239, 68, 68, 0.4)" strokeDasharray="3 3" label={{ value: 'OB 70', fill: 'rgba(239, 68, 68, 0.6)', fontSize: 8, position: 'insideTopRight' }} />
                                     <ReferenceLine y={30} stroke="rgba(16, 185, 129, 0.4)" strokeDasharray="3 3" label={{ value: 'OS 30', fill: 'rgba(16, 185, 129, 0.6)', fontSize: 8, position: 'insideBottomRight' }} />
                                     <Area type="monotone" dataKey="value" stroke="var(--neon-blue)" fill="rgba(59, 130, 246, 0.1)" strokeWidth={2.5} />
                                  </AreaChart>
                               )}
                               {lessons[lessonIndex].chart_type === 'equity' && (
                                  <LineChart data={lessons[lessonIndex].chart_data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                     <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" style={{ fontSize: 9 }} />
                                     <YAxis stroke="rgba(255,255,255,0.3)" style={{ fontSize: 9 }} />
                                     <Tooltip contentStyle={{ background: '#121214', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                                     <Line type="monotone" dataKey="disciplined" stroke="#10b981" strokeWidth={2.5} name="1% Risk Rule" dot={{ r: 2 }} />
                                     <Line type="monotone" dataKey="leverage" stroke="#f97316" strokeWidth={2.5} name="Unmanaged Leverage" dot={{ r: 2 }} />
                                  </LineChart>
                               )}
                               {lessons[lessonIndex].chart_type === 'volatility' && (
                                  <LineChart data={lessons[lessonIndex].chart_data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                     <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" style={{ fontSize: 9 }} />
                                     <YAxis stroke="rgba(255,255,255,0.3)" style={{ fontSize: 9 }} />
                                     <Tooltip contentStyle={{ background: '#121214', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                                     <Line type="monotone" dataKey="price" stroke="var(--neon-blue)" strokeWidth={2.5} name="Asset Price" />
                                     <Line type="monotone" dataKey="atr_stop" stroke="#ef4444" strokeDasharray="4 4" strokeWidth={2} name="ATR Stop-Loss" />
                                  </LineChart>
                               )}
                               {lessons[lessonIndex].chart_type === 'price_levels' && (
                                  <LineChart data={lessons[lessonIndex].chart_data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                     <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" style={{ fontSize: 9 }} />
                                     <YAxis stroke="rgba(255,255,255,0.3)" style={{ fontSize: 9 }} />
                                     <Tooltip contentStyle={{ background: '#121214', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                                     <Line type="monotone" dataKey="price" stroke="var(--neon-blue)" strokeWidth={2.5} name="Price Action" />
                                     <ReferenceLine y={155} stroke="rgba(239, 68, 68, 0.4)" strokeDasharray="3 3" label={{ value: 'Resistance', fill: 'rgba(239, 68, 68, 0.6)', fontSize: 8, position: 'insideTopRight' }} />
                                     <ReferenceLine y={145} stroke="rgba(16, 185, 129, 0.4)" strokeDasharray="3 3" label={{ value: 'Support', fill: 'rgba(16, 185, 129, 0.6)', fontSize: 8, position: 'insideBottomRight' }} />
                                  </LineChart>
                               )}
                            </ResponsiveContainer>
                         </div>
                         <p className="text-[10px] text-text-dim text-center mt-2 leading-relaxed">
                            {lessons[lessonIndex].chart_desc}
                         </p>
                      </div>}

                  {/* Content Section */}
                  <div className="card p-6 md:p-8 glass-morphism-premium border-neon-blue/20 mb-8 relative overflow-hidden">
                     {/* Flex Header with Key Learning Point and Download Button */}
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-neon-blue/10 flex items-center justify-center flex-shrink-0">
                              <Star size={18} className="text-neon-blue" />
                           </div>
                           <span className="font-bold uppercase text-xs tracking-widest">Key Learning Point</span>
                        </div>
                        <button 
                           onClick={handleDownloadBook}
                           disabled={downloading}
                           className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-xs font-bold self-start sm:self-auto"
                        >
                           {downloading ? (
                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                           ) : <Download size={14} className="text-neon-blue" />}
                           {downloading ? 'AI WRITING...' : 'DOWNLOAD AI BOOK'}
                        </button>
                     </div>
                     <p className="text-lg leading-relaxed text-text-dim font-grotesk">
                        {lessons[lessonIndex].content}
                     </p>
                  </div>
                   <div className="flex gap-4">
                      <button onClick={() => setView('hub')} className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-colors">BACK TO HUB</button>
                      <button 
                         onClick={() => lessonIndex === lessons.length - 1 ? setView('exam') : setLessonIndex(i => i+1)} 
                         className={`flex-[2] py-4 rounded-2xl font-bold shadow-lg transition-transform hover:scale-[1.02] ${lessonIndex === lessons.length - 1 ? 'bg-amber-500 text-black shadow-amber-500/20' : 'bg-neon-blue text-white shadow-neon-blue/20'}`}
                      >
                         {lessonIndex === lessons.length - 1 ? 'TAKE CERTIFICATION EXAM' : 'NEXT LESSON'}
                      </button>
                   </div>
                </div>
             )}

             {view === 'personalized' && !loading && weaknesses && (
                <div className="fade-in">
                   <div className="section-title mb-6">AI Weakness Identification</div>
                   <div className="space-y-6">
                      {weaknesses.map((w, i) => (
                         <div key={i} className={`card p-6 glass-morphism-premium border-l-4 ${w.severity === 'High' ? 'border-l-red-500' : 'border-l-amber-500'}`}>
                            <div className="flex justify-between items-start mb-4">
                               <div>
                                  <div className="text-[10px] font-bold uppercase tracking-widest text-text-dim mb-1">{w.topic}</div>
                                  <h3 className="text-xl font-bold font-grotesk">{w.issue}</h3>
                               </div>
                               <div className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase ${w.severity === 'High' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'}`}>
                                  {w.severity} SEVERITY
                               </div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10 mb-4">
                               <p className="text-sm text-text-dim leading-relaxed italic">"{w.lesson}"</p>
                            </div>
                            <button onClick={() => setView('quiz')} className="w-full py-3 bg-neon-blue text-white rounded-xl font-bold text-xs hover:scale-105 transition-transform">PRACTICE THIS DRILL</button>
                         </div>
                      ))}
                   </div>
                   <button onClick={() => setView('hub')} className="w-full mt-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold">RETURN TO HUB</button>
                </div>
             )}

             {view === 'exam' && !loading && exam && (
                <div className="fade-in">
                   {!showResult ? (
                      <>
                         <div className="flex justify-between items-center mb-8">
                            <div>
                               <div className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mb-1">Certification Exam Active</div>
                               <h2 className="text-2xl font-bold font-grotesk">Question {examIndex + 1} of {exam.length}</h2>
                            </div>
                            <div className="text-right">
                               <div className="text-xs font-bold text-text-dim">Pass Mark: 80%</div>
                               <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden mt-2">
                                  <div className="h-full bg-amber-500" style={{ width: `${((examIndex + 1) / exam.length) * 100}%` }} />
                               </div>
                            </div>
                         </div>

                         <div className="card p-10 glass-morphism-premium mb-8 border-amber-500/30 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500/20" />
                            <h2 className="text-2xl font-bold font-grotesk leading-tight">{exam[examIndex].q}</h2>
                         </div>

                         <div className="grid grid-cols-1 gap-4">
                            {exam[examIndex].o.map((opt, i) => (
                               <button 
                                  key={i} 
                                  onClick={() => handleAnswer(i, 'exam')}
                                  disabled={selectedOption !== null}
                                  className={`w-full p-6 rounded-2xl border text-left font-bold transition-all relative overflow-hidden ${
                                     selectedOption === i 
                                        ? (i === exam[examIndex].a ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-red-500/10 border-red-500 text-red-500')
                                        : (selectedOption !== null && i === exam[examIndex].a ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-white/5 border-white/10 hover:bg-white/10')
                                  }`}
                               >
                                  <span className="relative z-10">{opt}</span>
                                  {selectedOption === i && (
                                     <div className="absolute inset-0 bg-white/5 animate-pulse" />
                                  )}
                               </button>
                            ))}
                         </div>
                         {selectedOption !== null && (
                             <div className="mt-8 flex justify-end">
                                <button 
                                   onClick={() => handleNext('exam')} 
                                   className="px-6 py-3 bg-amber-500 rounded-xl text-black font-bold text-sm hover:scale-105 transition-transform flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                                >
                                   <span>{examIndex < exam.length - 1 ? 'NEXT QUESTION' : 'SUBMIT EXAM'}</span>
                                   <ChevronRight size={14} />
                                </button>
                             </div>
                          )}
                      </>
                   ) : (
                      <div className="text-center py-12 slide-up">
                         {score >= exam.length - 1 ? (
                            <>
                               <div className="mb-12 relative">
                                  <div className="w-32 h-32 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center mx-auto mb-6 relative z-10 shadow-[0_0_50px_rgba(245,158,11,0.3)]">
                                     <Trophy size={64} className="text-amber-500" />
                                  </div>
                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
                               </div>
                               
                               <h2 className="text-4xl font-bold font-grotesk mb-2 text-amber-500 uppercase tracking-tighter">EXAM PASSED</h2>
                               <p className="text-text-dim mb-10 text-lg">You are now officially certified in {selectedTrack.toUpperCase()}.</p>
                               
                               {/* Holographic Certificate */}
                               <div className="max-w-md mx-auto mb-10 p-1 bg-gradient-to-br from-amber-400 via-amber-200 to-amber-600 rounded-3xl shadow-[0_20px_50px_rgba(245,158,11,0.2)]">
                                  <div className="bg-black rounded-[22px] p-8 text-center relative overflow-hidden">
                                     <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                                     <div className="text-[10px] text-amber-500 font-bold uppercase tracking-[0.5em] mb-6">TradeMind Institutional Board</div>
                                     <h3 className="text-2xl font-bold font-grotesk text-white mb-4">{certification?.title}</h3>
                                     <div className="w-16 h-0.5 bg-amber-500 mx-auto mb-6" />
                                     <div className="flex justify-between text-[8px] text-text-dim uppercase font-bold">
                                        <div>DATE: {certification?.date}</div>
                                        <div>ID: {certification?.id}</div>
                                     </div>
                                  </div>
                                </div>

                               <button onClick={() => setView('hub')} className="px-12 py-5 bg-amber-500 text-black rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl shadow-amber-500/20">REDEEM CERTIFICATION</button>
                            </>
                         ) : (
                            <>
                               <div className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                                  <XCircle size={48} className="text-red-500" />
                               </div>
                               <h2 className="text-3xl font-bold font-grotesk mb-2">Exam Unsuccessful</h2>
                               <p className="text-text-dim mb-8">You scored {score} out of {exam.length}. You need 80% to pass.</p>
                               <button onClick={() => setView('hub')} className="px-12 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold">REVIEW LESSONS</button>
                            </>
                         )}
                      </div>
                   )}
                </div>
             )}

             {view === 'graph' && graphData && (
                <div className="fade-in h-[600px] relative">
                   <div className="flex justify-between items-center mb-8">
                      <button onClick={() => setView('hub')} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all"><ChevronLeft size={24}/></button>
                      <h2 className="text-3xl font-bold font-grotesk tracking-tighter">NEURAL KNOWLEDGE GRAPH</h2>
                      <div className="w-12" />
                   </div>
                   
                   <div className="card h-full glass-morphism-premium relative overflow-hidden flex items-center justify-center">
                      <svg width="100%" height="100%" viewBox="0 0 500 400" className="drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                         {/* Connections */}
                         {graphData.links.map((link, i) => {
                            const s = graphData.nodes.find(n => n.id === link.source)
                            const t = graphData.nodes.find(n => n.id === link.target)
                            return (
                               <line key={i} x1={s.x} y1={s.y} x2={t.x} y2={t.y} stroke={selectedNode?.id === s.id || selectedNode?.id === t.id ? "var(--neon-blue)" : "rgba(59,130,246,0.2)"} strokeWidth={selectedNode?.id === s.id || selectedNode?.id === t.id ? "2" : "1"} className="transition-all" />
                            )
                         })}
                         {/* Nodes */}
                         {graphData.nodes.map((node, i) => (
                            <g key={i} className="cursor-pointer group" onClick={() => setSelectedNode(node)}>
                               <circle cx={node.x} cy={node.y} r="18" fill="rgba(0,0,0,0.8)" stroke={selectedNode?.id === node.id ? "var(--neon-green)" : "var(--neon-blue)"} strokeWidth={selectedNode?.id === node.id ? "3" : "1"} className="transition-all" />
                               <text x={node.x} y={node.y + 35} textAnchor="middle" fill={selectedNode?.id === node.id ? "var(--neon-green)" : "white"} className="text-[10px] font-bold uppercase tracking-widest">{node.label}</text>
                               {selectedNode?.id === node.id ? (
                                  <circle cx={node.x} cy={node.y} r="6" fill="var(--neon-green)" className="animate-pulse" />
                               ) : (
                                  <circle cx={node.x} cy={node.y} r="4" fill="var(--neon-blue)" className="animate-ping" />
                               )}
                            </g>
                         ))}
                      </svg>
                      
                      {/* Briefing Panel */}
                      <div className={`absolute bottom-6 left-6 right-6 p-5 bg-black/80 backdrop-blur-xl border rounded-3xl transition-all duration-500 transform ${selectedNode ? 'translate-y-0 opacity-100 border-neon-blue/40' : 'translate-y-10 opacity-0 border-white/10 pointer-events-none'}`}>
                         <div className="flex justify-between items-start mb-2">
                            <div>
                               <div className="text-[10px] text-neon-blue font-bold uppercase tracking-[0.2em] mb-1">Neural Briefing</div>
                               <h3 className="text-xl font-bold font-grotesk text-white">{selectedNode?.label}</h3>
                            </div>
                            <button onClick={() => setSelectedNode(null)} className="p-1 text-text-dim hover:text-white"><XCircle size={20}/></button>
                         </div>
                         <p className="text-sm text-text-dim leading-relaxed">{selectedNode?.desc}</p>
                         <div className="mt-4 flex gap-2">
                            <div className="px-3 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-[8px] font-bold text-neon-blue uppercase">Institutional Grade</div>
                            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] font-bold text-text-dim uppercase">Core Concept</div>
                         </div>
                      </div>

                      {!selectedNode && (
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
                           <Info size={14} className="text-neon-blue animate-pulse" />
                           <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim">Tap nodes to unlock neural insights</span>
                        </div>
                      )}
                   </div>
                </div>
             )}

             {/* Mistake Replay View */}
             {view === 'mistake' && mistake && (
                <div className="fade-in max-w-4xl mx-auto">
                   <div className="flex justify-between items-center mb-8">
                      <button onClick={() => setView('hub')} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all"><ChevronLeft size={24}/></button>
                      <h2 className="text-3xl font-bold font-grotesk tracking-tighter">BEHAVIORAL MISTAKE REPLAY</h2>
                      <div className="w-12" />
                   </div>

                   <div className="card glass-morphism-premium border-red-500/20 mb-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                         <span className="text-[10px] font-bold text-red-500 uppercase">Mistake Detected</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                         <div>
                            <div className="text-[10px] text-text-dim font-bold uppercase mb-2">Trade Context: {mistake.trade.symbol}</div>
                            <h3 className="text-xl font-bold mb-4 font-grotesk">Exited early at {mistake.trade.exit?.toFixed(2)}</h3>
                            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl mb-6">
                               <p className="text-sm italic leading-relaxed text-red-100">"{mistake.analysis}"</p>
                            </div>
                            <div className="flex gap-4">
                               <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex-1">
                                  <div className="text-[8px] text-text-dim uppercase mb-1">Emotion</div>
                                  <div className="font-bold text-red-400">FEAR</div>
                               </div>
                               <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex-1">
                                  <div className="text-[8px] text-text-dim uppercase mb-1">Loss vs Potential</div>
                                  <div className="font-bold text-red-400">-$420.00</div>
                               </div>
                            </div>
                         </div>
                         <div className="aspect-square bg-black/40 rounded-3xl border border-white/10 relative flex items-center justify-center">
                            <Activity size={64} className="text-red-500 animate-pulse" />
                            <div className="absolute bottom-6 text-[10px] font-bold text-text-dim tracking-widest">REPLAYING EMOTIONAL STATE...</div>
                         </div>
                      </div>
                   </div>
                </div>
             )}

             {/* Simulation Mode View */}
             {view === 'simulation' && scenarios.length > 0 && (
                <div className="fade-in">
                   <div className="flex justify-between items-center mb-8">
                      <button onClick={() => setView('hub')} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all"><ChevronLeft size={24}/></button>
                      <h2 className="text-3xl font-bold font-grotesk tracking-tighter">SIMULATION CHALLENGES</h2>
                      <div className="w-12" />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {scenarios.map((s, i) => (
                         <div key={i} className="card glass-morphism-premium border-white/10 hover:border-neon-blue/40 transition-all group cursor-pointer">
                            <div className="flex justify-between items-start mb-6">
                               <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-neon-blue group-hover:scale-110 transition-transform">
                                  <Zap size={24} />
                               </div>
                               <span className={`text-[8px] font-bold px-2 py-1 rounded-full ${s.difficulty === 'Extreme' ? 'bg-red-500/20 text-red-500' : 'bg-neon-orange/20 text-neon-orange'}`}>{s.difficulty}</span>
                            </div>
                            <h3 className="text-lg font-bold mb-2 font-grotesk">{s.title}</h3>
                            <p className="text-xs text-text-dim leading-relaxed mb-6">{s.description}</p>
                            <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-xs group-hover:bg-neon-blue group-hover:text-white transition-all">ENTER SIMULATION</button>
                         </div>
                      ))}
                   </div>
                </div>
             )}

         </div>

         {activeBookContent && (
                 <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col p-4 sm:p-8 fade-in">
                    <div className="w-full max-w-4xl mx-auto bg-[#121214] border border-white/10 rounded-3xl flex flex-col h-full overflow-hidden shadow-2xl">
                       {/* Modal Header */}
                       <div className="flex justify-between items-center p-6 border-b border-white/5 bg-black/20">
                          <div>
                             <span className="text-[10px] text-neon-blue font-bold uppercase tracking-widest block mb-1">TradeMind Mastery Guide</span>
                             <h3 className="font-bold text-base font-grotesk text-white">Interactive Lesson Book</h3>
                          </div>
                          <div className="flex gap-2">
                              <button 
                                 onClick={() => {
                                    const isMobileApp = typeof window !== 'undefined' && (
                                      window.Capacitor ||
                                      window.location.origin.startsWith('capacitor://') ||
                                      window.navigator.userAgent.includes('Android') ||
                                      window.navigator.userAgent.includes('iPhone') ||
                                      window.navigator.userAgent.includes('iPad')
                                    );

                                    if (isMobileApp) {
                                       let savedIp = localStorage.getItem('backend_ip');
                                       if (!savedIp || savedIp === '192.168.137.1') {
                                          savedIp = 'https://trademind-backend-vldj.onrender.com';
                                       }
                                       const savedPort = localStorage.getItem('backend_port') || '8000';
                                       const baseUrl = (savedIp.startsWith('http://') || savedIp.startsWith('https://'))
                                          ? savedIp
                                          : `http://${savedIp}:${savedPort}`;
                                          
                                       const lesson = lessons[lessonIndex]
                                       const downloadUrl = `${baseUrl}/academy/download-book?lesson_id=${lesson.id}&title=${encodeURIComponent(lesson.title)}`
                                       window.open(downloadUrl, '_system');
                                    } else {
                                       const blob = new Blob([activeBookContent], { type: 'text/html' })
                                       const url = window.URL.createObjectURL(blob)
                                       const a = document.createElement('a')
                                       a.href = url
                                       a.download = `TradeMind_Mastery_Guide.html`
                                       document.body.appendChild(a)
                                       a.click()
                                       document.body.removeChild(a)
                                       window.URL.revokeObjectURL(url)
                                    }
                                 }}
                                 className="px-4 py-2 bg-neon-blue hover:bg-neon-blue/80 text-white rounded-xl text-xs font-bold hover:scale-105 transition-transform"
                              >
                                 Download File
                              </button>
                             <button 
                                onClick={() => setActiveBookContent(null)}
                                className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-bold hover:bg-white/10 transition-colors"
                             >
                                Close
                             </button>
                          </div>
                       </div>
                       
                       {/* Modal Body (Iframe) */}
                       <div className="flex-1 bg-white p-2">
                          <iframe 
                             title="AI Book Content" 
                             srcDoc={activeBookContent} 
                             className="w-full h-full border-0 rounded-2xl bg-white"
                          />
                       </div>
                    </div>
                 </div>
              )}

          <style>{`
            @keyframes grow { from { width: 0; } }
            .animate-grow { animation: grow 1.5s ease-out forwards; }
         `}</style>
      </div>
   )
}
