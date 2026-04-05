import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatTime, getStarRating } from '../gameLogic'

function Confetti() {
  const pieces = useMemo(() => {
    const colors = ['#6366f1', '#a855f7', '#ec4899', '#fbbf24', '#34d399', '#f43f5e', '#38bdf8']
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
    }))
  }, [])

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

export default function VictoryOverlay({ moves, time, stars, combo, newBest, pairs, hintUsed, onPlayAgain, onMenu }) {
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
        <Confetti />

        <motion.div
          className="glass-light p-8 sm:p-10 max-w-sm w-full text-center"
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300, delay: 0.2 }}
          style={{ position: 'relative', zIndex: 51 }}
        >
          <div className="text-4xl mb-2">🏆</div>
          <h2 className="text-2xl font-bold mb-1" style={{
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Victory!
          </h2>

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

          {/* Stars */}
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

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 my-6 text-sm">
            <div className="glass p-3 rounded-xl">
              <div style={{ color: 'rgba(255,255,255,0.5)' }}>Moves</div>
              <div className="text-xl font-bold">{moves}</div>
            </div>
            <div className="glass p-3 rounded-xl">
              <div style={{ color: 'rgba(255,255,255,0.5)' }}>Time</div>
              <div className="text-xl font-bold">{formatTime(time)}</div>
            </div>
            <div className="glass p-3 rounded-xl">
              <div style={{ color: 'rgba(255,255,255,0.5)' }}>Best Combo</div>
              <div className="text-xl font-bold">{combo}x</div>
            </div>
            <div className="glass p-3 rounded-xl">
              <div style={{ color: 'rgba(255,255,255,0.5)' }}>Pairs</div>
              <div className="text-xl font-bold">{pairs}</div>
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
