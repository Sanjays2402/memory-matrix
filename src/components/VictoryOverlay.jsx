import { motion as Motion, AnimatePresence } from 'framer-motion'
import { formatTime } from '../gameLogic'

const CONFETTI_COLORS = ['#6366f1', '#a855f7', '#ec4899', '#fbbf24', '#34d399', '#f43f5e', '#38bdf8']

function seededValue(index, salt) {
  const value = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453
  return value - Math.floor(value)
}

function createConfetti(big) {
  const count = big ? 150 : 60
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    left: seededValue(index, 1) * 100,
    color: CONFETTI_COLORS[Math.floor(seededValue(index, 2) * CONFETTI_COLORS.length)],
    delay: seededValue(index, 3) * (big ? 1 : 2),
    duration: (big ? 1.5 : 2) + seededValue(index, 4) * 2,
    size: (big ? 8 : 6) + seededValue(index, 5) * (big ? 12 : 8),
    rotation: seededValue(index, 6) * 360,
  }))
}

function Confetti({ big }) {
  const pieces = createConfetti(big)

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 100 }}>
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.6,
            background: p.color,
            borderRadius: 2,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  )
}

export default function VictoryOverlay({ moves, time, stars, combo, newBest, pairs, hintUsed, isPerfect, gameOverReason, matchedCount, mode, onPlayAgain, onMenu }) {
  const isTimeout = gameOverReason === 'timeout'
  const showBigConfetti = isPerfect && !isTimeout

  return (
    <AnimatePresence>
      <Motion.div
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{
          zIndex: 50,
          background: 'rgba(10, 10, 15, 0.85)',
          backdropFilter: 'blur(12px)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {showBigConfetti && <Confetti big />}
        {!isTimeout && !showBigConfetti && <Confetti />}

        <Motion.div
          className="glass-light p-8 sm:p-10 max-w-sm w-full text-center"
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300, delay: 0.2 }}
          style={{ position: 'relative', zIndex: 51 }}
        >
          <div className="text-4xl mb-2">{isTimeout ? '⏰' : showBigConfetti ? '🎉' : '🏆'}</div>
          <h2 className="text-2xl font-bold mb-1" style={{
            background: isTimeout
              ? 'linear-gradient(135deg, #ef4444, #f97316)'
              : showBigConfetti
              ? 'linear-gradient(135deg, #a855f7, #ec4899, #fbbf24)'
              : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {isTimeout ? "Time's Up!" : showBigConfetti ? 'PERFECT! 🎊' : 'Victory!'}
          </h2>

          {showBigConfetti && (
            <Motion.div
              className="text-sm font-semibold mb-2"
              style={{ color: '#c084fc' }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
            >
              ✨ Zero mistakes — flawless memory! ✨
            </Motion.div>
          )}

          {newBest && (
            <Motion.div
              className="text-sm font-semibold mb-4"
              style={{ color: '#fbbf24' }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
            >
              ✨ New Best Score! ✨
            </Motion.div>
          )}

          {/* Stars - only in classic wins */}
          {!isTimeout && mode !== 'timed' && (
            <div className="flex justify-center gap-2 my-4">
              {[1, 2, 3].map(i => (
                <Motion.span
                  key={i}
                  className={`text-3xl ${i <= stars ? 'text-yellow-400' : 'text-white/20'}`}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3 + i * 0.15, type: 'spring', stiffness: 400 }}
                >
                  ★
                </Motion.span>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 my-6 text-sm">
            <div className="glass p-3 rounded-xl">
              <div style={{ color: 'rgba(255,255,255,0.5)' }}>Moves</div>
              <div className="text-xl font-bold">{moves}</div>
            </div>
            <div className="glass p-3 rounded-xl">
              <div style={{ color: 'rgba(255,255,255,0.5)' }}>{isTimeout ? 'Matched' : 'Time'}</div>
              <div className="text-xl font-bold">{isTimeout ? `${matchedCount}/${pairs}` : formatTime(time)}</div>
            </div>
            <div className="glass p-3 rounded-xl">
              <div style={{ color: 'rgba(255,255,255,0.5)' }}>Best Combo</div>
              <div className="text-xl font-bold">{combo}x</div>
            </div>
            <div className="glass p-3 rounded-xl">
              <div style={{ color: 'rgba(255,255,255,0.5)' }}>{mode === 'timed' ? 'Mode' : 'Pairs'}</div>
              <div className="text-xl font-bold">{mode === 'timed' ? '⏱️ Timed' : pairs}</div>
            </div>
          </div>

          {hintUsed && (
            <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
              💡 Hint was used this round
            </p>
          )}

          <div className="flex gap-3 justify-center">
            <button className="btn-glass" onClick={onPlayAgain}>
              🔄 Play Again
            </button>
            <button className="btn-glass" onClick={onMenu}>
              📋 Menu
            </button>
          </div>
        </Motion.div>
      </Motion.div>
    </AnimatePresence>
  )
}
