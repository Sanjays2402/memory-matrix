import { motion as Motion, AnimatePresence } from 'framer-motion'
import { formatTime } from '../gameLogic'
import { Icon } from './Icons'

const COLORS = {
  emoji: ['#d8ff4f', '#7dd3fc', '#f9a8d4', '#fef08a', '#86efac'],
  programming: ['#61dafb', '#f7df1e', '#7f52ff', '#ff3e00', '#4fc08d'],
  space: ['#a855f7', '#60a5fa', '#f8fafc', '#fbbf24', '#c084fc'],
  animals: ['#fb923c', '#86efac', '#fcd34d', '#f9a8d4', '#a7f3d0'],
  numbers: ['#14b8a6', '#67e8f9', '#d8ff4f', '#f0fdfa', '#5eead4'],
}
function seededValue(index, salt) { const value = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453; return value - Math.floor(value) }
function Confetti({ big, theme }) {
  const count = big ? 100 : 45
  const colors = COLORS[theme] || COLORS.emoji
  return <div className="confetti-field" aria-hidden="true">{Array.from({ length: count }, (_, index) => <i key={index} style={{ left: `${seededValue(index, 1) * 100}%`, background: colors[Math.floor(seededValue(index, 2) * colors.length)], animationDelay: `${seededValue(index, 3) * 1.5}s`, animationDuration: `${1.8 + seededValue(index, 4) * 1.8}s` }} />)}</div>
}

export default function VictoryOverlay({ moves, time, stars, combo, score, newBest, pairs, hintUsed, isPerfect, gameOverReason, matchedCount, mode, theme, dailyStreak, onPlayAgain, onMenu }) {
  const isTimeout = gameOverReason === 'timeout'
  return (
    <AnimatePresence>
      <Motion.div className={`result-overlay result-theme-${theme}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        {!isTimeout && <Confetti big={isPerfect} theme={theme} />}
        <Motion.section className="result-card" role="dialog" aria-modal="true" aria-labelledby="result-title" initial={{ scale: .94, opacity: 0, y: 18 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 24, stiffness: 300, delay: .12 }}>
          <div className={`result-emblem ${isTimeout ? 'timeout' : ''}`}><Icon name={isTimeout ? 'timer' : 'trophy'} size={28} /></div>
          <span className="result-kicker">{isTimeout ? 'Round complete' : mode === 'daily' ? 'Daily challenge complete' : newBest ? 'New personal best' : 'Board cleared'}</span>
          <h2 id="result-title">{isTimeout ? "Time's up." : mode === 'daily' ? `${dailyStreak} day streak.` : isPerfect ? 'Flawless memory.' : 'Nicely matched.'}</h2>
          <p>{isTimeout ? `You found ${matchedCount} of ${pairs} pairs. Ready for another run?` : mode === 'daily' ? 'Today’s shared puzzle is in the books. Come back tomorrow to keep the streak alive.' : isPerfect ? 'Zero mistakes. Every card, exactly where you remembered it.' : 'A sharper memory, one pair at a time.'}</p>

          {!isTimeout && mode !== 'timed' && <div className="result-stars" aria-label={`${stars} out of 3 stars`}>{[1,2,3].map(i => <span key={i} className={i <= stars ? 'filled' : ''}>★</span>)}</div>}

          <div className="result-score"><small>Final score</small><strong>{score.toLocaleString()}</strong><span>points</span></div>

          <div className="result-stats">
            <div><small>Moves</small><strong>{moves}</strong></div>
            <div><small>{isTimeout ? 'Matched' : 'Time'}</small><strong>{isTimeout ? `${matchedCount}/${pairs}` : formatTime(time)}</strong></div>
            <div><small>Best streak</small><strong>{combo}×</strong></div>
          </div>

          {hintUsed && <span className="hint-note"><Icon name="sparkles" size={14} /> Focus peek used</span>}

          <div className="result-actions">
            <button className="primary-action" type="button" onClick={onPlayAgain}><span><Icon name="rotate" /> Play again</span><Icon name="chevronRight" /></button>
            <button className="secondary-action" type="button" onClick={onMenu}>Change setup</button>
          </div>
        </Motion.section>
      </Motion.div>
    </AnimatePresence>
  )
}
