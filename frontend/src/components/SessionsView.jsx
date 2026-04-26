import { useState, useEffect } from 'react'
import { PageWrapper, Card, Btn, SectionHeader, EmptyState } from './UI.jsx'

export default function SessionsView() {
  const [sessions, setSessions] = useState([])
  const [form, setForm] = useState({ name:'', target:'', platform:'both', notes:'' })
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { loadSessions() }, [])

  const loadSessions = async () => {
    try {
      const res = await fetch('/api/sessions')
      const data = await res.json()
      setSessions(data.sessions || [])
    } catch {
      setSessions([])
    }
  }

  const createSession = async () => {
    setCreating(true)
    try {
      const res = await fetch('/api/sessions', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(form),
      })
      const s = await res.json()
      setSessions(prev => [s, ...prev])
      setForm({ name:'', target:'', platform:'both', notes:'' })
      setShowForm(false)
    } catch {
      const mock = { id: Math.random().toString(36).slice(2,8), ...form, created_at: new Date().toISOString(), logs:[], status:'active' }
      setSessions(prev => [mock, ...prev])
      setShowForm(false)
    }
    setCreating(false)
  }

  const closeSession = async (id) => {
    try { await fetch(`/api/sessions/${id}`, { method:'DELETE' }) } catch {}
    setSessions(prev => prev.map(s => s.id === id ? {...s, status:'closed'} : s))
  }

  return (
    <PageWrapper title="◷ Sessions" subtitle="Track engagement sessions and execution history">
      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:16 }}>
        <Btn onClick={() => setShowForm(s => !s)} color='var(--accent-green)' variant='solid' style={{ padding:'8px 20px' }}>
          + New Session
        </Btn>
      </div>

      {showForm && (
        <Card accent='var(--accent-green)' style={{ marginBottom:20, animation:'fade-in 0.2s ease' }}>
          <SectionHeader color='var(--accent-green)'>New Session</SectionHeader>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
            <div>
              <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:4, fontFamily:'var(--font-mono)' }}>SESSION NAME *</div>
              <input value={form.name} onChange={e => setForm(f => ({...f, name:e.target.value}))} placeholder="e.g. Android App Pentest — ClientX" />
            </div>
            <div>
              <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:4, fontFamily:'var(--font-mono)' }}>TARGET</div>
              <input value={form.target} onChange={e => setForm(f => ({...f, target:e.target.value}))} placeholder="e.g. com.target.app / 192.168.1.1" />
            </div>
          </div>
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:4, fontFamily:'var(--font-mono)' }}>PLATFORM</div>
            <div style={{ display:'flex', gap:6 }}>
              {['android','ios','both'].map(p => (
                <Btn key={p} onClick={() => setForm(f => ({...f, platform:p}))}
                  color={form.platform === p ? 'var(--accent-blue)' : 'var(--text-muted)'}
                  style={{ padding:'6px 16px' }}>
                  {p}
                </Btn>
              ))}
            </div>
          </div>
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:4, fontFamily:'var(--font-mono)' }}>NOTES</div>
            <textarea value={form.notes} onChange={e => setForm(f => ({...f, notes:e.target.value}))} rows={2} placeholder="Scope, objectives, notes…" style={{ resize:'vertical' }} />
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <Btn onClick={createSession} disabled={!form.name || creating} color='var(--accent-green)' variant='solid' style={{ padding:'8px 20px' }}>
              {creating ? 'Creating…' : 'Create Session'}
            </Btn>
            <Btn onClick={() => setShowForm(false)} color='var(--text-muted)'>Cancel</Btn>
          </div>
        </Card>
      )}

      {sessions.length === 0
        ? <EmptyState icon='◷' message='No sessions yet' sub='Create a session to start tracking your engagements' />
        : sessions.map(s => (
          <Card key={s.id} accent={s.status === 'active' ? 'var(--accent-green)' : 'var(--border)'} style={{ marginBottom:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:14, color:'var(--text-primary)' }}>{s.name}</span>
                  <span style={{
                    fontSize:10, fontFamily:'var(--font-mono)',
                    background: s.status === 'active' ? 'var(--accent-green)18' : 'var(--border)',
                    color: s.status === 'active' ? 'var(--accent-green)' : 'var(--text-muted)',
                    padding:'2px 8px', borderRadius:3,
                  }}>{s.status?.toUpperCase()}</span>
                </div>
                <div style={{ fontSize:12, color:'var(--text-muted)' }}>
                  {s.target && <span style={{ marginRight:14 }}>Target: <span style={{ color:'var(--text-secondary)' }}>{s.target}</span></span>}
                  <span style={{ marginRight:14 }}>Platform: <span style={{ color:'var(--text-secondary)' }}>{s.platform}</span></span>
                  <span>ID: <span style={{ fontFamily:'var(--font-mono)', color:'var(--text-muted)' }}>{s.id}</span></span>
                </div>
                {s.notes && <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:4 }}>{s.notes}</div>}
              </div>
              <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                <span style={{ fontSize:11, color:'var(--text-muted)' }}>{s.logs?.length || 0} logs</span>
                {s.status === 'active' && (
                  <Btn onClick={() => closeSession(s.id)} color='var(--accent-orange)'>Close</Btn>
                )}
              </div>
            </div>
          </Card>
        ))
      }
    </PageWrapper>
  )
}
