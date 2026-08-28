import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  RotateCcw,
  Undo2,
  Trophy,
  Volume2,
  VolumeX,
  X,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Info,
  ChevronRight,
  Zap,
  Sparkles,
  PartyPopper,
} from "lucide-react";
import { UniversalGameIcon } from "@/components/icons/UniversalGameIcon";
import {
  STARTUP_MILESTONES,
  getMilestone,
  type StartupMilestone,
} from "@/data/startup2048Data";
import { gameSound } from "@/lib/gameSound";

type Board = number[][];
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const BOARD_SIZE = 4;

const CONFETTI_PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: (Math.random() - 0.5) * 220,
  y: -Math.random() * 160 - 30,
  scale: Math.random() * 0.5 + 0.6,
  rotate: Math.random() * 360,
  color: [
    "bg-amber-400",
    "bg-rose-400",
    "bg-indigo-400",
    "bg-emerald-400",
    "bg-sky-400",
    "bg-fuchsia-400",
  ][i % 6]!,
  delay: Math.random() * 0.15,
}));

function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
}

function getRandomEmptyCell(board: Board): { r: number; c: number } | null {
  const emptyCells: { r: number; c: number }[] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r]![c] === 0) {
        emptyCells.push({ r, c });
      }
    }
  }
  if (emptyCells.length === 0) return null;
  return emptyCells[Math.floor(Math.random() * emptyCells.length)]!;
}

function spawnTile(board: Board): Board {
  const cell = getRandomEmptyCell(board);
  if (!cell) return board;
  const newBoard = board.map((row) => [...row]);
  newBoard[cell.r]![cell.c] = Math.random() < 0.9 ? 2 : 4;
  return newBoard;
}

function initGame(): Board {
  let board = createEmptyBoard();
  board = spawnTile(board);
  board = spawnTile(board);
  return board;
}

function isGameOver(board: Board): boolean {
  // Check if any empty cell exists
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r]![c] === 0) return false;
    }
  }
  // Check horizontal and vertical merges
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const val = board[r]![c];
      if (c + 1 < BOARD_SIZE && board[r]![c + 1] === val) return false;
      if (r + 1 < BOARD_SIZE && board[r + 1]![c] === val) return false;
    }
  }
  return true;
}

function getHighestTile(board: Board): number {
  let max = 0;
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r]![c]! > max) {
        max = board[r]![c]!;
      }
    }
  }
  return max;
}

