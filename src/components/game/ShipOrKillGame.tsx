import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";
import {
  Rocket,
  Skull,
  Flame,
  RotateCcw,
  Volume2,
  VolumeX,
  Trophy,
  Zap,
  ShieldAlert,
  ChevronRight,
  X,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  DILEMMA_DECK,
  getPMRank,
  type DilemmaCard,
  type PMRank,
} from "@/data/shipOrKillData";
import { gameSound } from "@/lib/gameSound";

type GameMode = "speedrun" | "gauntlet";
type GameState = "intro" | "playing" | "gameover";

interface DecisionHistoryItem {
  card: DilemmaCard;
  action: "SHIP" | "KILL";
  isCorrect: boolean;
}

export function ShipOrKillGame({ onClose }: { onClose?: () => void }) {
  const [gameState, setGameState] = useState<GameState>("intro");
  const [gameMode, setGameMode] = useState<GameMode>("speedrun");
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [deck, setDeck] = useState<DilemmaCard[]>(() => {
    return [...DILEMMA_DECK].sort(() => Math.random() - 0.5);
  });
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [decisionHistory, setDecisionHistory] = useState<DecisionHistoryItem[]>([]);
  const [lastFeedback, setLastFeedback] = useState<{
    text: string;
    isCorrect: boolean;
    impact: string;
  } | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(() => gameSound.getMuted());
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gks_pm_highscore");
      return saved ? parseInt(saved, 10) || 0 : 0;
    }
    return 0;
  });

  // Motion values for swipe gestures
  const dragX = useMotionValue(0);
  const cardRotate = useTransform(dragX, [-180, 180], [-14, 14]);
  const shipBadgeOpacity = useTransform(dragX, [25, 90], [0, 1]);
  const killBadgeOpacity = useTransform(dragX, [-25, -90], [0, 1]);

  const timerRef = useRef<number | null>(null);

  // Shuffle helper
  const shuffleDeck = () => {
    return [...DILEMMA_DECK].sort(() => Math.random() - 0.5);
  };

  // Start new game
  const startGame = (mode: GameMode) => {
    try {
      gameSound.playTick();
    } catch {}
    const newShuffled = shuffleDeck();
    setDeck(newShuffled);
    setCardIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setLives(3);
    setTimeLeft(30);
    setDecisionHistory([]);
    setLastFeedback(null);
    setGameMode(mode);
    setGameState("playing");
    dragX.set(0);
  };

  // Countdown timer for speedrun
  useEffect(() => {
    if (gameState === "playing" && gameMode === "speedrun") {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [gameState, gameMode]);

  // End Game handler
  const endGame = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    try {
      gameSound.playGameOver();
    } catch {}
    setGameState("gameover");

    setScore((finalScore) => {
      if (finalScore > highScore) {
        setHighScore(finalScore);
        if (typeof window !== "undefined") {
          localStorage.setItem("gks_pm_highscore", finalScore.toString());
        }
      }
      return finalScore;
    });
  }, [highScore]);

  // Process player decision
  const handleDecision = useCallback(
    (action: "SHIP" | "KILL") => {
      if (gameState !== "playing") return;

      const activeDeck = deck.length > 0 ? deck : DILEMMA_DECK;
      const currentCard = activeDeck[cardIndex % activeDeck.length] || DILEMMA_DECK[0]!;

      const isCorrect = currentCard.correct === action;

      if (isCorrect) {
        const streakMultiplier = Math.min(Math.floor(streak / 2) + 1, 4);
        const basePoints = 100;
        const earned = basePoints * streakMultiplier;

        setScore((prev) => prev + earned);
        const newStreak = streak + 1;
        setStreak(newStreak);
        setMaxStreak((prev) => Math.max(prev, newStreak));

        if (newStreak > 1 && newStreak % 3 === 0) {
          try {
            gameSound.playStreak();
          } catch {}
        } else {
          try {
            gameSound.playSuccess();
          } catch {}
        }

        setLastFeedback({
          text: `+${earned} pts! (${streakMultiplier}x Streak)`,
          isCorrect: true,
          impact: currentCard.impact,
        });
      } else {
        try {
          gameSound.playError();
        } catch {}
        setStreak(0);
        setLastFeedback({
          text: "Wrong Call!",
          isCorrect: false,
          impact: currentCard.rationale,
        });

        if (gameMode === "gauntlet") {
          const nextLives = lives - 1;
          setLives(nextLives);
          if (nextLives <= 0) {
            endGame();
            return;
          }
        }
      }

      setDecisionHistory((prev) => [
        ...prev,
        { card: currentCard, action, isCorrect },
      ]);

      // Reset drag motion
      dragX.set(0);

      // Advance card or reshuffle
      if (cardIndex + 1 >= activeDeck.length) {
        setDeck((prev) => [...prev, ...shuffleDeck()]);
      }
      setCardIndex((prev) => prev + 1);
    },
    [cardIndex, deck, endGame, gameMode, gameState, lives, streak, dragX]
  );

  // Keyboard navigation hotkeys (A / ArrowLeft = KILL, D / ArrowRight = SHIP)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;

      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        e.preventDefault();
        handleDecision("SHIP");
      } else if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        e.preventDefault();
        handleDecision("KILL");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, handleDecision]);

  const toggleSound = () => {
    const next = gameSound.toggleMute();
    setIsMuted(next);
  };

  const activeDeck = deck.length > 0 ? deck : DILEMMA_DECK;
  const currentCard = activeDeck[cardIndex % activeDeck.length] || DILEMMA_DECK[0]!;
  const finalRank: PMRank = getPMRank(score);

  return (
    <div className="flex flex-col h-full select-none text-foreground">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-border/60 shrink-0">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-accent/20 px-2.5 py-0.5 font-mono text-[0.65rem] font-bold text-accent uppercase tracking-wider">
            <Zap className="size-3 text-accent animate-pulse" />
            Mini-Game
          </span>
          <h3 className="font-display font-bold text-sm text-foreground">
            Ship or Kill?
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
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

      {/* VIEW 1: INTRO / MENU SCREEN */}
      {gameState === "intro" && (
        <div className="flex-1 flex flex-col justify-between py-3 space-y-3 overflow-y-auto">
          <div className="space-y-3">
            <div className="rounded-2xl border border-accent/30 bg-accent/10 p-3.5 text-center space-y-1.5 relative overflow-hidden">
              <div className="flex justify-center items-center gap-2 text-2xl">
                <span>🚀</span>
                <span className="text-xs font-bold font-mono text-muted-foreground">VS</span>
                <span>❌</span>
              </div>
              <h4 className="font-display font-bold text-sm text-foreground">
                The PM Instinct Gauntlet
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Triage product trade-offs, protect engineering runway, and maximize Product-Market Fit.
              </p>
            </div>

            {/* High score badge */}
            {highScore > 0 && (
              <div className="flex items-center justify-between bg-secondary/60 rounded-xl px-3 py-2 border border-border/50 text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground font-mono text-[0.7rem]">
                  <Trophy className="size-3.5 text-amber-400" />
                  Best Score:
                </span>
                <span className="font-mono font-bold text-foreground text-xs">
                  {highScore} pts ({getPMRank(highScore).title})
                </span>
              </div>
            )}

            {/* Mode selection buttons */}
            <div className="space-y-2 pt-1">
              <p className="font-mono text-[0.65rem] font-bold text-muted-foreground uppercase tracking-wider px-1">
                Choose Mode & Start
              </p>

              <button
                type="button"
                onClick={() => startGame("speedrun")}
                className="w-full group flex items-center justify-between p-3 rounded-2xl border border-border/70 bg-card hover:border-accent hover:bg-accent/10 transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-amber-500/15 text-amber-500 grid place-items-center shrink-0 border border-amber-500/30">
                    <Zap className="size-4" />
                  </div>
                  <div>
                    <span className="block font-bold text-xs text-foreground">
                      ⚡ 30s Speed Run
                    </span>
                    <span className="block text-[0.7rem] text-muted-foreground">
                      Score as many correct calls as possible in 30 seconds.
                    </span>
                  </div>
                </div>
                <ChevronRight className="size-4 text-muted-foreground group-hover:text-accent transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                type="button"
                onClick={() => startGame("gauntlet")}
                className="w-full group flex items-center justify-between p-3 rounded-2xl border border-border/70 bg-card hover:border-accent hover:bg-accent/10 transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-rose-500/15 text-rose-500 grid place-items-center shrink-0 border border-rose-500/30">
                    <ShieldAlert className="size-4" />
                  </div>
                  <div>
                    <span className="block font-bold text-xs text-foreground">
                      🎯 Runway Gauntlet
                    </span>
                    <span className="block text-[0.7rem] text-muted-foreground">
                      3 lives mode. 3 bad roadmap calls and the runway hits $0.
                    </span>
                  </div>
                </div>
                <ChevronRight className="size-4 text-muted-foreground group-hover:text-accent transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          {/* Hotkey hint */}
          <div className="flex items-center justify-center gap-4 text-[0.65rem] font-mono text-muted-foreground pt-2 border-t border-border/40">
            <span><kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border font-bold">A</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border font-bold">←</kbd> Kill</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border font-bold">D</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border font-bold">→</kbd> Ship</span>
          </div>
        </div>
      )}

      {/* VIEW 2: ACTIVE GAMEPLAY */}
      {gameState === "playing" && (
        <div className="flex-1 flex flex-col justify-between py-2 space-y-2">
          {/* Status HUD bar */}
          <div className="flex items-center justify-between px-1 text-xs font-mono">
            {gameMode === "speedrun" ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-500 font-bold border border-amber-500/30">
                <Zap className="size-3.5 animate-pulse" />
                <span>{timeLeft}s remaining</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground text-[0.7rem] mr-1">Runway:</span>
                {[...Array(3)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm transition-opacity ${
                      i < lives ? "opacity-100 scale-105" : "opacity-20 grayscale"
                    }`}
                  >
                    ❤️
                  </span>
                ))}
              </div>
            )}

            {/* Streak & Score */}
            <div className="flex items-center gap-2">
              {streak > 1 && (
                <span className="flex items-center gap-1 font-bold text-[0.68rem] text-orange-400 bg-orange-400/15 px-2 py-0.5 rounded-full border border-orange-400/30 animate-pulse">
                  <Flame className="size-3" />
                  {streak}x
                </span>
              )}
              <span className="font-bold text-accent bg-accent/15 px-2.5 py-0.5 rounded-full border border-accent/30">
                {score} pts
              </span>
            </div>
          </div>

          {/* Dilemma Card Area */}
          <div className="relative flex-1 min-h-[200px] flex items-center justify-center py-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCard.id + "-" + cardIndex}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 60) {
                    handleDecision("SHIP");
                  } else if (info.offset.x < -60) {
                    handleDecision("KILL");
                  }
                }}
                style={{ x: dragX, rotate: cardRotate }}
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
                className="w-full h-full flex flex-col justify-between p-4 rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md shadow-lg cursor-grab active:cursor-grabbing relative overflow-hidden"
              >
                {/* Swipe Overlay Badges */}
                <motion.div
                  style={{ opacity: shipBadgeOpacity }}
                  className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-xl bg-emerald-500 text-white font-mono font-bold text-[0.68rem] shadow-lg uppercase border border-white/20 rotate-6 pointer-events-none"
                >
                  🚀 SHIP IT
                </motion.div>

                <motion.div
                  style={{ opacity: killBadgeOpacity }}
                  className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-xl bg-rose-500 text-white font-mono font-bold text-[0.68rem] shadow-lg uppercase border border-white/20 -rotate-6 pointer-events-none"
                >
                  ❌ KILL IT
                </motion.div>

                {/* Card Category Tag */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-secondary text-muted-foreground font-mono text-[0.65rem] font-semibold border border-border/60">
                    {currentCard.category}
                  </span>
                  <span className="font-mono text-[0.62rem] text-muted-foreground">
                    Card #{cardIndex + 1}
                  </span>
                </div>

                {/* Card Title & Scenario */}
                <div className="space-y-1.5 my-auto">
                  <h4 className="font-display font-bold text-sm sm:text-base text-foreground leading-snug">
                    {currentCard.title}
                  </h4>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    "{currentCard.scenario}"
                  </p>
                </div>

                {/* Micro Feedback Footer */}
                {lastFeedback && (
                  <div
                    className={`mt-2 p-2 rounded-xl text-[0.68rem] font-mono leading-tight border transition-all ${
                      lastFeedback.isCorrect
                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                        : "bg-rose-500/15 border-rose-500/30 text-rose-400"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold">
                      {lastFeedback.isCorrect ? (
                        <CheckCircle2 className="size-3 shrink-0" />
                      ) : (
                        <XCircle className="size-3 shrink-0" />
                      )}
                      <span>{lastFeedback.text}</span>
                    </div>
                    <p className="text-[0.62rem] opacity-90 mt-0.5 pl-4.5">{lastFeedback.impact}</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Action Buttons: KILL (Left) vs SHIP (Right) */}
          <div className="grid grid-cols-2 gap-2.5 pt-1 relative z-30">
            <button
              type="button"
              onClick={() => handleDecision("KILL")}
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-rose-500/15 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/30 hover:border-rose-500 font-mono font-bold text-xs uppercase transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Skull className="size-4" />
              <span>Kill (A / ←)</span>
            </button>

            <button
              type="button"
              onClick={() => handleDecision("SHIP")}
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/30 hover:border-emerald-500 font-mono font-bold text-xs uppercase transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Rocket className="size-4" />
              <span>Ship (D / →)</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW 3: GAME OVER / RESULTS */}
      {gameState === "gameover" && (
        <div className="flex-1 flex flex-col justify-between py-2 space-y-3 overflow-y-auto">
          <div className="space-y-3">
            {/* Rank Award Card */}
            <div className="rounded-2xl border border-accent/40 bg-accent/10 p-3.5 text-center space-y-1.5 relative overflow-hidden">
              <span className="text-3xl block animate-bounce">{finalRank.badge}</span>
              <div>
                <span className="font-mono text-[0.65rem] uppercase font-bold text-accent tracking-wider block">
                  PM Archetype Awarded
                </span>
                <h4 className={`font-display font-extrabold text-base sm:text-lg ${finalRank.color}`}>
                  {finalRank.title}
                </h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {finalRank.tagline}
              </p>
            </div>

            {/* Score & Metrics Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-secondary/60 rounded-xl p-2 border border-border/50 text-center">
                <span className="block font-mono text-[0.6rem] text-muted-foreground uppercase">
                  Final Score
                </span>
                <span className="font-mono font-bold text-sm text-accent">
                  {score}
                </span>
              </div>

              <div className="bg-secondary/60 rounded-xl p-2 border border-border/50 text-center">
                <span className="block font-mono text-[0.6rem] text-muted-foreground uppercase">
                  Max Streak
                </span>
                <span className="font-mono font-bold text-sm text-foreground">
                  {maxStreak}x 🔥
                </span>
              </div>

              <div className="bg-secondary/60 rounded-xl p-2 border border-border/50 text-center">
                <span className="block font-mono text-[0.6rem] text-muted-foreground uppercase">
                  Decisions
                </span>
                <span className="font-mono font-bold text-sm text-foreground">
                  {decisionHistory.filter((d) => d.isCorrect).length}/{decisionHistory.length}
                </span>
              </div>
            </div>

            {/* High score note */}
            {score >= highScore && score > 0 && (
              <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-amber-400 bg-amber-400/10 py-1.5 px-3 rounded-xl border border-amber-400/20">
                <Trophy className="size-3.5" />
                <span>🎉 New Personal Record!</span>
              </div>
            )}
          </div>

          {/* Action buttons: Play Again & Return */}
          <div className="space-y-2 pt-2 border-t border-border/40">
            <button
              type="button"
              onClick={() => startGame(gameMode)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent text-accent-foreground font-mono font-bold text-xs uppercase shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              <span>Play Again ({gameMode === "speedrun" ? "30s" : "Gauntlet"})</span>
            </button>

            <button
              type="button"
              onClick={() => setGameState("intro")}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-secondary/80 text-muted-foreground hover:text-foreground font-mono font-semibold text-xs transition-colors cursor-pointer"
            >
              <span>Back to Mode Select</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
