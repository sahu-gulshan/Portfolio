/**
 * Web Audio API Synthesizer for Quantum Particle Physics & Positron Transformation
 * Zero external audio files required — 100% synthesized in real-time.
 */

let audioCtx: AudioContext | null = null;
let strainOsc: OscillatorNode | null = null;
let strainGain: GainNode | null = null;
let strainMod: OscillatorNode | null = null;

// Global Audio Mute / Enable State (persisted in localStorage)
let isSoundMuted = false;

if (typeof window !== "undefined") {
  const saved = localStorage.getItem("gks_portfolio_sound_muted");
  if (saved !== null) {
    isSoundMuted = saved === "true";
  }
}

export function isAudioMuted(): boolean {
  return isSoundMuted;
}

export function setAudioMuted(muted: boolean) {
  isSoundMuted = muted;
  if (typeof window !== "undefined") {
    localStorage.setItem("gks_portfolio_sound_muted", muted ? "true" : "false");
    window.dispatchEvent(new CustomEvent("gks-sound-mute-change", { detail: { muted } }));
  }
  if (muted) {
    stopContainmentStrainSound();
  }
}

export function toggleAudioMuted(): boolean {
  const next = !isSoundMuted;
  setAudioMuted(next);
  return next;
}

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined" || isSoundMuted) return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Play a cinematic ambient synth bloom & harmonic glide when the center hero constellation
 * blooms and glides to the right column.
 */
export function playHeroConstellationBloomSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 1. Soft warm sub-bass hum / energy anchor (D2 -> F#2)
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(73.42, now); // D2
    subOsc.frequency.exponentialRampToValueAtTime(92.5, now + 1.2);

    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.exponentialRampToValueAtTime(0.12, now + 0.4);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 2.3);

    // 2. Cinematic major 9th chime bloom: D4 (293.66), F#4 (369.99), A4 (440.0), C#5 (554.37), E5 (659.25)
    const chords = [293.66, 369.99, 440.0, 554.37, 659.25];
    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscHarmonic = ctx.createOscillator();
      const gain = ctx.createGain();
      const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

      osc.type = "sine";
      oscHarmonic.type = "triangle";

      // Gentle pitch glide simulating orbital motion
      const startTime = now + idx * 0.08;
      osc.frequency.setValueAtTime(freq * 0.96, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq, startTime + 0.35);

      oscHarmonic.frequency.setValueAtTime(freq * 1.995, startTime);
      oscHarmonic.frequency.exponentialRampToValueAtTime(freq * 2.0, startTime + 0.35);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.05 / (idx * 0.3 + 1), startTime + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.6);

      // Stereo shift from center (0) toward right (0.45) as it shifts to the right column
      if (panner) {
        panner.pan.setValueAtTime(0, startTime);
        panner.pan.linearRampToValueAtTime(0.4, startTime + 1.2);
        osc.connect(gain);
        oscHarmonic.connect(gain);
        gain.connect(panner);
        panner.connect(ctx.destination);
      } else {
        osc.connect(gain);
        oscHarmonic.connect(gain);
        gain.connect(ctx.destination);
      }

      osc.start(startTime);
      oscHarmonic.start(startTime);
      osc.stop(startTime + 1.7);
      oscHarmonic.stop(startTime + 1.7);
    });

    // 3. Shimmering high-frequency crystalline overtone
    const shimmerOsc = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmerOsc.type = "sine";
    shimmerOsc.frequency.setValueAtTime(1174.66, now + 0.3); // D6
    shimmerOsc.frequency.exponentialRampToValueAtTime(1318.51, now + 1.1); // E6

    shimmerGain.gain.setValueAtTime(0.001, now + 0.3);
    shimmerGain.gain.exponentialRampToValueAtTime(0.03, now + 0.6);
    shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

    shimmerOsc.connect(shimmerGain);
    shimmerGain.connect(ctx.destination);
    shimmerOsc.start(now + 0.3);
    shimmerOsc.stop(now + 1.9);
  } catch {}
}