export function Startup2048Game({ onClose }: { onClose?: () => void }) {
  const [board, setBoard] = useState<Board>(() => initGame());
  const [prevBoard, setPrevBoard] = useState<Board | null>(null);
  const [score, setScore] = useState<number>(0);
  const [prevScore, setPrevScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gks_2048_highscore");
      return saved ? parseInt(saved, 10) || 0 : 0;
    }
    return 0;
  });
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [continuePlaying, setContinuePlaying] = useState<boolean>(false);
  const [showCelebrationToast, setShowCelebrationToast] = useState<boolean>(false);
  const [mergedCells, setMergedCells] = useState<Set<string>>(new Set());
  const [isOver, setIsOver] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => gameSound.getMuted());
  const [showMilestonesModal, setShowMilestonesModal] = useState<boolean>(false);

  const boardRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Sync high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      if (typeof window !== "undefined") {
        localStorage.setItem("gks_2048_highscore", score.toString());
      }
    }
  }, [score, highScore]);

  // Movement Logic
  const move = useCallback(
    (dir: Direction) => {
      if (isOver || (hasWon && !continuePlaying)) return;

      let moved = false;
      let scoreGained = 0;
      let reachedUnicornThisMove = false;
      const newBoard = board.map((row) => [...row]);
      const currentMerged = new Set<string>();

      const slideLine = (line: number[]) => {
        // Filter non-zeros
        const nonZero = line.filter((v) => v !== 0);
        const result: number[] = [];
        const mergesInLine: number[] = []; // record index in result where merge occurred
        let i = 0;
        while (i < nonZero.length) {
          if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
            const merged = nonZero[i]! * 2;
            mergesInLine.push(result.length);
            result.push(merged);
            scoreGained += merged;
            if (merged >= 2048 && !hasWon) {
              setHasWon(true);
              reachedUnicornThisMove = true;
            }
            i += 2;
          } else {
            result.push(nonZero[i]!);
            i += 1;
          }
        }
        while (result.length < BOARD_SIZE) {
          result.push(0);
        }
        return { result, mergesInLine };
      };

      if (dir === "LEFT") {
        for (let r = 0; r < BOARD_SIZE; r++) {
          const row = newBoard[r]!;
          const { result: slided, mergesInLine } = slideLine(row);
          if (row.some((val, idx) => val !== slided[idx])) {
            moved = true;
          }
          newBoard[r] = slided;
          mergesInLine.forEach((c) => currentMerged.add(`${r}-${c}`));
        }
      } else if (dir === "RIGHT") {
        for (let r = 0; r < BOARD_SIZE; r++) {
          const row = [...newBoard[r]!].reverse();
          const { result: slidedReversed, mergesInLine } = slideLine(row);
          const slided = [...slidedReversed].reverse();
          if (newBoard[r]!.some((val, idx) => val !== slided[idx])) {
            moved = true;
          }
          newBoard[r] = slided;
          mergesInLine.forEach((reversedC) => {
            const actualC = BOARD_SIZE - 1 - reversedC;
            currentMerged.add(`${r}-${actualC}`);
          });
        }
      } else if (dir === "UP") {
        for (let c = 0; c < BOARD_SIZE; c++) {
          const col = [newBoard[0]![c]!, newBoard[1]![c]!, newBoard[2]![c]!, newBoard[3]![c]!];
          const { result: slided, mergesInLine } = slideLine(col);
          for (let r = 0; r < BOARD_SIZE; r++) {
            if (newBoard[r]![c] !== slided[r]) {
              moved = true;
            }
            newBoard[r]![c] = slided[r]!;
          }
          mergesInLine.forEach((r) => currentMerged.add(`${r}-${c}`));
        }
      } else if (dir === "DOWN") {
        for (let c = 0; c < BOARD_SIZE; c++) {
          const col = [
            newBoard[3]![c]!,
            newBoard[2]![c]!,
            newBoard[1]![c]!,
            newBoard[0]![c]!,
          ];
          const { result: slided, mergesInLine } = slideLine(col);
          for (let r = 0; r < BOARD_SIZE; r++) {
            const mappedVal = slided[3 - r]!;
            if (newBoard[r]![c] !== mappedVal) {
              moved = true;
            }
            newBoard[r]![c] = mappedVal;
          }
          mergesInLine.forEach((reversedR) => {
            const actualR = BOARD_SIZE - 1 - reversedR;
            currentMerged.add(`${actualR}-${c}`);
          });
        }
      }

      if (moved) {
        // Save current board for undo
        setPrevBoard(board.map((r) => [...r]));
        setPrevScore(score);
        setMergedCells(currentMerged);

        // Spawn new tile
        const nextBoard = spawnTile(newBoard);
        setBoard(nextBoard);
        setScore((prev) => prev + scoreGained);

        // Audio & celebration feedback
        try {
          if (reachedUnicornThisMove) {
            gameSound.playVictory();
            setShowCelebrationToast(true);
          } else if (scoreGained > 0) {
            gameSound.playSuccess();
          } else {
            gameSound.playTick();
          }
        } catch {}

        // Check game over
        if (isGameOver(nextBoard)) {
          setIsOver(true);
          try {
            gameSound.playGameOver();
          } catch {}
        }
      }
    },
    [board, continuePlaying, hasWon, isOver, score]
  );

  // Auto-dismiss celebration toast after 5s
  useEffect(() => {
    if (showCelebrationToast) {
      const timer = setTimeout(() => {
        setShowCelebrationToast(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showCelebrationToast]);

  // Undo last move
  const handleUndo = () => {
    if (prevBoard) {
      setBoard(prevBoard);
      setScore(prevScore);
      setPrevBoard(null);
      setIsOver(false);
      try {
        gameSound.playTick();
      } catch {}
    }
  };

  // Restart game
  const handleRestart = () => {
    const newBoard = initGame();
    setBoard(newBoard);
    setPrevBoard(null);
    setScore(0);
    setPrevScore(0);
    setHasWon(false);
    setContinuePlaying(false);
    setShowCelebrationToast(false);
    setIsOver(false);
    try {
      gameSound.playTick();
    } catch {}
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture keys if an input is active
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          move("LEFT");
          break;
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          move("RIGHT");
          break;
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          move("UP");
          break;
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          move("DOWN");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [move]);

  // Touch gestures for mobile/trackpad
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0]!;
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0]!;
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    // Minimum swipe threshold
    if (Math.max(absDx, absDy) > 25) {
      if (absDx > absDy) {
        if (dx > 0) move("RIGHT");
        else move("LEFT");
      } else {
        if (dy > 0) move("DOWN");
        else move("UP");
      }
    }
  };

  const toggleSound = () => {
    const next = gameSound.toggleMute();
    setIsMuted(next);
  };

  const highestTile = getHighestTile(board);
  const currentMilestone = getMilestone(highestTile);

  return (
    <div className="flex flex-col h-full select-none text-foreground">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-2.5 border-b border-border/60 shrink-0">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-accent/20 px-2.5 py-0.5 font-mono text-[0.65rem] font-bold text-accent uppercase tracking-wider">
            <UniversalGameIcon className="size-3 text-accent" />
            2048
          </span>
          <h3 className="font-display font-bold text-sm text-foreground">
            Startup 2048
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowMilestonesModal((prev) => !prev)}
            aria-label="View Milestones Lore"
            title="View Milestones Guide"
            className="grid size-7 shrink-0 place-items-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:border-accent hover:text-accent cursor-pointer"
          >
            <Info className="size-3.5" />
          </button>

          <button
            type="button"
            onClick={toggleSound}
            aria-label={isMuted ? "Unmute sound" : "Mute sound"}
            className="grid size-7 shrink-0 place-items-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:border-accent hover:text-accent cursor-pointer"
          >
            {isMuted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Game"
              className="grid size-7 shrink-0 place-items-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:border-accent hover:text-accent cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* MILESTONES GUIDE OVERLAY */}
      <AnimatePresence>
        {showMilestonesModal && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute inset-0 z-30 bg-card/95 backdrop-blur-md p-4 flex flex-col rounded-3xl overflow-hidden"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <div className="flex items-center gap-1.5">
                <span className="text-base">🦄</span>
                <h4 className="font-display font-bold text-sm text-foreground">
                  Startup Milestones
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowMilestonesModal(false)}
                className="grid size-6 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            </div>

            <p className="text-[0.68rem] text-muted-foreground my-2">
              Merge matching tiles to advance your venture from a midnight sketch to a $1B+ Unicorn!
            </p>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {Object.values(STARTUP_MILESTONES).map((m) => (
                <div
                  key={m.value}
                  className={`flex items-center justify-between p-2 rounded-xl border text-xs ${
                    m.value === highestTile
                      ? "border-accent bg-accent/15 ring-1 ring-accent/50"
                      : "border-border/60 bg-secondary/40"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`size-7 rounded-lg grid place-items-center text-xs font-bold border shrink-0 ${m.bgClass} ${m.borderClass}`}
                    >
                      {m.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-foreground text-xs">{m.label}</span>
                        <span className="font-mono text-[0.62rem] text-muted-foreground">
                          ({m.value})
                        </span>
                      </div>
                      <span className="text-[0.65rem] text-muted-foreground block truncate max-w-[190px]">
                        {m.description}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-[0.62rem] font-semibold text-accent shrink-0">
                    {m.stage}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowMilestonesModal(false)}
              className="mt-2 w-full py-2 rounded-xl bg-accent text-accent-foreground font-mono font-bold text-xs uppercase cursor-pointer"
            >
              Back to Game
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Game Screen */}
      <div className="flex-1 flex flex-col justify-between py-2 space-y-2 overflow-hidden">
        {/* Score & Milestone HUD */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            {/* Current Score */}
            <div className="flex-1 bg-secondary/70 rounded-xl px-2.5 py-1.5 border border-border/50 text-center">
              <span className="block font-mono text-[0.6rem] text-muted-foreground uppercase">
                Score
              </span>
              <span className="font-mono font-extrabold text-sm text-foreground">
                {score}
              </span>
            </div>

            {/* High Score */}
            <div className="flex-1 bg-secondary/70 rounded-xl px-2.5 py-1.5 border border-border/50 text-center">
              <span className="block font-mono text-[0.6rem] text-muted-foreground uppercase flex items-center justify-center gap-1">
                <Trophy className="size-2.5 text-amber-400" />
                Best
              </span>
              <span className="font-mono font-extrabold text-sm text-accent">
                {highScore}
              </span>
            </div>

            {/* Quick Action Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleUndo}
                disabled={!prevBoard}
                title="Undo 1 Move"
                className="grid size-9 place-items-center rounded-xl border border-border/70 bg-card/80 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <Undo2 className="size-4" />
              </button>

              <button
                type="button"
                onClick={handleRestart}
                title="New Game"
                className="grid size-9 place-items-center rounded-xl border border-border/70 bg-card/80 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                <RotateCcw className="size-4" />
              </button>
            </div>
          </div>

          {/* Current Stage Indicator */}
          <div className="flex items-center justify-between bg-card/80 rounded-xl px-2.5 py-1.5 border border-border/60 text-sm">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-lg">{currentMilestone.icon}</span>
              <span className="font-mono font-bold text-foreground truncate text-sm">
                {currentMilestone.label}
              </span>
              <span className="font-mono text-xs text-accent font-semibold hidden sm:inline truncate">
                • {currentMilestone.stage}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowMilestonesModal(true)}
              className="text-xs font-mono text-accent hover:underline flex items-center gap-0.5 shrink-0 cursor-pointer"
            >
              <span>Goal: 🦄 Unicorn</span>
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>

        {/* 4x4 Grid Board */}
        <div
          ref={boardRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative aspect-square w-full max-w-[320px] mx-auto p-2 rounded-2xl bg-secondary/80 border border-border/80 shadow-inner grid grid-cols-4 grid-rows-4 gap-1.5 sm:gap-2 select-none"
        >
          {board.map((row, r) =>
            row.map((val, c) => {
              const milestone = val > 0 ? getMilestone(val) : null;
              const isMerged = mergedCells.has(`${r}-${c}`);
              return (
                <div
                  key={`${r}-${c}`}
                  className={`relative rounded-xl flex flex-col items-center justify-center transition-all duration-150 overflow-hidden ${
                    val === 0
                      ? "bg-background/40 border border-border/30"
                      : `${milestone?.bgClass} ${milestone?.borderClass} border shadow-sm ${milestone?.glowClass || ""}`
                  }`}
                >
                  {val > 0 && milestone && (
                    <motion.div
                      key={`${r}-${c}-${val}-${isMerged ? "m" : "n"}`}
                      initial={
                        isMerged
                          ? { scale: 0.75, opacity: 0.8 }
                          : { scale: 0.7, opacity: 0 }
                      }
                      animate={
                        isMerged
                          ? {
                              scale: [0.8, 1.15, 1],
                              opacity: 1,
                            }
                          : { scale: 1, opacity: 1 }
                      }
                      transition={
                        isMerged
                          ? {
                              duration: 0.25,
                              times: [0, 0.6, 1],
                              ease: ["easeOut", "backOut"],
                            }
                          : { duration: 0.15 }
                      }
                      className="flex flex-col items-center justify-center text-center p-0.5 w-full h-full relative"
                    >
                      {/* Subtle radial pulse ping for merged tiles */}
                      {isMerged && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0.7 }}
                          animate={{ scale: 1.45, opacity: 0 }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                          className="absolute inset-0 rounded-xl bg-accent/30 pointer-events-none"
                        />
                      )}
                      <span className="text-base sm:text-lg leading-none">
                        {milestone.icon}
                      </span>
                      <span
                        className={`font-mono font-extrabold text-xs sm:text-sm leading-tight mt-0.5 truncate max-w-full px-0.5 ${milestone.textClass}`}
                      >
                        {val}
                      </span>
                      <span className="text-[0.625rem] font-medium leading-none opacity-90 truncate max-w-full hidden sm:block">
                        {milestone.label}
                      </span>
                    </motion.div>
                  )}
                </div>
              );
            })
          )}

          {/* Floating Celebration Toast Banner (Non-blocking reward alert) */}
          <AnimatePresence>
            {showCelebrationToast && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 450, damping: 25 }}
                className="absolute top-2 inset-x-2 z-30 flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-gradient-to-r from-amber-500/95 via-rose-500/95 to-indigo-600/95 text-white shadow-xl backdrop-blur-md border border-amber-300/40 ring-1 ring-white/20"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="size-7 rounded-xl bg-white/20 grid place-items-center shrink-0">
                    <PartyPopper className="size-4 text-amber-200 animate-bounce" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <span>🦄 Unicorn Milestone Unlocked!</span>
                    </div>
                    <span className="font-mono text-[0.62rem] text-white/90 truncate block">
                      Valuation: $1B+ • 2048 Reached
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCelebrationToast(false)}
                  className="grid size-6 place-items-center rounded-full bg-white/15 hover:bg-white/30 text-white/90 cursor-pointer transition-colors shrink-0"
                >
                  <X className="size-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Win Overlay Modal with Confetti Particles */}
          {hasWon && !continuePlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-20 bg-background/90 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-2.5 border border-amber-400 overflow-hidden"
            >
              {/* Confetti Particle Burst */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                {CONFETTI_PARTICLES.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{
                      x: 0,
                      y: 0,
                      scale: 0,
                      opacity: 1,
                      rotate: 0,
                    }}
                    animate={{
                      x: p.x,
                      y: p.y,
                      scale: [0, p.scale, p.scale * 0.8],
                      opacity: [1, 1, 0],
                      rotate: p.rotate,
                    }}
                    transition={{
                      duration: 1.4,
                      delay: p.delay,
                      ease: [0.25, 1, 0.5, 1],
                      repeat: Infinity,
                      repeatDelay: 1.2,
                    }}
                    className={`absolute left-1/2 top-1/2 size-2 rounded-sm ${p.color}`}
                  />
                ))}
              </div>

              <span className="text-4xl animate-bounce relative z-10">🦄</span>
              <div className="relative z-10">
                <span className="font-mono text-xs text-amber-500 font-bold uppercase tracking-wider block flex items-center justify-center gap-1">
                  <Sparkles className="size-3 text-amber-500 animate-pulse" />
                  You Built A Unicorn!
                  <Sparkles className="size-3 text-amber-500 animate-pulse" />
                </span>
                <h4 className="font-display font-extrabold text-lg text-foreground">
                  Valuation: $1 Billion+
                </h4>
              </div>
              <p className="text-xs text-muted-foreground max-w-[220px] relative z-10">
                You merged from a 2 AM napkin spark to the ultimate 2048 Unicorn!
              </p>
              <div className="flex items-center gap-2 pt-1 relative z-10">
                <button
                  type="button"
                  onClick={() => setContinuePlaying(true)}
                  className="px-3 py-1.5 rounded-xl bg-accent text-accent-foreground font-mono font-bold text-xs uppercase cursor-pointer shadow-md"
                >
                  Keep Playing (4096+)
                </button>
                <button
                  type="button"
                  onClick={handleRestart}
                  className="px-3 py-1.5 rounded-xl bg-secondary text-foreground font-mono font-semibold text-xs cursor-pointer border border-border"
                >
                  New Game
                </button>
              </div>
            </motion.div>
          )}

          {/* Game Over Overlay Modal */}
          {isOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-20 bg-background/92 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-2 border border-border"
            >
              <span className="text-3xl">📉</span>
              <div>
                <span className="font-mono text-[0.65rem] text-rose-500 font-bold uppercase tracking-wider block">
                  Out of Runway
                </span>
                <h4 className="font-display font-bold text-base text-foreground">
                  Game Over!
                </h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Peak Milestone: <span className="font-bold text-foreground">{currentMilestone.label} ({highestTile})</span>
              </p>
              <div className="flex items-center gap-2 pt-1">
                {prevBoard && (
                  <button
                    type="button"
                    onClick={handleUndo}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-secondary text-foreground font-mono font-semibold text-xs border border-border cursor-pointer hover:border-accent"
                  >
                    <Undo2 className="size-3" />
                    <span>Undo</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleRestart}
                  className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-accent text-accent-foreground font-mono font-bold text-xs uppercase cursor-pointer shadow-md"
                >
                  <RotateCcw className="size-3" />
                  <span>Try Again</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* On-Screen D-Pad / Controls */}
        <div className="flex items-center justify-between pt-1 border-t border-border/40">
          <div className="text-[0.65rem] font-mono text-muted-foreground">
            <span>Swipe or use <kbd className="px-1 py-0.5 rounded bg-secondary border border-border font-bold">Arrow Keys</kbd> / <kbd className="px-1 py-0.5 rounded bg-secondary border border-border font-bold">WASD</kbd></span>
          </div>

          {/* Compact directional button pad for clickers */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => move("LEFT")}
              aria-label="Move Left"
              className="size-7 grid place-items-center rounded-lg bg-secondary/80 hover:bg-accent hover:text-accent-foreground border border-border/70 text-foreground transition-colors cursor-pointer"
            >
              <ArrowLeft className="size-3.5" />
            </button>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => move("UP")}
                aria-label="Move Up"
                className="size-7 grid place-items-center rounded-lg bg-secondary/80 hover:bg-accent hover:text-accent-foreground border border-border/70 text-foreground transition-colors cursor-pointer"
              >
                <ArrowUp className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => move("DOWN")}
                aria-label="Move Down"
                className="size-7 grid place-items-center rounded-lg bg-secondary/80 hover:bg-accent hover:text-accent-foreground border border-border/70 text-foreground transition-colors cursor-pointer"
              >
                <ArrowDown className="size-3.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => move("RIGHT")}
              aria-label="Move Right"
              className="size-7 grid place-items-center rounded-lg bg-secondary/80 hover:bg-accent hover:text-accent-foreground border border-border/70 text-foreground transition-colors cursor-pointer"
            >
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
