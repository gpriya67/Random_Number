import { useState, useCallback, useMemo } from 'react'

// ── helpers ───────────────────────────────────────────────────────────────────

/**
 * Returns a random integer in [min, max] (inclusive).
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function fmtTime(date) {
  return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

// ── NavBar ────────────────────────────────────────────────────────────────────

function NavBar() {
  return (
    <nav className="w-full bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-4 sticky top-0 z-20">
      {/* Logo + title */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
        <span className="font-bold text-slate-800 text-sm whitespace-nowrap">React Lab: RNG</span>
        <span className="px-2 py-0.5 text-xs font-bold bg-indigo-100 text-indigo-600 rounded-full border border-indigo-200 tracking-wide">
          STATE &amp; CONDITIONAL RENDERING
        </span>
      </div>

      {/* Nav links */}
      <div className="flex items-center gap-0.5 ml-2">
        <button className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-md">
          Interactive Lab
        </button>
        {['Architecture & Specs', 'Rendering Guide'].map(label => (
          <button key={label} className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-md transition-colors whitespace-nowrap">
            {label}
          </button>
        ))}
        <button className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-md transition-colors flex items-center gap-1.5">
          <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          Repository
        </button>
      </div>

      <div className="flex-1" />

      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        RL
      </div>
    </nav>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

/**
 * RandomNumberGenerator
 *
 * Demonstrates:
 *  - useState for number, history, animation flag, and roll count
 *  - Button click event to trigger generation
 *  - Conditional rendering (null = placeholder, number = display)
 */
