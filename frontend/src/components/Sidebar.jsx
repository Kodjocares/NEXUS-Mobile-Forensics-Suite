const NAV = [
  { id:'dashboard', icon:'◉', label:'Dashboard' },
  { id:'tools',     icon:'⚙', label:'Tools' },
  { id:'presets',   icon:'⬡', label:'Presets' },
  { id:'terminal',  icon:'▶', label:'Terminal' },
  { id:'ai',        icon:'◈', label:'AI Assistant' },
  { id:'sessions',  icon:'◷', label:'Sessions' },
]

export default function Sidebar({ page, onNavigate, open, onToggle }) {
  return (
    <aside style={{
      position:'fixed', left:0, top:0, height:'100vh', zIndex:100,
      width: open ? 220 : 60,
      background:'var(--bg-surface)',
      borderRight:'1px solid var(--border)',
      display:'flex', flexDirection:'column',
      transition:'width 0.2s ease',
      overflow:'hidden',
    }}>
      {/* Logo */}
      <div style={{
        padding: open ? '20px 18px 16px' : '20px 0 16px',
        borderBottom:'1px solid var(--border)',
        display:'flex', alignItems:'center', gap:10,
        justifyContent: open ? 'space-between' : 'center',
      }}>
        {open && (
          <div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:13, fontWeight:700, color:'var(--accent-green)', letterSpacing:2 }}>NEXUS</div>
            <div style={{ fontSize:10, color:'var(--text-muted)', letterSpacing:1 }}>MOBILE FORENSICS</div>
          </div>
        )}
        <button onClick={onToggle} style={{
          background:'transparent', border:'1px solid var(--border)',
          color:'var(--text-secondary)', borderRadius:4, width:28, height:28,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:12, flexShrink:0,
        }}>
          {open ? '◁' : '▷'}
        </button>
      </div>

      {/* Nav items */}
      <nav style={{ flex:1, padding:'10px 0', overflowY:'auto' }}>
        {NAV.map(n => {
          const active = page === n.id
          return (
            <button key={n.id} onClick={() => onNavigate(n.id)} title={!open ? n.label : ''} style={{
              width:'100%', display:'flex', alignItems:'center',
              gap:10, padding: open ? '10px 18px' : '10px 0',
              justifyContent: open ? 'flex-start' : 'center',
              background: active ? 'var(--accent-green)18' : 'transparent',
              border:'none', borderLeft: active ? '2px solid var(--accent-green)' : '2px solid transparent',
              color: active ? 'var(--accent-green)' : 'var(--text-secondary)',
              fontFamily:'var(--font-mono)', fontSize:12, letterSpacing:1,
              transition:'all 0.15s', cursor:'pointer',
            }}>
              <span style={{ fontSize:16, flexShrink:0 }}>{n.icon}</span>
              {open && <span>{n.label.toUpperCase()}</span>}
            </button>
          )
        })}
      </nav>

      {/* Status dot */}
      <div style={{
        padding: open ? '14px 18px' : '14px 0',
        borderTop:'1px solid var(--border)',
        display:'flex', alignItems:'center', gap:8,
        justifyContent: open ? 'flex-start' : 'center',
      }}>
        <div style={{
          width:8, height:8, borderRadius:'50%',
          background:'var(--accent-green)',
          boxShadow:'0 0 8px var(--accent-green)',
          animation:'pulse-dot 2s infinite',
          flexShrink:0,
        }} />
        {open && <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--accent-green)', letterSpacing:1 }}>ONLINE</span>}
      </div>
    </aside>
  )
}
