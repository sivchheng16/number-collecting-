import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Keyboard, Check, ArrowRight, X } from 'lucide-react';

interface TutorialProps {
  onComplete: () => void;
  onExit: () => void;
}

const FINGER_COLORS = {
  l_pinky: 'bg-red-500',
  l_ring: 'bg-orange-500',
  l_middle: 'bg-yellow-500',
  l_index: 'bg-green-500',
  r_index: 'bg-blue-500',
  r_middle: 'bg-purple-500',
  r_ring: 'bg-pink-500',
  r_pinky: 'bg-rose-500',
};

const KEY_MAP: Record<string, string> = {
  '1': 'l_pinky', '2': 'l_ring', '3': 'l_middle', '4': 'l_index', '5': 'l_index',
  '6': 'r_index', '7': 'r_index', '8': 'r_middle', '9': 'r_ring', '0': 'r_pinky',
  'Q': 'l_pinky', 'W': 'l_ring', 'E': 'l_middle', 'R': 'l_index', 'T': 'l_index',
  'Y': 'r_index', 'U': 'r_index', 'I': 'r_middle', 'O': 'r_ring', 'P': 'r_pinky',
  'A': 'l_pinky', 'S': 'l_ring', 'D': 'l_middle', 'F': 'l_index', 'G': 'l_index',
  'H': 'r_index', 'J': 'r_index', 'K': 'r_middle', 'L': 'r_ring', ';': 'r_pinky',
  'Z': 'l_pinky', 'X': 'l_ring', 'C': 'l_middle', 'V': 'l_index', 'B': 'l_index',
  'N': 'r_index', 'M': 'r_index', ',': 'r_middle', '.': 'r_ring', '/': 'r_pinky'
};

const STEPS = [
  {
    title: "System Interface",
    content: "Welcome, Operator. Your goal is to process incoming data packets before they breach the buffer. You must type the correct code to neutralize them.",
    action: "press_any"
  },
  {
    title: "Home Row Stance",
    content: "Place your fingers on the Home Row (A-S-D-F and J-K-L-;). This is your base of operations.",
    action: "press_any",
    showKeyboard: true
  },
  {
    title: "Number Reach",
    content: "Reach up from the Home Row to strike the number keys. Return to base after each strike.",
    action: "press_any",
    showKeyboard: true,
    highlightNumbers: true
  },
  {
    title: "Drill: Left Hand",
    content: "Type the numbers using your LEFT hand fingers.",
    action: "type_sequence",
    sequence: ['1', '2', '3', '4', '5'],
    showKeyboard: true
  },
  {
    title: "Drill: Right Hand",
    content: "Type the numbers using your RIGHT hand fingers.",
    action: "type_sequence",
    sequence: ['6', '7', '8', '9', '0'],
    showKeyboard: true
  },
  {
    title: "Drill: Mixed",
    content: "Type the sequence as it appears.",
    action: "type_sequence",
    sequence: ['1', '0', '3', '8', '5', '6'],
    showKeyboard: true
  },
  {
    title: "Training Complete",
    content: "You are ready to engage the main system. Good luck, Operator.",
    action: "press_any"
  }
];

const FINGER_NAMES: Record<string, string> = {
  l_pinky: 'Left Pinky',
  l_ring: 'Left Ring',
  l_middle: 'Left Middle',
  l_index: 'Left Index',
  r_index: 'Right Index',
  r_middle: 'Right Middle',
  r_ring: 'Right Ring',
  r_pinky: 'Right Pinky',
};