export default function RandomNumberGenerator() {
  const [minVal, setMinVal] = useState(1)
  const [maxVal, setMaxVal] = useState(100)
  const [number, setNumber] = useState(null)   // null = "no number yet"
  const [history, setHistory] = useState([])     // { number, timestamp }
  const [isAnimating, setIsAnimating] = useState(false)
  const [rollCount, setRollCount] = useState(0)
  const [copied, setCopied] = useState(false)

  // ── Derived stats ──
  const stats = useMemo(() => {
    if (history.length === 0) return { min: null, max: null, avg: null }
    const nums = history.map(h => h.number)
    return {
      min: Math.min(...nums),
      max: Math.max(...nums),
      avg: (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1),
    }
  }, [history])

  // ── Handlers ──
  const handleGenerate = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      const n = getRandomInt(Number(minVal), Number(maxVal))
      setNumber(n)
      setHistory(prev => [{ number: n, timestamp: new Date() }, ...prev].slice(0, 30))
      setRollCount(c => c + 1)
      setIsAnimating(false)
    }, 300)
  }, [minVal, maxVal, isAnimating])

  const handleReset = useCallback(() => setNumber(null), [])

  const handleCopy = useCallback(() => {
    if (number === null) return
    navigator.clipboard.writeText(String(number))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [number])

  const handleClearHistory = useCallback(() => setHistory([]), [])

  const applyPreset = useCallback((mn, mx) => { setMinVal(mn); setMaxVal(mx) }, [])

  const PRESETS = [
    { label: '1-6 (Dice)', min: 1, max: 6 },
    { label: '1-10', min: 1, max: 10 },
    { label: '1-100', min: 1, max: 100 },
    { label: '1-1000', min: 1, max: 1000 },
    { label: '0-1 (Binary)', min: 0, max: 1 },
  ]

  return (
    <div className="min-h-screen font-inter" style={{ backgroundColor: '#EDEEF8' }}>
      <NavBar />

      <main className="max-w-3xl mx-auto px-6 py-8">

        {/* ── Breadcrumb ── */}
        <p className="text-xs font-bold text-indigo-400 tracking-widest uppercase mb-4">
          React Fundamentals / Hooks &amp; State / Lab #04
        </p>

        {/* ── Title row ── */}
        <div className="flex items-start justify-between mb-7 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-800 mb-2 leading-tight">
              Random Number Generator
            </h1>
            <p className="text-slate-500 text-sm max-w-lg leading-relaxed">
              An interactive laboratory demonstrating the{' '}
              <code className="px-1.5 py-0.5 bg-indigo-100 text-indigo-600 rounded text-xs font-mono">useState(null)</code>
              {' '}lifecycle, dispatch events, and dual-branch conditional rendering.
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0 pt-1">
            <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 bg-white border border-slate-200 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
              React 18+ Fiber
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 bg-white border border-slate-200 rounded-full shadow-sm">
              <svg className="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><circle cx="12" cy="16" r="0.5" fill="currentColor" />
              </svg>
              Strict Mode
            </span>
          </div>
        </div>

        {/* ── Main card ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm mb-4 overflow-hidden">

          {/* Card header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="3" width="18" height="18" rx="3" /><path d="M3 9h18M9 21V9" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 font-mono">&lt;RandomNumberGenerator /&gt;</p>
                <p className="text-xs text-slate-400">Active Component Instance</p>
              </div>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <span>Executions:</span>
              <span className="font-bold text-slate-600 tabular-nums">{rollCount}</span>
            </div>
          </div>

          <div className="p-5 flex flex-col gap-5">

            {/* ── Range bounds ── */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                  <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">Domain Range Bounds</span>
                </div>
                <code className="text-xs text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-lg font-mono border border-indigo-100">
                  [{minVal} ... {maxVal}]
                </code>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                {/* Min */}
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">Min Bound</label>
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-200 focus-within:border-indigo-300 transition-all bg-white">
                    <button
                      onClick={() => setMinVal(m => Math.max(-999999, Number(m) - 1))}
                      className="px-3 py-3 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors border-r border-slate-100"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="18 15 12 9 6 15" /></svg>
                    </button>
                    <input
                      type="number"
                      value={minVal}
                      onChange={e => setMinVal(e.target.value)}
                      className="flex-1 px-3 py-3 text-sm font-semibold text-slate-700 bg-white focus:outline-none text-center tabular-nums"
                    />
                  </div>
                </div>
                {/* Max */}
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">Max Bound</label>
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-200 focus-within:border-indigo-300 transition-all bg-white">
                    <button
                      onClick={() => setMaxVal(m => Number(m) + 1)}
                      className="px-3 py-3 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors border-r border-slate-100"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
                    </button>
                    <input
                      type="number"
                      value={maxVal}
                      onChange={e => setMaxVal(e.target.value)}
                      className="flex-1 px-3 py-3 text-sm font-semibold text-slate-700 bg-white focus:outline-none text-center tabular-nums"
                    />
                  </div>
                </div>
              </div>

              {/* Presets */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-400">Quick Presets:</span>
                {PRESETS.map(p => (
                  <button
                    key={p.label}
                    onClick={() => applyPreset(p.min, p.max)}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition-all duration-150 ${Number(minVal) === p.min && Number(maxVal) === p.max
                      ? 'bg-indigo-100 text-indigo-600 border-indigo-300 font-semibold'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-200 hover:text-indigo-500 hover:bg-indigo-50'
                      }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Number display ── */}
            <div className="rounded-xl border border-slate-100 bg-slate-50 flex flex-col items-center justify-center py-10 px-4 min-h-[200px]">
              {number === null ? (
                /* Conditional rendering: null branch */
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center">
                    <svg className="w-7 h-7 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3l1.88 5.76a1 1 0 0 0 .95.69h6.07l-4.9 3.57a1 1 0 0 0-.36 1.11L17.52 20 12 16.43 6.48 20l1.88-5.87a1 1 0 0 0-.36-1.11L3.1 9.45h6.07a1 1 0 0 0 .95-.69L12 3z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-600 font-semibold text-base mb-1">No number generated yet</p>
                    <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
                      Click the button below to trigger your first state update and generate a random number.
                    </p>
                  </div>
                </div>
              ) : (
                /* Conditional rendering: number branch */
                <div key={number} className={`flex flex-col items-center gap-2 ${isAnimating ? 'animate-pop-in' : ''}`}>
                  <p className="text-[5rem] font-black text-slate-800 tabular-nums leading-none">
                    {number}
                  </p>
                  <code className="text-xs text-slate-400 font-mono bg-slate-100 px-3 py-1 rounded-full">
                    setState(<span className="text-indigo-500 font-bold">{number}</span>) → re-render #{rollCount}
                  </code>
                </div>
              )}
            </div>

            {/* ── Action buttons ── */}
            <div className="flex gap-2">
              <button
                id="generate-btn"
                onClick={handleGenerate}
                disabled={isAnimating}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-300/50 transition-all hover:shadow-lg hover:shadow-indigo-300/60 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <svg className={`w-4 h-4 ${isAnimating ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                {isAnimating ? 'Dispatching…' : 'Generate Random Number'}
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98] whitespace-nowrap"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.5" />
                </svg>
                Reset (null)
              </button>
              <button
                onClick={handleCopy}
                disabled={number === null}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {copied
                  ? <svg className="w-3.5 h-3.5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                  : <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                }
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Min Sample', value: stats.min },
            { label: 'Max Sample', value: stats.max },
            { label: 'Avg Roll', value: stats.avg },
            { label: 'Total Rolls', value: rollCount, highlight: true },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200/80 shadow-sm px-4 py-3.5">
              <p className="text-xs text-slate-400 mb-1.5">{s.label}</p>
              <p className={`text-2xl font-bold tabular-nums ${s.highlight ? 'text-indigo-600' : 'text-slate-700'}`}>
                {s.value !== null && s.value !== undefined ? s.value : '—'}
              </p>
            </div>
          ))}
        </div>

        {/* ── State Audit Log ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm mb-4 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              <span className="text-sm font-bold text-slate-700">State Audit Log</span>
            </div>
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
              Clear History
            </button>
          </div>
          <div className="px-5 py-4">
            {history.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-3">
                No state transitions recorded yet. Dispatch a random number to append telemetry.
              </p>
            ) : (
              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                {history.map((h, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i === 0 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        {i === 0 ? '●' : '○'}
                      </span>
                      <code className="text-xs font-mono text-slate-600">
                        setState(<span className="text-indigo-500 font-bold">{h.number}</span>)
                        <span className="text-slate-300 mx-1">→</span>
                        <span className="text-slate-400">null</span>
                      </code>
                    </div>
                    <span className="text-slate-300 text-xs font-mono">{fmtTime(h.timestamp)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Info cards ── */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-yellow-100 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-slate-700">Re-render Trigger</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Calling{' '}
              <code className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded text-xs font-mono border border-indigo-100">setRandomNumber(nextVal)</code>
              {' '}schedules component reconciliation. React compares the VDOM diff and commits only the mutated text node.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-green-100 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-slate-700">Clean Guard Clauses</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Using strict identity checks{' '}
              <code className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-mono">=== null</code>
              {' '}prevents unintended short-circuits caused by numeric{' '}
              <code className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-mono">0</code>
              {' '}being falsy in JavaScript coercion.
            </p>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="flex items-center justify-between pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-400 font-mono tracking-wide">
            REACT_RENDER_DISPATCHER • Educational Sandbox
          </p>
          <p className="text-xs text-slate-400">
            © 2025 React Lab Core • MIT License
          </p>
        </footer>
      </main>
    </div>
  )
}
