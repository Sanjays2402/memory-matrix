import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatTime, getStarRating } from '../gameLogic'

function Confetti({ big }) {
  const pieces = useMemo(() => {
    const colors = ['#6366f1', '#a855f7', '#ec4899', '#fbbf24', '#34d399', '#f43f5e', '#38bdf8']
    const count = big ? 150 : 60
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * (big ? 1 : 2),
      duration: (big ? 1.5 : 2) + Math.random() * 2,
      size: (big ? 8 : 6) + Math.random() * (big ? 12 : 8),
      rotation: Math.random() * 360,
    }))
  }, [big])

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
      <motion.div
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

        <motion.div
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
            <motion.div
              className="text-sm font-semibold mb-2"
              style={{ color: '#c084fc' }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
            >
              ✨ Zero mistakes — flawless memory! ✨
            </motion.div>
          )}

          {newBest && (
            <motion.div
              className="text-sm font-semibold mb-4"
              style={{ color: '#fbbf24' }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
            >
              ✨ New Best Score! ✨
            </motion.div>
          )}

          {/* Stars - only in classic wins */}
          {!isTimeout && mode !== 'timed' && (
            <div className="flex justify-center gap-2 my-4">
              {[1, 2, 3].map(i => (
                <motion.span
                  key={i}
                  className={`text-3xl ${i <= stars ? 'text-yellow-400' : 'text-white/20'}`}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3 + i * 0.15, type: 'spring', stiffness: 400 }}
                >
                  ★
                </motion.span>
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
