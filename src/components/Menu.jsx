import { THEMES, DIFFICULTIES } from '../gameLogic'

export default function Menu({ difficulty, theme, onDifficultyChange, onThemeChange, onStart }) {
  return (
    <div className="flex flex-col items-center gap-8 py-12 px-4" style={{ position: 'relative', zIndex: 1 }}>
      <div className="text-center mb-4">
        <h1 className="text-5xl font-bold mb-3" style={{
          background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Memory Matrix
        </h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Match pairs • Build combos • Beat your best
        </p>
      </div>

      {/* Difficulty */}
      <div className="glass p-6 w-full max-w-md">
        <h2 className="text-sm font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Difficulty
        </h2>
        <div className="flex gap-3">
          {Object.entries(DIFFICULTIES).map(([key, val]) => (
            <button
              key={key}
              className={`btn-glass flex-1 text-center ${difficulty === key ? 'active' : ''}`}
              onClick={() => onDifficultyChange(key)}
            >
              {val.name}
              <span className="block text-xs mt-1" style={{ opacity: 0.5 }}>{val.grid}×{val.grid}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div className="glass p-6 w-full max-w-md">
        <h2 className="text-sm font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Card Theme
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(THEMES).map(([key, val]) => (
            <button
              key={key}
              className={`btn-glass text-center ${theme === key ? 'active' : ''}`}
              onClick={() => onThemeChange(key)}
            >
              <span className="text-xl mr-2">{val.icon}</span>
              {val.name}
            </button>
          ))}
        </div>
      </div>

      {/* Game Mode */}
      <div className="flex gap-4 w-full max-w-md">
        <button
          className="btn-glass text-lg flex-1 py-4 font-semibold"
          onClick={() => onStart('classic')}
          style={{
            border: '1px solid rgba(99,102,241,0.5)',
            background: 'rgba(99,102,241,0.1)',
          }}
        >
          ▶ Classic
        </button>
        <button
          className="btn-glass text-lg flex-1 py-4 font-semibold"
          onClick={() => onStart('timed')}
          style={{
            border: '1px solid rgba(239,68,68,0.5)',
            background: 'rgba(239,68,68,0.1)',
          }}
        >
          ⏱️ Timed (60s)
        </button>
      </div>
    </div>
  )
}