/**
 * Play a subtle gentle whoosh glide when the constellation glides across to the right.
 */
export function playConstellationGlideSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Filtered noise sweep from center to right
    const bufferSize = ctx.sampleRate * 0.9;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(420, now);
    filter.frequency.exponentialRampToValueAtTime(1850, now + 0.45);
    filter.frequency.exponentialRampToValueAtTime(650, now + 0.9);
    filter.Q.setValueAtTime(2.5, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.045, now + 0.3);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (panner) {
      panner.pan.setValueAtTime(-0.1, now);
      panner.pan.linearRampToValueAtTime(0.55, now + 0.8);
      noiseSource.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(panner);
      panner.connect(ctx.destination);
    } else {
      noiseSource.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
    }

    noiseSource.start(now);
    noiseSource.stop(now + 0.92);
  } catch {}
}

/**
 * Start or update the elastic containment field strain sound effect.
 * Scales pitch and electrical hum as the photon struggles against the boundary.
 */
export function updateContainmentStrainSound(strain: number) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const clampedStrain = Math.max(0, Math.min(1, strain));

    if (clampedStrain < 0.05) {
      stopContainmentStrainSound();
      return;
    }

    const now = ctx.currentTime;

    if (!strainOsc || !strainGain) {
      strainOsc = ctx.createOscillator();
      strainGain = ctx.createGain();
      strainMod = ctx.createOscillator();
      const modGain = ctx.createGain();

      // FM synthesis for buzzing containment force field
      strainOsc.type = "sawtooth";
      strainMod.type = "sine";
      strainMod.frequency.setValueAtTime(35, now);
      modGain.gain.setValueAtTime(25, now);

      strainMod.connect(modGain);
      modGain.connect(strainOsc.frequency);

      strainGain.gain.setValueAtTime(0.001, now);
      strainOsc.connect(strainGain);
      strainGain.connect(ctx.destination);

      strainOsc.start();
      strainMod.start();
    }

    // Dynamic pitch escalation based on strain tension (120Hz -> 540Hz)
    const targetFreq = 120 + clampedStrain * clampedStrain * 420;
    const targetGain = Math.min(0.08, clampedStrain * 0.08);

    strainOsc.frequency.setTargetAtTime(targetFreq, now, 0.04);
    if (strainMod) {
      strainMod.frequency.setTargetAtTime(30 + clampedStrain * 60, now, 0.04);
    }
    strainGain.gain.setTargetAtTime(targetGain, now, 0.04);
  } catch {
    // Gracefully handle browser autoplay restrictions
  }
}

/**
 * Smoothly fade out and stop containment strain hum.
 */
export function stopContainmentStrainSound() {
  try {
    if (strainGain && audioCtx) {
      const now = audioCtx.currentTime;
      strainGain.gain.setTargetAtTime(0.0001, now, 0.06);
      setTimeout(() => {
        if (strainOsc && strainGain && strainGain.gain.value < 0.005) {
          try {
            strainOsc.stop();
            strainOsc.disconnect();
            if (strainMod) {
              strainMod.stop();
              strainMod.disconnect();
            }
          } catch {}
          strainOsc = null;
          strainGain = null;
          strainMod = null;
        }
      }, 120);
    }
  } catch {}
}

/**
 * Play explosive, multi-layered quantum rupture sound effect when the photon breaks free
 * and transforms into a Positron.
 */
