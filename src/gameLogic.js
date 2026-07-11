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
    icon: '💻',
    color: '#6366f1',
    cards: ['JS', 'PY', 'RS', 'GO', 'TS', 'RB', 'C#', 'C+', 'SW', 'KT', 'LU', 'PH', 'JV', 'HS', 'EX', 'DA', 'R', 'SC', 'ZG', 'NM', 'CR', 'JL', 'EL', 'CL', 'PL', 'ML', 'VB', 'AS', 'OC', 'F#', 'TC', 'VL'],
    colors: ['#f7df1e', '#3776ab', '#ff4500', '#00add8', '#3178c6', '#cc342d', '#68217a', '#00599c', '#fa7343', '#7f52ff', '#000080', '#777bb4', '#ed8b00', '#5e5086', '#6e4a7e', '#00b4ab', '#276dc3', '#dc322f', '#f69a1b', '#16aa72', '#000', '#9558b2', '#6e4a7e', '#3f85a4', '#39457e', '#e37933', '#68217a', '#b3430c', '#438eff', '#b845fc', '#ef4223', '#4e56a6'],
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
export function generateCards(difficulty, theme) {
  const { pairs } = DIFFICULTIES[difficulty]
  const themeData = THEMES[theme]
  const selected = shuffle(themeData.cards).slice(0, pairs)
  const cards = []

  selected.forEach((symbol, idx) => {
    const id = `card-${idx}`
    cards.push(
      { id: `${id}-a`, symbol, pairId: id, matched: false, flipped: false },
      { id: `${id}-b`, symbol, pairId: id, matched: false, flipped: false }
    )
  })

  return shuffle(cards)
}

// Local storage helpers
const STORAGE_KEY = 'memory-matrix-scores'

export function getBestScores() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

export function saveBestScore(difficulty, theme, score) {
  const scores = getBestScores()
  const key = `${difficulty}-${theme}`
  const existing = scores[key]

  if (!existing || score.moves < existing.moves || (score.moves === existing.moves && score.time < existing.time)) {
    scores[key] = score
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores))
    return true // New best
  }
  return false
}

// Format time
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
