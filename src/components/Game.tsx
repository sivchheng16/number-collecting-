import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Cpu, Zap, Activity, BookOpen, X, Play, RotateCcw, ArrowLeft, GraduationCap, Volume2, VolumeX } from 'lucide-react';
import Tutorial from './Tutorial';

// --- Types ---

type GameState = 'menu' | 'playing' | 'gameover' | 'tutorial';
type Difficulty = 'easy' | 'medium' | 'hard';
type GameMode = 'cpu' | 'stream';
type PowerUpType = 'slow' | 'shield' | 'double';

interface Task {
  id: string;
  x: number;
  y: number;
  speed: number;
  text: string;
  answer: string;
  type: 'math' | 'binary' | 'hex' | 'modulo' | 'number' | 'powerup';
  color: string;
  powerUp?: PowerUpType;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface ActiveEffects {
  slow: number; // timestamp when it ends
  shield: number;
  double: number;
}

type HighScores = {
  [key in GameMode]: {
    [key in Difficulty]: number;
  };
};

// --- Constants ---

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const DIFFICULTY_CONFIG = {
  easy: { spawnRate: 3000, speedBase: 0.8, speedInc: 0.1 },
  medium: { spawnRate: 2000, speedBase: 1.5, speedInc: 0.2 },
  hard: { spawnRate: 1000, speedBase: 2.5, speedInc: 0.3 },
};

// --- Helper Functions ---

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateTask = (level: number, width: number, difficulty: Difficulty, mode: GameMode): Task => {
  const config = DIFFICULTY_CONFIG[difficulty];
  const speed = config.speedBase + level * config.speedInc;

  let task: Task;

  if (mode === 'stream') {
    // Data Stream Mode: Just numbers
    const length = randomInt(1, 3); // Random 1 to 3 digits
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    const num = randomInt(min, max);
    const text = num.toString();
    
    // Ensure text fits within canvas width (approx char width 12px)
    const textWidth = text.length * 12;
    const x = randomInt(20, width - textWidth - 20);

    task = {
      id: Math.random().toString(36).substr(2, 9),
      x,
      y: -40,
      speed,
      text,
      answer: text,
      type: 'number',
      color: '#06b6d4', // Cyan
    };
  } else {
    // CPU Overload Mode: Math & Logic
    const types: ('math' | 'binary' | 'hex' | 'modulo')[] = ['math'];
    if (level >= 2) types.push('binary');
    if (level >= 3) types.push('modulo');
    if (level >= 4) types.push('hex');

    const type = types[randomInt(0, types.length - 1)];
    let text = '';
    let answer = '';
    let color = '#3b82f6'; // blue-500

    switch (type) {
      case 'math':
        const op = Math.random() > 0.5 ? '+' : '-';
        const a = randomInt(1, 20 + level * 5);
        const b = randomInt(1, 20 + level * 5);
        if (op === '+') {
          text = `${a} + ${b}`;
          answer = (a + b).toString();
        } else {
          const max = Math.max(a, b);
          const min = Math.min(a, b);
          text = `${max} - ${min}`;
          answer = (max - min).toString();
        }
        color = '#3b82f6'; // Blue
        break;
      case 'binary':
        const binVal = randomInt(1, 15 + level * 2);
        text = `0b${binVal.toString(2)}`;
        answer = binVal.toString();
        color = '#10b981'; // Green
        break;
      case 'hex':
        const hexVal = randomInt(10, 30 + level * 5);
        text = `0x${hexVal.toString(16).toUpperCase()}`;
        answer = hexVal.toString();
        color = '#a855f7'; // Purple
        break;
      case 'modulo':
        const div = randomInt(2, 5 + Math.floor(level / 2));
        const num = randomInt(10, 50 + level * 5);
        text = `${num} % ${div}`;
        answer = (num % div).toString();
        color = '#f59e0b'; // Amber
        break;
    }

    // Ensure text fits within canvas width (approx char width 12px)
    const textWidth = text.length * 12;
    const x = randomInt(20, width - textWidth - 20);

    task = {
      id: Math.random().toString(36).substr(2, 9),
      x,
      y: -40,
      speed,
      text,
      answer,
      type,
      color,
    };
  }

  // 10% chance to attach a power-up to the task
  if (Math.random() < 0.10) {
    const powerUps: PowerUpType[] = ['slow', 'shield', 'double'];
    const type = powerUps[randomInt(0, powerUps.length - 1)];
    task.powerUp = type;
  }

  return task;
};

// --- Component ---

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [gameState, setGameState] = useState<GameState>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameMode, setGameMode] = useState<GameMode>('cpu');
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [level, setLevel] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeEffects, setActiveEffects] = useState<ActiveEffects>({ slow: 0, shield: 0, double: 0 });
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [highScores, setHighScores] = useState<HighScores>(() => {
    const saved = localStorage.getItem('highScores');
    return saved ? JSON.parse(saved) : {
      cpu: { easy: 0, medium: 0, hard: 0 },
      stream: { easy: 0, medium: 0, hard: 0 }
    };
  });

  // Update current time for UI timers
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 100);
    return () => clearInterval(interval);
  }, []);

  // Game Loop Refs (to avoid closure staleness)
  const stateRef = useRef({
    gameState,
    tasks: [] as Task[],
    particles: [] as Particle[],
    lastSpawn: 0,
    score,
    health,
    level,
    difficulty,
    gameMode,
    activeEffects,
    inputValue,
  });

  // Sync refs with state
  useEffect(() => {
    stateRef.current.gameState = gameState;
    stateRef.current.score = score;
    stateRef.current.health = health;
    stateRef.current.level = level;
    stateRef.current.difficulty = difficulty;
    stateRef.current.gameMode = gameMode;
    stateRef.current.activeEffects = activeEffects;
    stateRef.current.inputValue = inputValue;
  }, [gameState, score, health, level, difficulty, gameMode, activeEffects, inputValue]);

  // Handle High Score Update
  useEffect(() => {
    if (gameState === 'gameover') {
      const { score, gameMode, difficulty } = stateRef.current;
      setHighScores(prev => {
        const currentHigh = prev[gameMode][difficulty];
        if (score > currentHigh) {
          const newScores = {
            ...prev,
            [gameMode]: {
              ...prev[gameMode],
              [difficulty]: score
            }
          };
          localStorage.setItem('highScores', JSON.stringify(newScores));
          return newScores;
        }
        return prev;
      });
    }
  }, [gameState]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if modifier keys are pressed (except for specific combos if we wanted them)
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      // Prevent default behavior for shortcuts to avoid browser conflicts
      if (['Escape', 'r', 'R', 'm', 'M'].includes(e.key)) {
         // Don't prevent default for R/M if they are valid inputs (which they aren't currently, but good practice)
      }

      switch (e.key) {
        case 'Escape':
          if (gameState !== 'menu') {
             setGameState('menu');
          }
          break;
        case 'r':
        case 'R':
          if (gameState === 'playing' || gameState === 'gameover') {
            startGame();
          }
          break;
        case 'm':
        case 'M':
          setSoundEnabled(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Auto-focus input when game starts
  useEffect(() => {
    if (gameState === 'playing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState]);

  // Input handling
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    if (gameState !== 'playing') {
      setInputValue(val);
      return;
    }

    // Limit input length for stream mode since max digits is 3
    if (stateRef.current.gameMode === 'stream' && val.length > 3) return;

    const trimmedVal = val.trim().toUpperCase(); // Handle case-insensitive for power-ups
    const tasks = stateRef.current.tasks;

    // Check if input is a valid prefix of any task
    const isValidPrefix = tasks.some(t => t.answer.startsWith(trimmedVal));

    if (!isValidPrefix && trimmedVal !== '') {
      // Incorrect input - trigger shake and clear
      setInputError(true);
      setTimeout(() => setInputError(false), 300);
      setInputValue('');
      return;
    }

    setInputValue(val);

    const matchIndex = tasks.findIndex((t) => t.answer === trimmedVal);

    if (matchIndex !== -1) {
      // Correct answer
      const task = tasks[matchIndex];
      createExplosion(task.x + 20, task.y + 10, task.color);
      
      // Handle Power-ups
      let healthBonus = 2; // Base recovery for correct answer

      if (task.powerUp) {
        healthBonus += 15; // Extra recovery for powerups
        const now = Date.now();
        const duration = 10000; // 10 seconds
        setActiveEffects(prev => ({
          ...prev,
          [task.powerUp!]: now + duration
        }));
      }
      
      // Apply health recovery
      setHealth((prev) => Math.min(prev + healthBonus, 100));
      
      // Update score
      const multiplier = stateRef.current.activeEffects.double > Date.now() ? 2 : 1;
      const points = 10 * stateRef.current.level * multiplier;
      setScore((prev) => prev + points);
      
      // Level up check
      if ((score + points) > level * 500) {
        setLevel((prev) => prev + 1);
        setHealth((prev) => Math.min(prev + 20, 100)); // Heal on level up
      }
      
      // Remove task
      stateRef.current.tasks.splice(matchIndex, 1);
      
      setInputValue('');
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Fallback for manual submit if needed, but auto-execute handles most cases
    if (gameState !== 'playing') return;
    // Clear if user presses enter and no match found (optional UX choice)
    if (inputValue.length > 0) setInputValue('');
  };

  const createExplosion = (x: number, y: number, color: string) => {
    for (let i = 0; i < 10; i++) {
      stateRef.current.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        life: 1.0,
        color,
      });
    }
  };

  // Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = (time: number) => {
      // Clear canvas
      ctx.fillStyle = '#151619'; // Dark bg
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw Grid (Retro feel)
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 1;
      for (let i = 0; i < CANVAS_WIDTH; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let i = 0; i < CANVAS_HEIGHT; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(CANVAS_WIDTH, i);
        ctx.stroke();
      }

      if (stateRef.current.gameState === 'playing') {
        const now = Date.now();
        const config = DIFFICULTY_CONFIG[stateRef.current.difficulty];
        const spawnRate = Math.max(500, config.spawnRate - stateRef.current.level * 100);

        // Spawn Logic
        if (time - stateRef.current.lastSpawn > spawnRate) {
          stateRef.current.tasks.push(generateTask(stateRef.current.level, CANVAS_WIDTH, stateRef.current.difficulty, stateRef.current.gameMode));
          stateRef.current.lastSpawn = time;
        }

        // Update Tasks
        const slowActive = stateRef.current.activeEffects.slow > now;
        const timeScale = slowActive ? 0.5 : 1.0;

        for (let i = stateRef.current.tasks.length - 1; i >= 0; i--) {
          const task = stateRef.current.tasks[i];
          task.y += task.speed * timeScale;

          // Draw Task
          ctx.font = '20px "JetBrains Mono", monospace';
          
          // Check for matching prefix
          const isMatching = stateRef.current.inputValue.length > 0 && 
                             task.answer.startsWith(stateRef.current.inputValue.toUpperCase());

          // Draw power-up indicator if present
          if (task.powerUp) {
            let powerUpText = '';
            let powerUpColor = '';
            let icon = '';

            switch(task.powerUp) {
                case 'slow': 
                  powerUpText = 'SLOW'; 
                  powerUpColor = '#34d399'; 
                  icon = '⏱️';
                  break;
                case 'shield': 
                  powerUpText = 'SHIELD'; 
                  powerUpColor = '#60a5fa'; 
                  icon = '🛡️';
                  break;
                case 'double': 
                  powerUpText = '2X'; 
                  powerUpColor = '#fbbf24'; 
                  icon = '⚡';
                  break;
            }
            
            // Measure main text to center the label
            const textMetrics = ctx.measureText(task.text);
            const textWidth = textMetrics.width;
            const centerX = task.x + textWidth / 2;

            // Pulse effect
            const pulse = Math.sin(now / 150) * 0.1 + 1; // 0.9 to 1.1
            
            ctx.save();
            ctx.translate(centerX, task.y - 35);
            ctx.scale(pulse, pulse);
            
            // Glow
            ctx.shadowBlur = 20;
            ctx.shadowColor = powerUpColor;
            
            // Background Pill
            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'; // Dark slate background
            ctx.strokeStyle = powerUpColor;
            ctx.lineWidth = 2;
            
            const label = `${icon} ${powerUpText}`;
            ctx.font = 'bold 12px "JetBrains Mono", monospace';
            const labelMetrics = ctx.measureText(label);
            const w = labelMetrics.width + 20;
            const h = 26;
            
            // Draw rounded rect
            const x = -w / 2;
            const y = -h / 2;
            const r = h / 2;
            
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + w - r, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + r);
            ctx.lineTo(x + w, y + h - r);
            ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            ctx.lineTo(x + r, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.closePath();
            
            ctx.fill();
            ctx.stroke();
            
            // Text
            ctx.fillStyle = powerUpColor;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, 0, 1);
            
            ctx.restore();
          } else {
            ctx.shadowBlur = 0;
          }

          // Draw main task text
          ctx.font = '20px "JetBrains Mono", monospace';
          if (isMatching) {
            ctx.fillStyle = '#ffffff'; // Highlight color
            ctx.shadowBlur = 20;
            ctx.shadowColor = task.color;
          } else if (task.powerUp) {
             // Use power-up color for the task text if it has a power-up
             let powerUpColor = '';
             switch(task.powerUp) {
                 case 'slow': powerUpColor = '#34d399'; break;
                 case 'shield': powerUpColor = '#60a5fa'; break;
                 case 'double': powerUpColor = '#fbbf24'; break;
             }
             ctx.fillStyle = powerUpColor;
          } else {
            ctx.fillStyle = task.color;
          }
          
          ctx.fillText(task.text, task.x, task.y);
          ctx.shadowBlur = 0; // Reset

          // Check collision (bottom)
          if (task.y > CANVAS_HEIGHT) {
            stateRef.current.tasks.splice(i, 1);
            
            // Only take damage if shield is NOT active
            const shieldActive = stateRef.current.activeEffects.shield > now;
            if (!shieldActive) {
              setHealth((prev) => {
                const newHealth = prev - 10;
                if (newHealth <= 0) setGameState('gameover');
                return newHealth;
              });
            }
          }
        }

        // Update Particles
        for (let i = stateRef.current.particles.length - 1; i >= 0; i--) {
          const p = stateRef.current.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.05;

          if (p.life <= 0) {
            stateRef.current.particles.splice(i, 1);
          } else {
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const startGame = () => {
    setScore(0);
    setHealth(100);
    setLevel(1);
    setInputValue('');
    setActiveEffects({ slow: 0, shield: 0, double: 0 });
    stateRef.current.tasks = [];
    stateRef.current.particles = [];
    setGameState('playing');
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#0a0a0a] text-white font-mono overflow-hidden">
      {/* Navbar */}
      <nav className="bg-[#151619] border-b border-gray-800 p-4 flex justify-between items-center shrink-0 z-30 shadow-md">
        <div className="flex items-center gap-6">
            {gameState !== 'menu' && (
              <button
                onClick={() => setGameState('menu')}
                className="bg-[#0a0a0a] border border-gray-700 p-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
                title="Back to Menu"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            
            {/* Score */}
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
                <Terminal className="text-blue-500 w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Score</div>
                <div className="text-xl font-bold leading-none">{score.toString().padStart(6, '0')}</div>
              </div>
            </div>

            {/* Level */}
            <div className="flex items-center gap-3 border-l border-gray-800 pl-6">
              <div className="bg-purple-500/10 p-2 rounded-lg border border-purple-500/20">
                <Cpu className="text-purple-500 w-5 h-5" />
              </div>
              <div className="min-w-[100px]">
                <div className="flex justify-between items-baseline mb-1">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Level {level}</div>
                  <div className="text-[10px] text-gray-400 font-mono">
                    {score - (level - 1) * 500}/{500}
                  </div>
                </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-purple-500 h-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, ((score - (level - 1) * 500) / 500) * 100))}%` }}
                  />
                </div>
              </div>
            </div>
        </div>

        <div className="flex items-center gap-6">
            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg border border-gray-800 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
              title={`Sound ${soundEnabled ? 'On' : 'Off'} (M)`}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* Active Power-ups */}
            <div className="flex gap-2">
              {activeEffects.slow > currentTime && (
                <div className="bg-emerald-900/80 border border-emerald-500/50 px-3 py-1.5 rounded-lg flex flex-col items-center gap-1 shadow-lg backdrop-blur-sm min-w-[80px]">
                  <div className="text-emerald-400 font-bold text-[10px]">SLOW</div>
                  <div className="w-full bg-emerald-900/50 h-1 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-400 h-full transition-all duration-100" 
                      style={{ width: `${Math.min(100, Math.max(0, (activeEffects.slow - currentTime) / 100))}%` }} 
                    />
                  </div>
                </div>
              )}
              {activeEffects.shield > currentTime && (
                <div className="bg-blue-900/80 border border-blue-500/50 px-3 py-1.5 rounded-lg flex flex-col items-center gap-1 shadow-lg backdrop-blur-sm min-w-[80px]">
                  <div className="text-blue-400 font-bold text-[10px]">SHIELD</div>
                  <div className="w-full bg-blue-900/50 h-1 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-400 h-full transition-all duration-100" 
                      style={{ width: `${Math.min(100, Math.max(0, (activeEffects.shield - currentTime) / 100))}%` }} 
                    />
                  </div>
                </div>
              )}
              {activeEffects.double > currentTime && (
                <div className="bg-amber-900/90 border border-amber-500 px-3 py-1.5 rounded-lg flex flex-col items-center gap-1 shadow-[0_0_15px_rgba(251,191,36,0.4)] backdrop-blur-sm min-w-[100px] animate-pulse">
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <div className="text-amber-400 font-bold text-[10px]">2X SCORE</div>
                  </div>
                  <div className="w-full bg-amber-900/50 h-1 rounded-full overflow-hidden mt-0.5">
                    <div 
                      className="bg-amber-400 h-full transition-all duration-100" 
                      style={{ width: `${Math.min(100, Math.max(0, (activeEffects.double - currentTime) / 100))}%` }} 
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Health */}
            <div className="flex items-center gap-3 border-l border-gray-800 pl-6">
               <div className={`p-2 rounded-lg border ${health < 30 ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20'}`}>
                 <Activity className={`${health < 30 ? 'text-red-500 animate-pulse' : 'text-green-500'} w-5 h-5`} />
               </div>
               <div className="w-32">
                 <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-bold">Buffer Integrity</div>
                 <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                   <div 
                     className={`h-full transition-all duration-300 ${health < 30 ? 'bg-red-500' : 'bg-green-500'}`} 
                     style={{ width: `${health}%` }}
                   />
                 </div>
               </div>
            </div>
        </div>
      </nav>

      {/* Main Game Area */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-4 overflow-hidden bg-[#0a0a0a]">
        
        {/* Canvas Layer */}
        <div className="relative border-2 border-gray-800 rounded-xl overflow-hidden shadow-2xl bg-[#151619] h-full w-full max-w-5xl aspect-[4/3] max-h-[70vh]">
          <canvas 
            ref={canvasRef} 
            width={CANVAS_WIDTH} 
            height={CANVAS_HEIGHT}
            className="block w-full h-full object-contain"
          />
          
          {/* Scanline Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[5] bg-[length:100%_2px,3px_100%] opacity-20"></div>
        </div>

        {/* Input Area */}
        <div className="mt-6 w-full max-w-2xl relative z-20">
          <form onSubmit={handleInputSubmit} className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-green-500 font-bold">{'>'}</span>
            </div>
            <motion.input
              animate={inputError ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.3 }}
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={gameState === 'playing' ? "Type answer..." : "System Offline"}
              disabled={gameState !== 'playing'}
              autoFocus
              maxLength={gameMode === 'stream' ? 3 : undefined}
              className={`w-full bg-[#151619] border-2 text-white font-mono text-lg rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-1 transition-all placeholder-gray-600 ${
                inputError 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-700 focus:border-green-500 focus:ring-green-500'
              }`}
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span className="text-xs text-gray-500 animate-pulse">_</span>
            </div>
          </form>
          
          {/* Keyboard Shortcuts Hint */}
          <div className="flex justify-center gap-6 mt-3 text-[10px] text-gray-500 font-mono uppercase tracking-wider">
            <span className="flex items-center gap-1"><kbd className="bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700 text-gray-300">ESC</kbd> Menu</span>
            <span className="flex items-center gap-1"><kbd className="bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700 text-gray-300">R</kbd> Restart</span>
            <span className="flex items-center gap-1"><kbd className="bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700 text-gray-300">M</kbd> Mute</span>
          </div>
        </div>

        {/* Overlays */}
        <AnimatePresence>
          {gameState === 'menu' && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/80 z-50 backdrop-blur-sm"
            >
              <div className="bg-[#151619] border border-gray-700 p-8 rounded-2xl max-w-2xl w-full text-center shadow-2xl">
                <div className="mb-6 flex justify-center">
                  <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/30">
                    <Zap className="w-10 h-10 text-blue-500" />
                  </div>
                </div>
                <h1 className="text-4xl font-bold mb-2 tracking-tight">SYSTEM INITIALIZATION</h1>
                <p className="text-gray-400 mb-8">Select a protocol to begin processing.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* CPU Overload Card */}
                  <button 
                    onClick={() => setGameMode('cpu')}
                    className={`p-6 rounded-xl border-2 transition-all text-left group ${
                      gameMode === 'cpu' 
                        ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
                        : 'border-gray-800 bg-gray-900/50 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Cpu className={`w-6 h-6 ${gameMode === 'cpu' ? 'text-blue-400' : 'text-gray-500'}`} />
                      <div>
                        <h3 className={`font-bold text-lg leading-none ${gameMode === 'cpu' ? 'text-white' : 'text-gray-300'}`}>CPU Overload</h3>
                        <div className="text-xs text-gray-500 mt-1 font-mono">
                          High Score ({difficulty}): {highScores.cpu[difficulty]}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors">
                      Solve math & logic puzzles before they crash the system.
                    </p>
                  </button>

                  {/* Data Stream Card */}
                  <button 
                    onClick={() => setGameMode('stream')}
                    className={`p-6 rounded-xl border-2 transition-all text-left group ${
                      gameMode === 'stream' 
                        ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.2)]' 
                        : 'border-gray-800 bg-gray-900/50 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Activity className={`w-6 h-6 ${gameMode === 'stream' ? 'text-cyan-400' : 'text-gray-500'}`} />
                      <div>
                        <h3 className={`font-bold text-lg leading-none ${gameMode === 'stream' ? 'text-white' : 'text-gray-300'}`}>Data Stream</h3>
                        <div className="text-xs text-gray-500 mt-1 font-mono">
                          High Score ({difficulty}): {highScores.stream[difficulty]}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors">
                      Type the incoming data packets as fast as possible.
                    </p>
                  </button>
                </div>

                <div className="flex justify-center gap-2 mb-8">
                  {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
                        difficulty === d 
                          ? 'bg-white text-black shadow-lg scale-105' 
                          : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={startGame}
                    className={`w-full font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                      gameMode === 'cpu' 
                        ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                        : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                    }`}
                  >
                    <Play className="w-5 h-5" />
                    INITIALIZE {gameMode === 'cpu' ? 'CPU' : 'STREAM'}
                  </button>

                  <button 
                    onClick={() => setGameState('tutorial')}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    <GraduationCap className="w-5 h-5" />
                    TRAINING PROTOCOL
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'tutorial' && (
            <Tutorial 
              onComplete={() => setGameState('menu')} 
              onExit={() => setGameState('menu')} 
            />
          )}

          {gameState === 'gameover' && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/90 z-50 backdrop-blur-md"
            >
              <div className="bg-[#151619] border border-red-900/50 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl">
                <div className="mb-6 flex justify-center">
                  <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/30">
                    <Activity className="w-10 h-10 text-red-500" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-2 text-red-500">SYSTEM CRASHED</h2>
                <p className="text-gray-400 mb-6">Buffer overflow detected.</p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <div className="text-xs text-gray-500 uppercase">Final Score</div>
                    <div className="text-2xl font-bold text-white">{score}</div>
                    {score >= highScores[gameMode][difficulty] && score > 0 && (
                      <div className="text-xs text-yellow-500 font-bold mt-1 animate-pulse">NEW HIGH SCORE!</div>
                    )}
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <div className="text-xs text-gray-500 uppercase">Level Reached</div>
                    <div className="text-2xl font-bold text-white">{level}</div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={startGame}
                    className="w-full bg-white text-black hover:bg-gray-200 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    <RotateCcw className="w-5 h-5" />
                    REBOOT SYSTEM
                  </button>
                  
                  <button 
                    onClick={() => setGameState('menu')}
                    className="w-full bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    RETURN TO MENU
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sidebar / Reference */}
      <div className={`fixed right-0 top-0 bottom-0 w-80 bg-[#0f0f11] border-l border-gray-800 transform transition-transform duration-300 z-40 ${showReference ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              Reference
            </h3>
            <button onClick={() => setShowReference(false)} className="text-gray-500 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-8">
            <section>
              <h4 className="text-sm font-bold text-green-500 uppercase tracking-wider mb-3 border-b border-green-500/20 pb-2">Binary (Base 2)</h4>
              <p className="text-xs text-gray-400 mb-3">Prefix: <code className="text-green-400">0b</code>. Uses only 0 and 1.</p>
              <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                <div className="bg-gray-900 p-2 rounded">0b1 = 1</div>
                <div className="bg-gray-900 p-2 rounded">0b10 = 2</div>
                <div className="bg-gray-900 p-2 rounded">0b11 = 3</div>
                <div className="bg-gray-900 p-2 rounded">0b100 = 4</div>
                <div className="bg-gray-900 p-2 rounded">0b101 = 5</div>
                <div className="bg-gray-900 p-2 rounded">0b1000 = 8</div>
              </div>
            </section>

            <section>
              <h4 className="text-sm font-bold text-purple-500 uppercase tracking-wider mb-3 border-b border-purple-500/20 pb-2">Hexadecimal (Base 16)</h4>
              <p className="text-xs text-gray-400 mb-3">Prefix: <code className="text-purple-400">0x</code>. Uses 0-9 and A-F.</p>
              <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                <div className="bg-gray-900 p-2 rounded">0xA = 10</div>
                <div className="bg-gray-900 p-2 rounded">0xB = 11</div>
                <div className="bg-gray-900 p-2 rounded">0xC = 12</div>
                <div className="bg-gray-900 p-2 rounded">0xF = 15</div>
                <div className="bg-gray-900 p-2 rounded">0x10 = 16</div>
                <div className="bg-gray-900 p-2 rounded">0x1F = 31</div>
              </div>
            </section>

            <section>
              <h4 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-3 border-b border-amber-500/20 pb-2">Modulo (%)</h4>
              <p className="text-xs text-gray-400 mb-3">The remainder after division.</p>
              <div className="space-y-2 text-sm font-mono">
                <div className="bg-gray-900 p-2 rounded flex justify-between">
                  <span>10 % 3</span>
                  <span className="text-amber-500">1</span>
                </div>
                <div className="bg-gray-900 p-2 rounded flex justify-between">
                  <span>15 % 5</span>
                  <span className="text-amber-500">0</span>
                </div>
                <div className="bg-gray-900 p-2 rounded flex justify-between">
                  <span>7 % 2</span>
                  <span className="text-amber-500">1</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Toggle Reference Button */}
      {!showReference && (
        <button 
          onClick={() => setShowReference(true)}
          className="fixed right-4 bottom-4 bg-[#151619] border border-gray-700 p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors z-30"
          title="Open Reference"
        >
          <BookOpen className="w-6 h-6 text-gray-400" />
        </button>
      )}
    </div>
  );
}