const HandOverlay = ({ activeFinger }: { activeFinger?: string }) => {
  const getFingerColor = (finger: string) => {
    return activeFinger === finger ? '#3b82f6' : '#4b5563';
  };

  const getFingerOpacity = (finger: string) => {
    return activeFinger === finger ? 1 : 0.2;
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-20 flex justify-center items-end pb-4">
      <svg width="600" height="400" viewBox="0 0 600 400" className="overflow-visible opacity-80">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Left Hand Group */}
        <g transform="translate(50, 100)">
          {/* Wrist */}
          <path d="M 50 280 Q 60 220 40 180" fill="none" stroke="#374151" strokeWidth="2" />

          {/* Pinky (1, Q, A, Z) */}
          <g className="transition-all duration-300" style={{ opacity: getFingerOpacity('l_pinky') }}>
            <path d="M 40 180 Q 30 140 35 110" fill="none" stroke={getFingerColor('l_pinky')} strokeWidth="3" />
            <circle cx="35" cy="110" r="12" fill="none" stroke={getFingerColor('l_pinky')} strokeWidth="2" />
            <text x="35" y="90" textAnchor="middle" fill={getFingerColor('l_pinky')} fontSize="10" fontWeight="bold">1</text>
          </g>

          {/* Ring (2, W, S, X) */}
          <g className="transition-all duration-300" style={{ opacity: getFingerOpacity('l_ring') }}>
            <path d="M 60 180 Q 60 130 65 90" fill="none" stroke={getFingerColor('l_ring')} strokeWidth="3" />
            <circle cx="65" cy="90" r="12" fill="none" stroke={getFingerColor('l_ring')} strokeWidth="2" />
            <text x="65" y="70" textAnchor="middle" fill={getFingerColor('l_ring')} fontSize="10" fontWeight="bold">2</text>
          </g>

          {/* Middle (3, E, D, C) */}
          <g className="transition-all duration-300" style={{ opacity: getFingerOpacity('l_middle') }}>
            <path d="M 85 180 Q 90 120 95 70" fill="none" stroke={getFingerColor('l_middle')} strokeWidth="3" />
            <circle cx="95" cy="70" r="12" fill="none" stroke={getFingerColor('l_middle')} strokeWidth="2" />
            <text x="95" y="50" textAnchor="middle" fill={getFingerColor('l_middle')} fontSize="10" fontWeight="bold">3</text>
          </g>

          {/* Index (4, 5, R, T, F, G, V, B) */}
          <g className="transition-all duration-300" style={{ opacity: getFingerOpacity('l_index') }}>
            <path d="M 110 180 Q 120 130 125 90" fill="none" stroke={getFingerColor('l_index')} strokeWidth="3" />
            <circle cx="125" cy="90" r="12" fill="none" stroke={getFingerColor('l_index')} strokeWidth="2" />
            <text x="125" y="70" textAnchor="middle" fill={getFingerColor('l_index')} fontSize="10" fontWeight="bold">4-5</text>
          </g>

          {/* Thumb */}
          <path d="M 130 200 Q 160 220 180 240" fill="none" stroke="#374151" strokeWidth="2" opacity="0.5" />
        </g>

        {/* Right Hand Group */}
        <g transform="translate(350, 100)">
          {/* Wrist */}
          <path d="M 200 280 Q 190 220 210 180" fill="none" stroke="#374151" strokeWidth="2" />

          {/* Index (6, 7, Y, U, H, J, N, M) */}
          <g className="transition-all duration-300" style={{ opacity: getFingerOpacity('r_index') }}>
            <path d="M 140 180 Q 130 130 125 90" fill="none" stroke={getFingerColor('r_index')} strokeWidth="3" />
            <circle cx="125" cy="90" r="12" fill="none" stroke={getFingerColor('r_index')} strokeWidth="2" />
            <text x="125" y="70" textAnchor="middle" fill={getFingerColor('r_index')} fontSize="10" fontWeight="bold">6-7</text>
          </g>

          {/* Middle (8, I, K, ,) */}
          <g className="transition-all duration-300" style={{ opacity: getFingerOpacity('r_middle') }}>
            <path d="M 165 180 Q 160 120 155 70" fill="none" stroke={getFingerColor('r_middle')} strokeWidth="3" />
            <circle cx="155" cy="70" r="12" fill="none" stroke={getFingerColor('r_middle')} strokeWidth="2" />
            <text x="155" y="50" textAnchor="middle" fill={getFingerColor('r_middle')} fontSize="10" fontWeight="bold">8</text>
          </g>

          {/* Ring (9, O, L, .) */}
          <g className="transition-all duration-300" style={{ opacity: getFingerOpacity('r_ring') }}>
            <path d="M 190 180 Q 190 130 185 90" fill="none" stroke={getFingerColor('r_ring')} strokeWidth="3" />
            <circle cx="185" cy="90" r="12" fill="none" stroke={getFingerColor('r_ring')} strokeWidth="2" />
            <text x="185" y="70" textAnchor="middle" fill={getFingerColor('r_ring')} fontSize="10" fontWeight="bold">9</text>
          </g>

          {/* Pinky (0, P, ;, /) */}
          <g className="transition-all duration-300" style={{ opacity: getFingerOpacity('r_pinky') }}>
            <path d="M 210 180 Q 220 140 215 110" fill="none" stroke={getFingerColor('r_pinky')} strokeWidth="3" />
            <circle cx="215" cy="110" r="12" fill="none" stroke={getFingerColor('r_pinky')} strokeWidth="2" />
            <text x="215" y="90" textAnchor="middle" fill={getFingerColor('r_pinky')} fontSize="10" fontWeight="bold">0</text>
          </g>

          {/* Thumb */}
          <path d="M 120 200 Q 90 220 70 240" fill="none" stroke="#374151" strokeWidth="2" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
};

