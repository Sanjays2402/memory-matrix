import { formatTime, DIFFICULTIES, THEMES } from '../gameLogic'
import { Icon } from './Icons'

export default function Header({ moves, time, stars, combo, score, lastReward, soundOn, setSoundOn, hintUsed, onHint, mode, dailyStreak, peeking, difficulty, theme, matchedCount }) {
  const isTimedLow = mode === 'timed' && time <= 10
  const pairs = DIFFICULTIES[difficulty].pairs
  const progress = pairs ? Math.round((matchedCount / pairs) * 100) : 0

  return (
    <section className="game-hud" aria-label="Game status">
      <div className="round-context">
        <span className="round-kicker">{mode === 'timed' ? 'Time attack' : mode === 'daily' ? `Daily challenge · ${dailyStreak || 0} day streak` : 'Classic round'}</span>
        <strong>{DIFFICULTIES[difficulty].name} · {THEMES[theme].name}</strong>
      </div>

      <div className="progress-block">
        <div className="progress-copy"><span>{peeking ? 'Memorize the board' : 'Pairs found'}</span><strong>{matchedCount} / {pairs}</strong></div>
        <div className="progress-track"><span style={{ width: peeking ? '100%' : `${progress}%` }} /></div>
      </div>

      <div className="stat-row">
        <div className="hud-stat score-stat"><span><small>Score</small><strong>{score.toLocaleString()}</strong></span></div>
        <div className="hud-stat"><Icon name="moves" /><span><small>Moves</small><strong>{moves}</strong></span></div>
        <div className={`hud-stat ${isTimedLow ? 'danger' : ''}`}><Icon name="timer" /><span><small>{mode === 'timed' ? 'Remaining' : 'Time'}</small><strong>{formatTime(time)}</strong></span></div>
        {mode !== 'timed' && <div className="hud-stat star-stat" aria-label={`${stars} of 3 stars`}><span><small>Rating</small><strong>{[1,2,3].map(i => <b key={i} className={i <= stars ? 'filled' : ''}>★</b>)}</strong></span></div>}
        {combo >= 2 && <div className="hud-stat combo-stat"><Icon name="flame" /><span><small>Streak</small><strong>{combo}×</strong></span></div>}
      </div>

      {lastReward && (
        <div key={lastReward.id} className="reward-pop" role="status">
          <strong>+{lastReward.points}</strong>
          <span>{lastReward.combo >= 2 ? `${lastReward.combo}× streak` : 'Match!'}</span>
          {lastReward.timeBonus > 0 && <b>+{lastReward.timeBonus}s</b>}
        </div>
      )}

      <div className="hud-actions">
        <button type="button" className="text-action" onClick={onHint} disabled={hintUsed || peeking} title={hintUsed ? 'Focus peek already used' : 'Reveal all cards for one second'}>
          <Icon name="sparkles" /><span>{hintUsed ? 'Peek used' : 'Focus peek'}</span>
        </button>
        <button type="button" className="icon-action" onClick={() => setSoundOn(!soundOn)} aria-label={soundOn ? 'Mute sounds' : 'Enable sounds'} title={soundOn ? 'Mute sounds' : 'Enable sounds'}>
          <Icon name={soundOn ? 'volume' : 'volumeOff'} />
        </button>
      </div>
    </section>
  )
}
