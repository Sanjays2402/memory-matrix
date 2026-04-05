import { formatTime } from '../gameLogic'

export default function Header({ moves, time, stars, combo, soundOn, setSoundOn, hintUsed, onHint }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
      {/* Moves */}
      <div className="stat-pill">
        <span style={{ opacity: 0.6 }}>🎯</span>
        <span>{moves} moves</span>
      </div>

      {/* Timer */}
      <div className="stat-pill">
        <span style={{ opacity: 0.6 }}>⏱️</span>
        <span>{formatTime(time)}</span>
      </div>

      {/* Stars */}
      <div className="stat-pill">
        {[1, 2, 3].map(i => (
          <span key={i} className={`star ${i <= stars ? 'filled' : ''}`}>★</span>
        ))}
      </div>

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
