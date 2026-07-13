import { useMemo, useState } from 'react'
import { THEMES, DIFFICULTIES, formatTime, getBestScores } from '../gameLogic'
import { Icon } from './Icons'

const MODES = {
  classic: { label: 'Classic', description: 'Relaxed play', meta: 'No time limit' },
  timed: { label: 'Time attack', description: 'Beat the clock', meta: '60 seconds' },
}

export default function Menu({ difficulty, theme, onDifficultyChange, onThemeChange, onStart }) {
  const [mode, setMode] = useState('classic')
  const score = useMemo(() => getBestScores()[`${difficulty}-${theme}`], [difficulty, theme])
  const config = DIFFICULTIES[difficulty]
  const themeData = THEMES[theme]
  const previewSymbols = themeData.cards.slice(0, 6)
  const renderPreviewSymbol = (symbol) => themeData.imageDeck ? (
    <span className="preview-technology" style={{ '--preview-accent': symbol.color }}>
      <img src={symbol.image} alt="" draggable="false" />
      <small>{symbol.name}</small>
    </span>
  ) : theme === 'numbers' ? <strong>{symbol}</strong> : symbol

  return (
    <main className="menu-shell">
      <nav className="menu-nav" aria-label="Main navigation">
        <a className="brand" href="./" aria-label="Memory Matrix home">
          <span className="brand-mark"><i /><i /><i /><i /></span>
          <span>Memory Matrix</span>
        </a>
        <a className="nav-link" href="https://github.com/Sanjays2402/memory-matrix" target="_blank" rel="noreferrer">
          View source <span aria-hidden="true">↗</span>
        </a>
      </nav>

      <div className="menu-layout">
        <section className="menu-intro" aria-labelledby="game-title">
          <div className="eyebrow"><span /> A daily workout for your memory</div>
          <h1 id="game-title">Find the pairs.<br /><em>Train your focus.</em></h1>
          <p>Flip, remember, and match every card. Choose your challenge, build a streak, and set a new personal best.</p>

          <div className={`preview-stage preview-stage-${theme}`} aria-hidden="true">
            <div className="preview-meta">
              <span>{themeData.name} deck</span>
              <span>{config.grid} × {config.grid}</span>
            </div>
            <div className="preview-cards">
              {previewSymbols.map((symbol, index) => (
                <div key={`${theme}-${typeof symbol === 'object' ? symbol.name : symbol}`} className={`preview-card preview-card-${index + 1}`}>
                  {renderPreviewSymbol(symbol)}
                </div>
              ))}
              <div className="preview-card preview-card-hidden"><span className="card-glyph">M</span></div>
            </div>
            <div className="preview-caption">
              <span><b>{config.pairs}</b> pairs</span>
              <span><b>{mode === 'timed' ? '60' : '∞'}</b> seconds</span>
              <span><b>{score?.moves ?? '—'}</b> best moves</span>
            </div>
          </div>
        </section>

        <section className="setup-panel" aria-labelledby="setup-title">
          <div className="setup-heading">
            <div>
              <span className="step-label">Game setup</span>
              <h2 id="setup-title">Make it yours</h2>
            </div>
            <span className="setup-index">01 / 03</span>
          </div>

          <fieldset className="control-group">
            <legend>Board size</legend>
            <div className="segment-control">
              {Object.entries(DIFFICULTIES).map(([key, value]) => (
                <button key={key} type="button" aria-pressed={difficulty === key} className={difficulty === key ? 'selected' : ''} onClick={() => onDifficultyChange(key)}>
                  <span>{value.name}</span><small>{value.grid}×{value.grid}</small>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="control-group">
            <legend>Card deck</legend>
            <div className="theme-grid">
              {Object.entries(THEMES).map(([key, value]) => (
                <button key={key} type="button" aria-pressed={theme === key} className={theme === key ? 'selected' : ''} onClick={() => onThemeChange(key)}>
                  <span className={`theme-icon ${value.imageDeck ? 'theme-icon-code' : ''}`}>{value.icon}</span>
                  <span>{value.name}</span>
                  {theme === key && <span className="selection-check"><Icon name="check" size={13} strokeWidth={2.5} /></span>}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="control-group">
            <legend>Game mode</legend>
            <div className="mode-list">
              {Object.entries(MODES).map(([key, value]) => (
                <button key={key} type="button" aria-pressed={mode === key} className={mode === key ? 'selected' : ''} onClick={() => setMode(key)}>
                  <span className="radio-dot" />
                  <span className="mode-copy"><strong>{value.label}</strong><small>{value.description}</small></span>
                  <span className="mode-meta">{value.meta}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <button className="primary-action" type="button" onClick={() => onStart(mode)}>
            <span><Icon name="play" size={18} /> Start game</span>
            <Icon name="chevronRight" size={19} />
          </button>

          <div className="personal-best" aria-live="polite">
            <Icon name="trophy" size={17} />
            {score ? (
              <span>Personal best: <strong>{score.moves} moves</strong> in {formatTime(score.time)}</span>
            ) : (
              <span>No score for this board yet — set the first.</span>
            )}
          </div>
        </section>
      </div>

      <footer className="menu-footer"><span>Designed for mouse, touch & keyboard</span><span>Scores stay on your device</span></footer>
    </main>
  )
}
