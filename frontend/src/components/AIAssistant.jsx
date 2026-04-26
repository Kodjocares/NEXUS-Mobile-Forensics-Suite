import { useState, useRef, useEffect } from 'react'
import { PageWrapper, Btn, LoadingDots, SectionHeader } from './UI.jsx'

const QUICK_PROMPTS = [
  'How do I bypass SSL pinning on Android?',
  'iOS forensic artifact locations cheatsheet',
  'Set up Frida on a jailbroken iPhone',
  'Extract WhatsApp data from Android backup',
  'Suricata rules for mobile traffic',
  'Bettercap BLE scanning commands',
  'Drozer attack surface analysis walkthrough',
  'FTK Imager vs dcfldd — which to use?',
]

const SYSTEM = `You are NEXUS AI — an expert embedded in a professional mobile pentesting and digital forensics platform.

Expertise: Android/iOS forensics, mobile app pentesting, IDS/IPS, disk cloning, network monitoring.
Tools: ADB, Frida, objection, MobSF, QARK, Drozer, Needle, iLEAPP, ALEAPP, Autopsy, Suricata, Snort, Zeek, Wazuh, Wireshark, Bettercap, mitmproxy, Burp Suite, Aircrack-ng, Kismet, OSQuery, Velociraptor, dcfldd, FTK Imager, Guymager, dc3dd, libimobiledevice, Andriller, Clonezilla.

Style: Concise, technical, expert-level. Use markdown code blocks with language tags for all commands. Flag ⚠️ risk for destructive ops. Add brief legal/ethical notes for high-risk operations only.`