export function playPositronTransformationSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    stopContainmentStrainSound();

    // 1. Sub-bass containment rupture pop / thud
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(160, now);
    subOsc.frequency.exponentialRampToValueAtTime(36, now + 0.35);

    subGain.gain.setValueAtTime(0.24, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.4);

    // 2. High-energy Positron phase-shift chirp / frequency glide
    const chirpOsc = ctx.createOscillator();
    const chirpGain = ctx.createGain();
    chirpOsc.type = "triangle";
    chirpOsc.frequency.setValueAtTime(280, now);
    chirpOsc.frequency.exponentialRampToValueAtTime(1850, now + 0.22);
    chirpOsc.frequency.exponentialRampToValueAtTime(2400, now + 0.45);

    chirpGain.gain.setValueAtTime(0.18, now);
    chirpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    chirpOsc.connect(chirpGain);
    chirpGain.connect(ctx.destination);
    chirpOsc.start(now);
    chirpOsc.stop(now + 0.6);

    // 3. Electric plasma arc sizzle (synthesized filtered noise burst)
    const bufferSize = ctx.sampleRate * 0.3;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(4800, now + 0.25);
    filter.Q.setValueAtTime(4.0, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.15, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + 0.3);

    // 4. Harmonic crystalline overtones (High resonance chime)
    const notes = [880, 1320, 1760, 2200];
    notes.forEach((freq, i) => {
      const harmOsc = ctx.createOscillator();
      const harmGain = ctx.createGain();

      harmOsc.type = "sine";
      harmOsc.frequency.setValueAtTime(freq, now + 0.05);

      const startDelay = 0.04 * i;
      harmGain.gain.setValueAtTime(0.001, now);
      harmGain.gain.setValueAtTime(0.06 / (i + 1), now + startDelay);
      harmGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7 + startDelay);

      harmOsc.connect(harmGain);
      harmGain.connect(ctx.destination);

      harmOsc.start(now + startDelay);
      harmOsc.stop(now + 0.8 + startDelay);
    });
  } catch {
    // Safe fallback if audio context fails
  }
}

/**
 * Soft harmonic recombination chime when positron re-enters the Hero chamber
 */
export function playRecombinationSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.35);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  } catch {}
}

/**
 * Crystalline optical lens focus & aperture alignment chime
 * Plays when the positron settles above Section 03 heading and transforms into a lens.
 */
export function playLensTransformationSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Crystal glass harmonic resonance ping
    const glassNotes = [1046.5, 1318.51, 1567.98, 2093.0]; // C6, E6, G6, C7
    glassNotes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      const delay = idx * 0.04;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.setValueAtTime(0.045 / (idx + 1), now + delay);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6 + delay);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + 0.65 + delay);
    });

    // 2. Optical aperture click / mechanical focus latch
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = "triangle";
    clickOsc.frequency.setValueAtTime(2400, now + 0.12);
    clickOsc.frequency.exponentialRampToValueAtTime(400, now + 0.16);

    clickGain.gain.setValueAtTime(0.001, now);
    clickGain.gain.setValueAtTime(0.05, now + 0.12);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);

    clickOsc.start(now + 0.12);
    clickOsc.stop(now + 0.2);
  } catch {}
}

/**
 * Aerodynamic whoosh + sharp wooden dartboard bullseye impact sound
 * Plays when the arrow strikes the center of the dartboard in Section 04.
 */
export function playDartBullseyeSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. High-speed whoosh / flight whistle
    const whooshOsc = ctx.createOscillator();
    const whooshGain = ctx.createGain();
    whooshOsc.type = "sine";
    whooshOsc.frequency.setValueAtTime(800, now);
    whooshOsc.frequency.exponentialRampToValueAtTime(2200, now + 0.08);
    whooshOsc.frequency.exponentialRampToValueAtTime(400, now + 0.14);

    whooshGain.gain.setValueAtTime(0.001, now);
    whooshGain.gain.linearRampToValueAtTime(0.04, now + 0.06);
    whooshGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    whooshOsc.connect(whooshGain);
    whooshGain.connect(ctx.destination);
    whooshOsc.start(now);
    whooshOsc.stop(now + 0.15);

    // 2. Solid dartboard wooden "thunk" / bullseye impact
    const thunkOsc = ctx.createOscillator();
    const thunkGain = ctx.createGain();
    thunkOsc.type = "triangle";
    thunkOsc.frequency.setValueAtTime(280, now + 0.13);
    thunkOsc.frequency.exponentialRampToValueAtTime(65, now + 0.22);

    thunkGain.gain.setValueAtTime(0.001, now);
    thunkGain.gain.setValueAtTime(0.18, now + 0.13);
    thunkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

    thunkOsc.connect(thunkGain);
    thunkGain.connect(ctx.destination);
    thunkOsc.start(now + 0.13);
    thunkOsc.stop(now + 0.28);

    // 3. Metallic / wire resonance chime
    const chimeOsc = ctx.createOscillator();
    const chimeGain = ctx.createGain();
    chimeOsc.type = "sine";
    chimeOsc.frequency.setValueAtTime(1760, now + 0.135); // A6
    chimeOsc.frequency.exponentialRampToValueAtTime(1318.5, now + 0.45); // E6

    chimeGain.gain.setValueAtTime(0.001, now);
    chimeGain.gain.setValueAtTime(0.07, now + 0.135);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

    chimeOsc.connect(chimeGain);
    chimeGain.connect(ctx.destination);
    chimeOsc.start(now + 0.135);
    chimeOsc.stop(now + 0.52);
  } catch {}
}

