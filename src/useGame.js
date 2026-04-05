import { useState, useCallback, useRef, useEffect } from 'react'
import { generateCards, getStarRating, saveBestScore, formatTime } from './gameLogic'
import { playFlip, playMatch, playNoMatch, playCombo, playVictory, playHint } from './sounds'

export function useGame() {
  const [difficulty, setDifficulty] = useState('easy')
  const [theme, setTheme] = useState('emoji')
  const [cards, setCards] = useState([])
  const [flippedIds, setFlippedIds] = useState([])
  const [matchedPairIds, setMatchedPairIds] = useState(new Set())
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [locked, setLocked] = useState(false)
  const [hintUsed, setHintUsed] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [soundOn, setSoundOn] = useState(true)
  const [newBest, setNewBest] = useState(false)
  const [shakeIds, setShakeIds] = useState(new Set())
  const [matchAnimIds, setMatchAnimIds] = useState(new Set())

  const timerRef = useRef(null)
  const totalPairs = useRef(0)

  const startGame = useCallback((diff, th) => {
    const d = diff || difficulty
    const t = th || theme
    setDifficulty(d)
    setTheme(t)

    const newCards = generateCards(d, t)
    totalPairs.current = newCards.length / 2

    setCards(newCards)
    setFlippedIds([])
    setMatchedPairIds(new Set())
    setMoves(0)
    setTime(0)
    setIsPlaying(true)
    setGameOver(false)
    setCombo(0)
    setMaxCombo(0)
    setLocked(false)
    setHintUsed(false)
    setShowHint(false)
    setNewBest(false)
    setShakeIds(new Set())
    setMatchAnimIds(new Set())

    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTime(t => t + 1)
    }, 1000)
  }, [difficulty, theme])

  const endGame = useCallback((currentMoves, currentTime) => {
    setGameOver(true)
    setIsPlaying(false)
    if (timerRef.current) clearInterval(timerRef.current)

    const stars = getStarRating(currentMoves, totalPairs.current)
    const isBest = saveBestScore(difficulty, theme, {
      moves: currentMoves,
      time: currentTime,
      stars,
    })
    setNewBest(isBest)
    if (soundOn) playVictory()
  }, [difficulty, theme, soundOn])

  const flipCard = useCallback((cardId) => {
    if (locked || gameOver || showHint) return

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
        setCombo(newCombo)
        if (newCombo > maxCombo) setMaxCombo(newCombo)
        if (soundOn) {
          if (newCombo >= 2) playCombo()
          else playMatch()
        }

        // Pulse animation
        setMatchAnimIds(new Set([first.id, second.id]))

        setTimeout(() => {
          const newMatched = new Set(matchedPairIds)
          newMatched.add(first.pairId)
          setMatchedPairIds(newMatched)
          setMatchAnimIds(new Set())
          setFlippedIds([])
          setLocked(false)

          // Check victory
          if (newMatched.size === totalPairs.current) {
            endGame(newMoves, time)
          }
        }, 800)
      } else {
        // No match
        setCombo(0)
        if (soundOn) playNoMatch()

        setShakeIds(new Set([first.id, second.id]))

        setTimeout(() => {
          setFlippedIds([])
          setShakeIds(new Set())
          setLocked(false)
        }, 800)
      }
    }
  }, [cards, flippedIds, locked, gameOver, showHint, moves, combo, maxCombo, matchedPairIds, soundOn, time, endGame])

  const useHintFn = useCallback(() => {
    if (hintUsed || !isPlaying || gameOver) return
    setHintUsed(true)
    setShowHint(true)
    setLocked(true)
    if (soundOn) playHint()

    setTimeout(() => {
      setShowHint(false)
      setLocked(false)
    }, 1000)
  }, [hintUsed, isPlaying, gameOver, soundOn])

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // Track time for endGame
  const timeRef = useRef(time)
  useEffect(() => { timeRef.current = time }, [time])

  const stars = getStarRating(moves, totalPairs.current || 8)

  return {
    difficulty, theme, cards, flippedIds, matchedPairIds,
    moves, time, isPlaying, gameOver, combo, maxCombo,
    locked, hintUsed, showHint, soundOn, newBest, stars,
    shakeIds, matchAnimIds,
    startGame, flipCard, useHint: useHintFn,
    setSoundOn, setDifficulty, setTheme,
    formatTime,
  }
}
