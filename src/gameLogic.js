import { PROGRAMMING_CARDS } from './programmingDeck'

// Card theme definitions
export const THEMES = {
  emoji: {
    name: 'Emoji',
    icon: '😀',
    color: '#fbbf24',
    cards: ['🎮', '🚀', '💎', '🔥', '⚡', '🌈', '🎵', '🎯', '🌟', '🎪', '🦄', '🍕', '🎭', '🌺', '🦋', '🎸', '🏆', '🎲', '🌙', '🎨', '💫', '🦊', '🌸', '🎹', '🐉', '🎀', '🦁', '🌍', '🎻', '🧩', '🦜', '🍄'],
  },
  programming: {
    name: 'Programming',
    icon: '⌘',
    color: '#61dafb',
    cards: PROGRAMMING_CARDS,
    imageDeck: true,
  },
  space: {
    name: 'Space',
    icon: '🪐',
    color: '#a855f7',
    cards: ['🌍', '🌕', '☀️', '⭐', '🌙', '🪐', '☄️', '🌌', '🔭', '🚀', '👽', '🛸', '🌑', '💫', '🌠', '✨', '🛰️', '🌗', '🌘', '🌖', '🌓', '🌔', '🌒', '🌏', '🌎', '🪨', '💥', '🌞', '🌜', '🌛', '🌟', '🌃'],
  },
  animals: {
    name: 'Animals',
    icon: '🦊',
    color: '#f43f5e',
    cards: ['🦊', '🐼', '🦁', '🐯', '🐺', '🦄', '🐸', '🦋', '🐙', '🦜', '🐬', '🦈', '🐘', '🦒', '🐧', '🦉', '🐝', '🐢', '🐍', '🦅', '🐳', '🦩', '🐆', '🦔', '🐨', '🐹', '🦭', '🦫', '🐊', '🦚', '🐪', '🐻'],
  },
  numbers: {
    name: 'Numbers',
    icon: '🔢',
    color: '#14b8a6',
    cards: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32'],
    isText: true,
  },
}

export const DIFFICULTIES = {
  easy: { name: 'Easy', grid: 4, pairs: 8 },
  medium: { name: 'Medium', grid: 6, pairs: 18 },
  hard: { name: 'Hard', grid: 8, pairs: 32 },
}

// Star rating thresholds (based on moves relative to minimum possible)
export function getStarRating(moves, pairs) {
  const minMoves = pairs // Minimum is one flip per pair (already counting per-pair)
  const ratio = moves / minMoves
  if (ratio <= 1.5) return 3
  if (ratio <= 2.5) return 2
  return 1
}

// Shuffle using Fisher-Yates
export function shuffle(array, rng = Math.random) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// Generate cards for a game
export function generateCards(difficulty, theme, rng = Math.random) {
  const difficultyData = DIFFICULTIES[difficulty]
  if (!difficultyData) throw new Error(`Unknown difficulty: ${difficulty}`)

  const themeData = THEMES[theme]
  if (!themeData) throw new Error(`Unknown theme: ${theme}`)

  const { pairs } = difficultyData
  const selected = shuffle(themeData.cards, rng).slice(0, pairs)
  const cards = []

  selected.forEach((symbol, idx) => {
    const id = `card-${idx}`
    cards.push(
      { id: `${id}-a`, symbol, pairId: id, matched: false, flipped: false },
      { id: `${id}-b`, symbol, pairId: id, matched: false, flipped: false }
    )
  })

  return shuffle(cards, rng)
}

// Deterministic random source used by the daily puzzle. xmur3 hashes a
// human-readable seed; mulberry32 turns it into a repeatable [0, 1) sequence.
export function createSeededRng(seed) {
  let hash = 1779033703 ^ String(seed).length
  for (let index = 0; index < String(seed).length; index += 1) {
    hash = Math.imul(hash ^ String(seed).charCodeAt(index), 3432918353)
    hash = (hash << 13) | (hash >>> 19)
  }
  return () => {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507)
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909)
    const value = (hash ^= hash >>> 16) >>> 0
    let state = value + 0x6D2B79F5
    state = Math.imul(state ^ (state >>> 15), state | 1)
    state ^= state + Math.imul(state ^ (state >>> 7), state | 61)
    return ((state ^ (state >>> 14)) >>> 0) / 4294967296
  }
}