/**
 * High-tech quantum countdown blip for Section 05 energy charging
 */
export function playPositronChargeTick(pitchFactor: number) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    const freq = 440 + pitchFactor * 880;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.06);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  } catch {}
}

/**
 * Resonant quantum plasma blast explosion sound effect
 * Synthesizes sub-bass impact, plasma noise burst, and harmonic dissipation.
 */
export function playPositronBlastSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 1. Deep Sub-Bass Quantum Shock Impact (180Hz -> 28Hz)
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = "triangle";
    subOsc.frequency.setValueAtTime(180, now);
    subOsc.frequency.exponentialRampToValueAtTime(28, now + 0.5);

    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.setValueAtTime(0.35, now + 0.005);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.75);

    // 2. High-energy Plasma Noise/Crack Blast
    const bufferSize = ctx.sampleRate * 0.45;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.4);
    filter.Q.setValueAtTime(3.5, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.setValueAtTime(0.28, now + 0.005);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    whiteNoise.start(now);

    // 3. Resonant Harmonic Plasma Release Chord (Major/Solar chords)
    const chordFreqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    chordFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + 0.01);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.95, now + 0.9);

      const d = idx * 0.02;
      gain.gain.setValueAtTime(0.001, now + d);
      gain.gain.setValueAtTime(0.06 / (idx + 1), now + 0.01 + d);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9 + d);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + d);
      osc.stop(now + 1.0 + d);
    });
  } catch {}
}

/**
 * Resonant crystalline chime when Positron infuses a diamond waypoint along Section 06 Timeline.
 */
export function playTimelineDiamondChime(index: number) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const basePitches = [587.33, 659.25, 783.99, 880.0, 987.77, 1174.66, 1318.51]; // D5, E5, G5, A5, B5, D6, E6
    const pitch = basePitches[index % basePitches.length];

    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc2.type = "triangle";

    osc.frequency.setValueAtTime(pitch, now);
    osc2.frequency.setValueAtTime(pitch * 2.005, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.setValueAtTime(0.09, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + 0.6);
    osc2.stop(now + 0.6);
  } catch {}
}

/**
 * Cheerful, warm harmonic chord when Positron transforms into a smiley face in Section 08.
 */
export function playSmileyMorphSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const chords = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 major arpeggio
    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq * 0.98, now + idx * 0.045);
      osc.frequency.exponentialRampToValueAtTime(freq, now + idx * 0.045 + 0.08);

      const delay = idx * 0.045;
      gain.gain.setValueAtTime(0.001, now + delay);
      gain.gain.setValueAtTime(0.06, now + delay + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.65);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.7);
    });
  } catch {}
}

/**
 * Organic, gentle sweeping chirp/twinkle when Positron transforms into a firefly in Section 07.
 */
export function playFireflyMorphSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [587.33, 698.46, 880.00]; // D5, F5, A5 soft minor arpeggio
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + idx * 0.06 + 0.15);

      const delay = idx * 0.06;
      gain.gain.setValueAtTime(0.001, now + delay);
      gain.gain.setValueAtTime(0.04, now + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.45);
    });
  } catch {}
}

