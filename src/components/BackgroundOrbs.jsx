export default function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <div
        className="orb-1 absolute rounded-full"
        style={{
          width: 600,
          height: 600,
          top: '10%',
          left: '20%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="orb-2 absolute rounded-full"
        style={{
          width: 500,
          height: 500,
          top: '50%',
          right: '10%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="orb-3 absolute rounded-full"
        style={{
          width: 450,
          height: 450,
          bottom: '10%',
          left: '40%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
    </div>
  )
}