export function getDailyChallenge(date = new Date()) {
  const key = date.toISOString().slice(0, 10)
  const themeKeys = Object.keys(THEMES)
  const selector = createSeededRng(`memory-matrix-theme:${key}`)()
  const theme = themeKeys[Math.floor(selector * themeKeys.length)]
  return { key, seed: `memory-matrix:${key}:${theme}`, difficulty: 'medium', theme }
}

const DAILY_STORAGE_KEY = 'memory-matrix-daily'

export function getDailyProgress() {
  try {
    const parsed = JSON.parse(localStorage.getItem(DAILY_STORAGE_KEY))
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid progress')
    return {
      lastCompleted: typeof parsed.lastCompleted === 'string' ? parsed.lastCompleted : null,
      streak: Number.isFinite(parsed.streak) ? Math.max(0, parsed.streak) : 0,
      results: parsed.results && typeof parsed.results === 'object' && !Array.isArray(parsed.results) ? parsed.results : {},
    }
  } catch {
    return { lastCompleted: null, streak: 0, results: {} }
  }
}

function daysBetween(first, second) {
  const start = Date.parse(`${first}T00:00:00Z`)
  const end = Date.parse(`${second}T00:00:00Z`)
  return Number.isFinite(start) && Number.isFinite(end) ? Math.round((end - start) / 86400000) : Infinity
}

export function completeDailyChallenge(key, result) {
  const progress = getDailyProgress()
  const sameDay = progress.lastCompleted === key
  const olderDay = Boolean(progress.lastCompleted && key < progress.lastCompleted)
  const nextStreak = sameDay || olderDay
    ? progress.streak
    : daysBetween(progress.lastCompleted, key) === 1
      ? progress.streak + 1
      : 1
  const existing = progress.results[key]
  const better = !existing || result.score > existing.score || (result.score === existing.score && result.moves < existing.moves)
  const next = {
    lastCompleted: olderDay ? progress.lastCompleted : key,
    streak: nextStreak,
    results: { ...progress.results, [key]: better ? result : existing },
  }
  try { localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(next)) } catch { /* persistence is optional */ }
  return next
}

// Local storage helpers
const STORAGE_KEY = 'memory-matrix-scores'

export function getBestScores() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {}
  } catch {
    return {}
  }
}

export function getBestScore(difficulty, theme, mode = 'classic') {
  const scores = getBestScores()
  const current = scores[`${mode}-${difficulty}-${theme}`]
  if (current && typeof current === 'object' && !Array.isArray(current)) return current
  const legacy = mode === 'classic' ? scores[`${difficulty}-${theme}`] : null
  return legacy && typeof legacy === 'object' && !Array.isArray(legacy) ? legacy : null
}

export function saveBestScore(difficulty, theme, score, mode = 'classic') {
  const scores = getBestScores()
  const key = `${mode}-${difficulty}-${theme}`
  const existing = scores[key]
  const existingIsValid = existing
    && typeof existing === 'object'
    && Number.isFinite(existing.moves)
    && Number.isFinite(existing.time)
  const timedScoreIsValid = mode !== 'timed' || (Number.isFinite(score.score) && (!existingIsValid || Number.isFinite(existing.score)))
  const isBetter = !existingIsValid
    || (mode === 'timed'
      ? timedScoreIsValid && (score.score > existing.score || (score.score === existing.score && score.time > existing.time))
      : score.moves < existing.moves || (score.moves === existing.moves && score.time < existing.time))

  if (isBetter) {
    try {
      scores[key] = score
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scores))
      return true // New best
    } catch {
      return false
    }
  }
  return false
}

// Reward a match with an escalating streak bonus. Using a focus peek halves
// future rewards for the round, keeping it useful without making scores free.
export function calculateMatchReward(combo, hintUsed = false) {
  const streak = Number.isFinite(combo) ? Math.max(1, Math.floor(combo)) : 1
  const base = 100
  const streakBonus = 25 * streak * (streak - 1)
  const reward = Math.min(1250, base * streak + streakBonus)
  return hintUsed ? Math.round(reward / 2) : reward
}

export function getTimedBonus(difficulty) {
  return { easy: 2, medium: 3, hard: 4 }[difficulty] || 0
}

// Format time
export function formatTime(seconds) {
  const normalized = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0
  const m = Math.floor(normalized / 60)
  const s = normalized % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
