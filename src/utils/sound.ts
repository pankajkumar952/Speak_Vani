let audioCtx: AudioContext | null = null;
let soundEnabled = true;

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
  localStorage.setItem('speakvaani_sound_enabled', enabled ? 'true' : 'false');
}

export function getSoundEnabled(): boolean {
  const saved = localStorage.getItem('speakvaani_sound_enabled');
  if (saved !== null) {
    soundEnabled = saved === 'true';
  }
  return soundEnabled;
}

function getAudioContext(): AudioContext | null {
  if (!soundEnabled) return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Synthesizes a mechanical reel tick sound
 */
export function playTickSound() {
  playMechanicalReelTick(1.0);
}

/**
 * Velocity-proportional crisp mechanical flip/tick sound
 */
export function playMechanicalReelTick(velocityRatio = 1.0) {
  if (!getSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Frequency modulates slightly with velocity
    const baseFreq = 750 + Math.min(600, velocityRatio * 400);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.025);

    const volume = Math.min(0.18, 0.06 + velocityRatio * 0.1);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.025);
  } catch (_e) {
    // Silent catch
  }
}

/**
 * Satisfying mechanical latch/snap lock sound on final landing
 */
export function playMechanicalLockClick() {
  if (!getSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Dual micro-transient click
    [1200, 480].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = ctx.currentTime + i * 0.018;

      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      osc.frequency.exponentialRampToValueAtTime(80, start + 0.045);

      gain.gain.setValueAtTime(0.24, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.05);
    });
  } catch (_e) {
    // Silent catch
  }
}

/**
 * Synthesizes a winner fanfare chime sound
 */
export function playWinnerSound() {
  if (!getSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const startTime = ctx.currentTime + index * 0.09;
      const duration = 0.35;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch (err) {
    // Silent catch for audio policy restrictions
  }
}

/**
 * Subtle countdown tick (normal mode)
 * @param strong - true for count=1 (stronger accent)
 */
export function playCountdownTick(strong = false) {
  if (!getSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(strong ? 880 : 660, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(strong ? 660 : 440, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(strong ? 0.22 : 0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (strong ? 0.18 : 0.1));

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.22);
  } catch (err) {
    // Silent catch
  }
}

/**
 * Playful kids countdown tick (softer, higher pitched)
 * @param strong - true for count=1
 */
export function playKidsCountdownTick(strong = false) {
  if (!getSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = strong ? [1046.5, 1318.5] : [783.99];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = ctx.currentTime + i * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.18, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.2);
    });
  } catch (err) {
    // Silent catch
  }
}

/**
 * Short "SAY IT" confirmation chime when recording starts.
 * @param isKids - true for playful kids fanfare
 */
export function playCountdownStart(isKids = false) {
  if (!getSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Happy fanfare for kids, cinematic chord rise for normal
    const notes = isKids
      ? [523.25, 659.25, 783.99, 1046.5, 1318.5]
      : [440, 554.37, 659.25, 880];

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = ctx.currentTime + i * 0.07;
      const dur = isKids ? 0.3 : 0.25;

      osc.type = isKids ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(isKids ? 0.22 : 0.15, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + dur + 0.05);
    });
  } catch (err) {
    // Silent catch
  }
}