export default function Tutorial({ onComplete, onExit }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [input, setInput] = useState('');
  const [isError, setIsError] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const step = STEPS[currentStep];

  // Determine active finger for current target
  const targetChar = step.action === 'type_sequence' ? step.sequence![sequenceIndex] : null;
  const activeFinger = targetChar ? KEY_MAP[targetChar] : undefined;

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [currentStep]);

  // Sound Effects
  const playSound = (type: 'type' | 'correct' | 'error' | 'step') => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;

    // Resume context if suspended (browser policy)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (type) {
      case 'type':
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      case 'correct':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now); // A4
        osc.frequency.setValueAtTime(554.37, now + 0.1); // C#5
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      case 'error':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.2);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      case 'step':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (step.action === 'press_any') {
        // Prevent rapid double-firing if user holds key
        if (e.repeat) return;
        nextStep();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, step.action]); // Re-bind when step changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (step.action !== 'type_sequence') return;
    if (isError) return; // Prevent typing during error animation

    const val = e.target.value.toUpperCase();
    const inputChar = val.slice(-1); // Get the last character typed
    const target = step.sequence![sequenceIndex];

    // Only allow correct character
    if (inputChar === target) {
      playSound('correct');
      setInput('');
      setIsError(false);
      if (sequenceIndex + 1 >= step.sequence!.length) {
        nextStep();
      } else {
        setSequenceIndex(prev => prev + 1);
      }
    } else {
      // Shake or error effect
      playSound('error');
      setInput(inputChar);
      setIsError(true);
      setTimeout(() => {
        setInput('');
        setIsError(false);
      }, 400);
    }
  };

  const nextStep = () => {
    playSound('step');
    if (currentStep + 1 >= STEPS.length) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
      setSequenceIndex(0);
      setInput('');
      setIsError(false);
    }
  };

  const renderKey = (char: string, label?: string) => {
    const finger = KEY_MAP[char];
    const colorClass = finger ? FINGER_COLORS[finger as keyof typeof FINGER_COLORS] : 'bg-gray-700';
    const isTarget = step.action === 'type_sequence' && step.sequence![sequenceIndex] === char;

    // All mapped keys show their finger color at full brightness
    let bgClass = 'bg-gray-800 text-gray-400';
    if (finger) {
      bgClass = colorClass + ' text-white';
    }

    return (
      <div className={`
        relative w-10 h-10 rounded flex flex-col items-center justify-center text-sm font-bold border-b-4 transition-all
        ${bgClass}
        ${isTarget ? 'scale-110 border-white z-10 ring-2 ring-white shadow-[0_0_15px_rgba(255,255,255,0.8)] brightness-125' : 'border-black/20'}
      `}>
        <span>{char}</span>
        {label && <span className="text-[8px] absolute bottom-0.5 opacity-50">{label}</span>}
      </div>
    );
  };

  const ModifierKey = ({ label, width = 'w-10', className = '' }: { label: string, width?: string, className?: string }) => (
    <div className={`${width} h-10 bg-gray-800 rounded flex items-center justify-center text-[10px] text-gray-500 font-bold uppercase border-b-4 border-black/20 ${className}`}>
      {label}
    </div>
  );

  return (
    <div className="absolute inset-0 bg-[#0a0a0a] z-50 flex flex-col items-center justify-center p-8 overflow-y-auto">
      <button
        onClick={onExit}
        className="absolute top-8 right-8 text-gray-500 hover:text-white flex items-center gap-2"
      >
        <X className="w-5 h-5" /> EXIT TRAINING
      </button>

      <div className="max-w-3xl w-full flex flex-col items-center">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-blue-500 mb-4 tracking-tight">TRAINING PROTOCOL <span className="text-white">0{currentStep + 1}</span></h2>
          <h3 className="text-2xl text-white font-bold mb-4">{step.title}</h3>
          <p className="text-xl text-gray-400">{step.content}</p>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex flex-col items-center justify-center mb-8 relative w-full gap-8">
          {step.action === 'type_sequence' && (
            <div className="flex flex-col items-center gap-6 z-30">
              <div className="flex gap-4">
                {step.sequence!.map((char, idx) => (
                  <div key={idx} className={`
                     w-12 h-16 rounded-lg flex items-center justify-center text-2xl font-bold border-2 transition-all
                     ${idx < sequenceIndex ? 'bg-green-500/20 border-green-500 text-green-500' : ''}
                     ${idx === sequenceIndex ? 'bg-blue-500/20 border-blue-500 text-white scale-110 shadow-[0_0_20px_rgba(59,130,246,0.5)]' : ''}
                     ${idx > sequenceIndex ? 'bg-gray-800 border-gray-700 text-gray-600' : ''}
                   `}>
                    {idx < sequenceIndex ? <Check className="w-6 h-6" /> : char}
                  </div>
                ))}
              </div>

              {activeFinger && (
                <div className="text-lg font-mono text-blue-400 animate-pulse bg-blue-900/20 px-4 py-2 rounded-full border border-blue-500/30">
                  Use <span className="font-bold text-white">{FINGER_NAMES[activeFinger]}</span> to press <span className="font-bold text-white">{targetChar}</span>
                </div>
              )}
            </div>
          )}

          {step.showKeyboard && (
            <div className="relative flex flex-col gap-2 p-8 bg-gray-900/50 rounded-xl border border-gray-800 transition-all duration-300">
              {/* Full Keyboard Layout */}
              <div className="flex flex-col gap-1 select-none">
                {/* Row 1 - Number Row */}
                <div className="flex gap-1 justify-center">
                  <ModifierKey label="~" width="w-8" />
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map(k => <React.Fragment key={k}>{renderKey(k)}</React.Fragment>)}
                  <ModifierKey label="-" />
                  <ModifierKey label="=" />
                  <ModifierKey label="Backspace" width="w-16" />
                </div>
                {/* Row 2 - QWERTY */}
                <div className="flex gap-1 justify-center">
                  <ModifierKey label="Tab" width="w-12" />
                  {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map(k => <React.Fragment key={k}>{renderKey(k)}</React.Fragment>)}
                  <ModifierKey label="[" />
                  <ModifierKey label="]" />
                  <ModifierKey label="\" width="w-12" />
                </div>
                {/* Row 3 - Home Row */}
                <div className="flex gap-1 justify-center">
                  <ModifierKey label="Caps" width="w-14" />
                  {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';'].map(k => <React.Fragment key={k}>{renderKey(k)}</React.Fragment>)}
                  <ModifierKey label="'" />
                  <ModifierKey label="Enter" width="w-20" className="bg-blue-900/20 text-blue-500" />
                </div>
                {/* Row 4 - Bottom Row */}
                <div className="flex gap-1 justify-center">
                  <ModifierKey label="Shift" width="w-20" />
                  {['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/'].map(k => <React.Fragment key={k}>{renderKey(k)}</React.Fragment>)}
                  <ModifierKey label="Shift" width="w-24" />
                </div>
                {/* Row 5 - Space */}
                <div className="flex gap-1 justify-center">
                  <ModifierKey label="Ctrl" width="w-12" />
                  <ModifierKey label="Alt" width="w-12" />
                  <div className="w-64 h-10 bg-gray-800 rounded border-b-4 border-black/20 flex items-center justify-center text-xs text-gray-600">SPACE</div>
                  <ModifierKey label="Alt" width="w-12" />
                  <ModifierKey label="Ctrl" width="w-12" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input / Action Area */}
        <div className="flex justify-center mt-4">
          {step.action === 'press_any' ? (
            <button
              onClick={nextStep}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 animate-pulse"
            >
              CONTINUE <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <div className="relative">
              <motion.input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleChange}
                animate={isError ? {
                  x: [-10, 10, -10, 10, 0],
                  color: "#ef4444",
                  borderColor: "#ef4444",
                  backgroundColor: "rgba(239, 68, 68, 0.1)"
                } : {
                  x: 0,
                  color: "#ffffff",
                  borderColor: "#3b82f6",
                  backgroundColor: "transparent"
                }}
                transition={{ duration: 0.4 }}
                className="bg-transparent border-b-4 text-center text-4xl focus:outline-none w-40 py-2 font-mono transition-all rounded-t-lg"
                autoFocus
                onBlur={(e) => e.target.focus()}
              />
              {isError && (
                <div className="absolute top-full left-0 right-0 text-center text-red-500 text-xs font-bold mt-2 animate-bounce">
                  INCORRECT KEY
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
