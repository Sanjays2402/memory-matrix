import { formatTime } from '../gameLogic'

export default function Header({ moves, time, stars, combo, soundOn, setSoundOn, hintUsed, onHint, mode, peeking }) {
  const isTimedLow = mode === 'timed' && time <= 10

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
      {/* Peeking indicator */}
      {peeking && (
        <div className="stat-pill" style={{ background: 'rgba(168,85,247,0.2)', border: '1px solid rgba(168,85,247,0.5)' }}>
          <span>👀</span>
          <span style={{ color: '#c084fc' }}>Memorize!</span>
        </div>
      )}

      {/* Moves */}
      <div className="stat-pill">
        <span style={{ opacity: 0.6 }}>🎯</span>
        <span>{moves} moves</span>
      </div>

      {/* Timer */}
      <div className={`stat-pill ${isTimedLow ? 'timer-warning' : ''}`} style={
        mode === 'timed' ? {
          border: `1px solid ${isTimedLow ? 'rgba(239,68,68,0.6)' : 'rgba(239,68,68,0.3)'}`,
          background: isTimedLow ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.05)',
        } : {}
      }>
        <span style={{ opacity: 0.6 }}>{mode === 'timed' ? '⏱️' : '⏱️'}</span>
        <span style={isTimedLow ? { color: '#f87171', fontWeight: 700 } : {}}>{formatTime(time)}</span>
      </div>

      {/* Stars (only in classic mode) */}
      {mode !== 'timed' && (
        <div className="stat-pill">
          {[1, 2, 3].map(i => (
            <span key={i} className={`star ${i <= stars ? 'filled' : ''}`}>★</span>
          ))}
        </div>
      )}

      {/* Combo */}
      {combo >= 2 && (
        <div className="combo-badge">
          🔥 {combo}x Combo!
        </div>
      )}

      {/* Hint */}
      <button
        className={`btn-glass ${hintUsed ? 'opacity-40 cursor-not-allowed' : ''}`}
        onClick={onHint}
        disabled={hintUsed}
        title={hintUsed ? 'Hint already used' : 'Peek at all cards (1s)'}
      >
        💡 Hint
      </button>

      {/* Sound */}
      <button
        className="btn-glass"
        onClick={() => setSoundOn(!soundOn)}
        title={soundOn ? 'Mute sounds' : 'Enable sounds'}
      >
        {soundOn ? '🔊' : '🔇'}
      </button>
    </div>
  )
}