function renderMessage(text) {
  const parts = text.split(/(```[\s\S]*?```)/g)
  return parts.map((part, i) => {
    if (part.startsWith('```')) {
      const firstLine = part.indexOf('\n')
      const lang = part.slice(3, firstLine).trim()
      const code = part.slice(firstLine + 1, -3).trim()
      return (
        <div key={i} style={{ position:'relative', margin:'10px 0' }}>
          {lang && <span style={{ position:'absolute', right:10, top:6, fontSize:10, fontFamily:'var(--font-mono)', color:'var(--text-muted)' }}>{lang}</span>}
          <pre style={{ paddingRight:60, fontSize:11 }}>{code}</pre>
          <button onClick={() => navigator.clipboard.writeText(code)} style={{
            position:'absolute', right:8, bottom:6,
            background:'transparent', border:'1px solid var(--border)',
            color:'var(--text-muted)', fontSize:10, fontFamily:'var(--font-mono)',
            padding:'2px 8px', borderRadius:3, cursor:'pointer',
          }}>copy</button>
        </div>
      )
    }
    // Inline markdown: **bold**, `code`, headers
    const html = part
      .replace(/^### (.+)$/gm, '<h3 style="color:var(--accent-blue);font-size:13px;margin:12px 0 6px;font-family:var(--font-mono)">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 style="color:var(--accent-green);font-size:14px;margin:14px 0 6px;font-family:var(--font-mono)">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 style="color:var(--text-primary);font-size:16px;margin:16px 0 8px;font-family:var(--font-mono)">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--text-primary)">$1</strong>')
      .replace(/`([^`]+)`/g, '<code style="background:var(--bg-elevated);color:var(--accent-green);padding:1px 5px;border-radius:3px;font-size:11px">$1</code>')
      .replace(/^- (.+)$/gm, '<div style="padding-left:12px;margin:2px 0">· $1</div>')
      .replace(/\n/g, '<br/>')
    return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />
  })
}

export default function AIAssistant({ initialTool, onClearTool }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages, loading])

  useEffect(() => {
    if (initialTool) {
      const prompt = `Explain how to use **${initialTool.name}** for mobile pentesting/forensics.\n\nInclude:\n1. Purpose and key use cases\n2. Installation\n3. Most important commands with explanations\n4. Pro tips and common gotchas\n5. Integration with other tools\n\nCommand reference: \`${initialTool.command}\``
      send(prompt)
      onClearTool?.()
    }
  }, [])

  const send = async (msg) => {
    const userMsg = { role:'user', content: msg }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ messages: newMessages, system: SYSTEM }),
      })
      const data = await res.json()
      setMessages(m => [...m, { role:'assistant', content: data.reply }])
    } catch {
      // Fallback when backend not running — still calls Claude via the artifact's API proxy
      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({
            model:'claude-sonnet-4-20250514',
            max_tokens:1000,
            system: SYSTEM,
            messages: newMessages,
          }),
        })
        const data = await res.json()
        const reply = data.content?.map(b => b.text||'').join('') || 'No response.'
        setMessages(m => [...m, { role:'assistant', content: reply }])
      } catch(e2) {
        setMessages(m => [...m, { role:'assistant', content:`⚠️ Could not reach AI: ${e2.message}\n\nMake sure ANTHROPIC_API_KEY is set in your .env file and the backend is running.` }])
      }
    }
    setLoading(false)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); input.trim() && send(input.trim()) }
  }

  return (
    <PageWrapper title="◈ NEXUS AI Assistant" subtitle="Powered by Claude — expert in mobile forensics, pentesting, and tool usage">
      {/* Quick prompts */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:16 }}>
        {QUICK_PROMPTS.map(q => (
          <Btn key={q} onClick={() => send(q)} color='var(--text-muted)' style={{ fontSize:11, padding:'4px 10px' }}>{q}</Btn>
        ))}
      </div>

      {/* Chat area */}
      <div style={{
        background:'var(--bg-surface)', border:'1px solid var(--border)',
        borderRadius:'var(--radius-lg)', display:'flex', flexDirection:'column',
        height:'calc(100vh - 280px)',
      }}>
        <div style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>
          {messages.length === 0 && (
            <div style={{ textAlign:'center', padding:'80px 20px', color:'var(--text-muted)' }}>
              <div style={{ fontSize:48, marginBottom:16, opacity:0.4 }}>◈</div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:14, color:'var(--text-secondary)', marginBottom:8 }}>NEXUS AI Online</div>
              <div style={{ fontSize:12 }}>Ask anything about mobile forensics, pentesting tools, commands, or techniques.</div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} style={{
              display:'flex', gap:12, marginBottom:20,
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              animation:'fade-in 0.25s ease',
            }}>
              <div style={{
                width:30, height:30, borderRadius:6, flexShrink:0,
                background: msg.role === 'user' ? 'var(--accent-blue)18' : 'var(--accent-green)18',
                border: `1px solid ${msg.role === 'user' ? 'var(--accent-blue)' : 'var(--accent-green)'}44`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:13,
              }}>{msg.role === 'user' ? '▶' : '◈'}</div>

              <div style={{
                background: msg.role === 'user' ? 'var(--accent-blue)0e' : 'var(--bg-elevated)',
                border:`1px solid ${msg.role === 'user' ? 'var(--accent-blue)22' : 'var(--border)'}`,
                borderRadius:'var(--radius-lg)', padding:'12px 16px',
                maxWidth:'82%', fontSize:13, lineHeight:1.8,
                color:'var(--text-secondary)',
              }}>
                {renderMessage(msg.content)}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display:'flex', gap:12, marginBottom:20, animation:'fade-in 0.2s ease' }}>
              <div style={{
                width:30, height:30, borderRadius:6,
                background:'var(--accent-green)18',
                border:'1px solid var(--accent-green)44',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:13,
              }}>◈</div>
              <div style={{
                background:'var(--bg-elevated)', border:'1px solid var(--border)',
                borderRadius:'var(--radius-lg)', padding:'14px 16px',
              }}>
                <LoadingDots />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div style={{ padding:'14px 16px', borderTop:'1px solid var(--border)', display:'flex', gap:10 }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about tools, techniques, commands, artifacts, bypass methods…  (Enter to send, Shift+Enter for new line)"
            rows={2}
            style={{ flex:1, resize:'none', lineHeight:1.5, padding:'10px 14px', borderRadius:'var(--radius)' }}
          />
          <Btn onClick={() => input.trim() && send(input.trim())}
            disabled={loading || !input.trim()}
            color='var(--accent-green)' variant='solid'
            style={{ padding:'0 20px', alignSelf:'stretch', minWidth:80 }}>
            {loading ? '⟳' : 'Send'}
          </Btn>
        </div>
      </div>
    </PageWrapper>
  )
}
