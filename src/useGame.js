import { useState, useCallback, useRef, useEffect } from 'react'
import { DIFFICULTIES, calculateMatchReward, completeDailyChallenge, createSeededRng, generateCards, getDailyChallenge, getDailyProgress, getStarRating, getTimedBonus, saveBestScore, formatTime } from './gameLogic'
import { playFlip, playMatch, playNoMatch, playCombo, playVictory, playHint } from './sounds'

export function useGame() {
  const [difficulty, setDifficulty] = useState('easy')
  const [theme, setTheme] = useState('emoji')
  const [mode, setMode] = useState('classic') // 'classic' | 'timed' | 'daily'
  const [dailyChallenge, setDailyChallenge] = useState(() => getDailyChallenge())
  const [dailyProgress, setDailyProgress] = useState(() => getDailyProgress())
  const [cards, setCards] = useState([])
  const [flippedIds, setFlippedIds] = useState([])
  const [matchedPairIds, setMatchedPairIds] = useState(new Set())
  const [moves, setMoves] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [time, setTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [gameOverReason, setGameOverReason] = useState('win') // 'win' | 'timeout'
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [score, setScore] = useState(0)
  const [lastReward, setLastReward] = useState(null)
  const [locked, setLocked] = useState(false)
  const [hintUsed, setHintUsed] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [soundOn, setSoundOn] = useState(true)
  const [newBest, setNewBest] = useState(false)
  const [shakeIds, setShakeIds] = useState(new Set())
  const [matchAnimIds, setMatchAnimIds] = useState(new Set())
  const [peeking, setPeeking] = useState(false)
  const [peekProgress, setPeekProgress] = useState(0) // 0 to 1 for staggered flip

  const timerRef = useRef(null)
  const pendingTimeouts = useRef(new Set())
  const totalPairs = useRef(0)
  const modeRef = useRef('classic')

  const schedule = useCallback((callback, delay) => {
    const id = setTimeout(() => {
      pendingTimeouts.current.delete(id)
      callback()
    }, delay)
    pendingTimeouts.current.add(id)
    return id
  }, [])

  const clearTimers = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = null
    pendingTimeouts.current.forEach(clearTimeout)
    pendingTimeouts.current.clear()
  }, [])

  const startGame = useCallback((diff, th, md) => {
    clearTimers()
    const m = md || mode
    const challenge = m === 'daily' ? getDailyChallenge() : null
    const d = challenge?.difficulty || diff || difficulty
    const t = challenge?.theme || th || theme
    if (challenge) setDailyChallenge(challenge)
    setDifficulty(d)
    setTheme(t)
    setMode(m)
    modeRef.current = m

    const newCards = generateCards(d, t, challenge ? createSeededRng(challenge.seed) : Math.random)
    totalPairs.current = newCards.length / 2

    setCards(newCards)
    setFlippedIds([])
    setMatchedPairIds(new Set())
    setMoves(0)
    setMistakes(0)
    setTime(m === 'timed' ? 60 : 0)
    setIsPlaying(true)
    setGameOver(false)
    setGameOverReason('win')
    setCombo(0)
    setMaxCombo(0)
    setScore(0)
    setLastReward(null)
    setLocked(true) // locked during peek
    setHintUsed(false)
    setShowHint(false)
    setNewBest(false)
    setShakeIds(new Set())
    setMatchAnimIds(new Set())

    // Card peek animation: show all face-up for 2s then stagger flip
    setPeeking(true)
    setPeekProgress(0)

    schedule(() => {
      setPeekProgress(1) // trigger staggered flip-back
      schedule(() => {
        setPeeking(false)
        setPeekProgress(0)
        setLocked(false)
      }, 800) // wait for stagger animation to finish
    }, 2000)

    // Start timer after peek finishes (2.8s)
    schedule(() => {
      if (m === 'timed') {
        timerRef.current = setInterval(() => {
          setTime(t => {
            if (t <= 1) {
              clearInterval(timerRef.current)
              return 0
            }
            return t - 1
          })
        }, 1000)
      } else {
        timerRef.current = setInterval(() => {
          setTime(t => t + 1)
        }, 1000)
      }
    }, 2800)
  }, [difficulty, theme, mode, clearTimers, schedule])

  const endGame = useCallback((currentMoves, currentTime, reason = 'win', currentScore = score) => {
    setGameOver(true)
    setGameOverReason(reason)
    setIsPlaying(false)
    clearTimers()

    if (reason === 'win') {
      const stars = getStarRating(currentMoves, totalPairs.current)
      const isBest = saveBestScore(difficulty, theme, {
        moves: currentMoves,
        time: currentTime,
        stars,
      })
      setNewBest(isBest)
      if (modeRef.current === 'daily') {
        const progress = completeDailyChallenge(dailyChallenge.key, {
          score: currentScore,
          moves: currentMoves,
          time: currentTime,
          stars,
        })
        setDailyProgress(progress)
      }
    }
    if (soundOn) playVictory()
  }, [difficulty, theme, soundOn, score, dailyChallenge.key, clearTimers])

  const flipCard = useCallback((cardId) => {
    if (locked || gameOver || showHint || peeking) return

    const card = cards.find(c => c.id === cardId)
    if (!card || card.matched || flippedIds.includes(cardId)) return

    if (soundOn) playFlip()

    const newFlipped = [...flippedIds, cardId]
    setFlippedIds(newFlipped)

    if (newFlipped.length === 2) {
      setLocked(true)
      const newMoves = moves + 1
      setMoves(newMoves)

      const [first, second] = newFlipped.map(id => cards.find(c => c.id === id))

      if (first.pairId === second.pairId) {
        // Match!
        const newCombo = combo + 1
        const points = calculateMatchReward(newCombo, hintUsed)
        const newScore = score + points
        const timeBonus = modeRef.current === 'timed' ? getTimedBonus(difficulty) : 0
        setCombo(newCombo)
        setScore(newScore)
        setLastReward({ id: Date.now(), points, timeBonus, combo: newCombo })
        if (timeBonus) setTime(current => current + timeBonus)
        if (newCombo > maxCombo) setMaxCombo(newCombo)
        if (soundOn) {
          if (newCombo >= 2) playCombo()
          else playMatch()
        }

        // Pulse animation
        setMatchAnimIds(new Set([first.id, second.id]))

        schedule(() => {
          const newMatched = new Set(matchedPairIds)
          newMatched.add(first.pairId)
          setMatchedPairIds(newMatched)
          setMatchAnimIds(new Set())
          setFlippedIds([])
          setLocked(false)

          // Check victory
          if (newMatched.size === totalPairs.current) {
            endGame(newMoves, time, 'win', newScore)
          }
        }, 800)
      } else {
        // No match
        setCombo(0)
        setLastReward(null)
        setMistakes(prev => prev + 1)
        if (soundOn) playNoMatch()

        setShakeIds(new Set([first.id, second.id]))

        schedule(() => {
          setFlippedIds([])
          setShakeIds(new Set())
          setLocked(false)
        }, 800)
      }
    }
  }, [cards, flippedIds, locked, gameOver, showHint, peeking, moves, combo, maxCombo, matchedPairIds, soundOn, time, endGame, hintUsed, difficulty, score, schedule])

  const useHintFn = useCallback(() => {
    if (hintUsed || !isPlaying || gameOver) return
    setHintUsed(true)
    setShowHint(true)
    setLocked(true)
    if (soundOn) playHint()

    schedule(() => {
      setShowHint(false)
      setLocked(false)
    }, 1000)
  }, [hintUsed, isPlaying, gameOver, soundOn, schedule])

  // Timed mode: end game when timer hits 0. Defer the state transition so
  // restarting/unmounting can cancel it before it commits a stale timeout.
  useEffect(() => {
    if (modeRef.current !== 'timed' || time !== 0 || !isPlaying || peeking) return undefined

    const timeoutId = setTimeout(() => endGame(moves, 0, 'timeout'), 0)
    return () => clearTimeout(timeoutId)
  }, [time, isPlaying, peeking, moves, endGame])

  // Cancel every callback on unmount, including delayed interval starts.
  useEffect(() => clearTimers, [clearTimers])

  const stars = getStarRating(moves, DIFFICULTIES[difficulty].pairs)

  const isPerfect = gameOver && gameOverReason === 'win' && mistakes === 0

  return {
    difficulty, theme, mode, dailyChallenge, dailyProgress, cards, flippedIds, matchedPairIds,
    moves, mistakes, time, isPlaying, gameOver, gameOverReason,
    combo, maxCombo, score, lastReward,
    locked, hintUsed, showHint, soundOn, newBest, stars,
    shakeIds, matchAnimIds, peeking, peekProgress, isPerfect,
    startGame, flipCard, useHint: useHintFn,
    setSoundOn, setDifficulty, setTheme, setMode,
    formatTime,
  }
}
