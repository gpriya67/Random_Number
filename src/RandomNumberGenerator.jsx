import { useState, useCallback } from 'react'

// ── helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns a random integer in [min, max] (inclusive).
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// ── sub-components ────────────────────────────────────────────────────────────

/** Animated background blobs */
function BackgroundBlobs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl animate-float" />
      <div
        className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl animate-float"
        style={{ animationDelay: '1.5s' }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-pink-600/10 blur-3xl animate-float"
        style={{ animationDelay: '0.75s' }}
      />
    </div>
  )
}

/** Floating particle dots */
function Particles() {
  const dots = Array.from({ length: 20 }, (_, i) => i)
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {dots.map((i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-purple-400/30 animate-float"
          style={{
            left: `${(i * 17 + 5) % 100}%`,
            top: `${(i * 23 + 10) % 100}%`,
            animationDuration: `${3 + (i % 4)}s`,
            animationDelay: `${(i * 0.3) % 3}s`,
          }}
        />
      ))}
    </div>
  )
}

/** Number display with conditional rendering */
function NumberDisplay({ number, isAnimating }) {
  /* ── Conditional rendering: placeholder before first click ── */
  if (number === null) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10">
        <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center animate-float">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-10 h-10 text-purple-400"
          >
            <rect x="2" y="2" width="20" height="20" rx="3" />
            <circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="16" cy="8" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="8" cy="16" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
          </svg>
        </div>
        <p className="text-white/40 text-lg font-medium tracking-wide">
          No number generated yet
        </p>
        <p className="text-white/20 text-sm">Hit the button below to roll!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div
        key={number}
        className={`
          text-9xl font-black tracking-tighter
          bg-gradient-to-br from-purple-300 via-pink-300 to-blue-300
          bg-clip-text text-transparent
          ${isAnimating ? 'animate-bounce-in' : ''}
          animate-pulse-glow rounded-2xl px-6 py-2
        `}
      >
        {number}
      </div>
      <p className="text-white/40 text-sm font-medium tracking-widest uppercase">
        between 1 &amp; 100
      </p>
    </div>
  )
}

/** Generate button */
function GenerateButton({ onClick, isAnimating }) {
  return (
    <button
      id="generate-btn"
      onClick={onClick}
      disabled={isAnimating}
      className="
        relative w-full max-w-xs mx-auto flex items-center justify-center gap-3
        px-8 py-4 rounded-2xl font-bold text-lg tracking-wide
        bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600
        hover:from-purple-500 hover:via-violet-500 hover:to-blue-500
        text-white shadow-lg shadow-purple-900/50
        transition-all duration-300
        hover:scale-105 hover:shadow-xl hover:shadow-purple-800/60
        active:scale-95
        disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100
        focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent
      "
    >
      <span className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`w-5 h-5 ${isAnimating ? 'animate-spin-slow' : ''}`}
      >
        <rect x="2" y="2" width="20" height="20" rx="3" />
        <circle cx="8.5" cy="8.5" r="1" fill="currentColor" stroke="none" />
        <circle cx="15.5" cy="8.5" r="1" fill="currentColor" stroke="none" />
        <circle cx="8.5" cy="15.5" r="1" fill="currentColor" stroke="none" />
        <circle cx="15.5" cy="15.5" r="1" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      </svg>
      Generate Random Number
    </button>
  )
}

/** History chip list */
function HistoryList({ history }) {
  if (history.length === 0) return null
  return (
    <div className="mt-2 w-full">
      <p className="text-white/30 text-xs font-semibold tracking-widest uppercase mb-3 text-center">
        Previous rolls
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {history.map((n, idx) => (
          <span
            key={idx}
            className="
              px-3 py-1 rounded-full text-sm font-semibold
              bg-white/5 border border-white/10 text-white/50
              hover:text-white/80 transition-colors duration-200
            "
          >
            {n}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── main component ────────────────────────────────────────────────────────────

/**
 * RandomNumberGenerator
 *
 * Demonstrates:
 *  - useState for current number, history, animation flag, and roll count
 *  - Button click event to trigger generation
 *  - Conditional rendering (null = placeholder, number = display)
 */
export default function RandomNumberGenerator() {
  const [number, setNumber] = useState(null)       // null = "no number yet"
  const [history, setHistory] = useState([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [rollCount, setRollCount] = useState(0)

  const handleGenerate = useCallback(() => {
    setIsAnimating(true)
    setTimeout(() => {
      const newNum = getRandomInt(1, 100)
      setNumber(newNum)
      setHistory((prev) => [newNum, ...prev].slice(0, 10))
      setRollCount((c) => c + 1)
      setIsAnimating(false)
    }, 350)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white font-inter flex flex-col items-center justify-center px-4 py-12 relative">
      <BackgroundBlobs />
      <Particles />

      {/* Glass card */}
      <div className="relative z-10 w-full max-w-md bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-black/60 p-8 flex flex-col items-center gap-6">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent mb-1">
            Random Number Generator
          </h1>
          <p className="text-white/40 text-sm">
            React &middot; <code className="text-purple-400">useState</code> &middot; Conditional Rendering
          </p>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Conditional display */}
        <NumberDisplay number={number} isAnimating={isAnimating} />

        {/* Range badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white/50">
          <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" />
          Range: <span className="text-purple-300 font-semibold">1</span> to <span className="text-blue-300 font-semibold">100</span>
        </div>

        {/* Button */}
        <GenerateButton onClick={handleGenerate} isAnimating={isAnimating} />

        {/* Roll counter */}
        {rollCount > 0 && (
          <p className="text-white/25 text-xs">
            🎲 Total rolls: <span className="text-white/50 font-semibold">{rollCount}</span>
          </p>
        )}

        {/* History */}
        <HistoryList history={history.slice(1)} />
      </div>

      <p className="relative z-10 mt-8 text-white/20 text-xs text-center">
        React &middot; useState &middot; Conditional Rendering &middot; Tailwind CSS
      </p>
    </div>
  )
}
