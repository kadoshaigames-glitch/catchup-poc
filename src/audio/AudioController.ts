/**
 * Pre-warms and unlocks the browser speech synthesis engine
 * and HTMLAudioElement within a trusted user gesture (e.g. clicking 'Start Recap').
 */

let sharedAudioController: AudioController | null = null;

export function getSharedAudioController(): AudioController {
  if (!sharedAudioController && typeof window !== "undefined") {
    sharedAudioController = new AudioController();
  }
  return sharedAudioController!;
}

export function unlockAudioSystem(firstAudioSrc?: string): void {
  if (typeof window === "undefined") return;

  const ctrl = getSharedAudioController();
  ctrl.unlock(firstAudioSrc);

  if (window.speechSynthesis) {
    try {
      window.speechSynthesis.getVoices();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      // Speak a micro-pause utterance inside the trusted user interaction to permanently unlock Web Speech
      const primer = new SpeechSynthesisUtterance(" ");
      primer.volume = 0.01;
      primer.rate = 10;
      window.speechSynthesis.speak(primer);
    } catch {
      // ignore
    }
  }
}

export class AudioController {
  private currentText = "";
  private isSpeechPaused = false;

  private mediaElement: HTMLAudioElement | null = null;
  private currentAudioSrc = "";
  private isMediaPaused = false;
  private isMediaActive = false;

  /**
   * Reference voice samples reserved exclusively for voice cloning and TTS replication.
   * Under no circumstances may these be played as learner-facing lesson narration.
   */
  private static readonly VOICE_REFERENCE_ONLY_SAMPLES = new Set([
    "Awang-intro.mp3",
    `${import.meta.env.BASE_URL}assets/audio/awang/Awang-intro.mp3`
  ]);

  private isVoiceReferenceSample(src?: string): boolean {
    if (!src) return false;
    return (
      AudioController.VOICE_REFERENCE_ONLY_SAMPLES.has(src) ||
      src.toLowerCase().includes("awang-intro")
    );
  }

  private knownDurations: Record<string, number> = {
    // Module 1 (10 cues)
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-1/welcome.mp3`]: 30.537,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-1/definitions.mp3`]: 42.136,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-1/layers.mp3`]: 33.593,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-1/history.mp3`]: 29.231,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-1/prediction.mp3`]: 47.569,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-1/platforms.mp3`]: 41.535,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-1/cre.mp3`]: 48.927,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-1/walkthrough.mp3`]: 31.739,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-1/takeaway.mp3`]: 30.955,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-1/assessment.mp3`]: 5.538,

    // Module 2 (9 cues)
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-2/intro.mp3`]: 28.447,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-2/workflow.mp3`]: 26.854,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-2/master-prompt.mp3`]: 22.857,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-2/multi-doc.mp3`]: 26.906,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-2/variance.mp3`]: 28.212,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-2/exceptions.mp3`]: 25.417,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-2/validation.mp3`]: 21.656,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-2/takeaways.mp3`]: 21.76,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-2/assessment.mp3`]: 5.878,

    // Module 3 (9 cues)
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-3/intro.mp3`]: 21.473,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-3/anatomy.mp3`]: 21.473,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-3/persona.mp3`]: 19.017,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-3/grounding.mp3`]: 22.831,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-3/prompt-design.mp3`]: 19.096,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-3/stress-testing.mp3`]: 21.838,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-3/escalation.mp3`]: 23.092,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-3/takeaways.mp3`]: 22.831,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-3/assessment.mp3`]: 5.59,

    // Module 4 (9 cues)
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-4/intro.mp3`]: 22.962,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-4/workflow.mp3`]: 29.1,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-4/tool-stack.mp3`]: 16.98,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-4/prompt-deck.mp3`]: 19.487,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-4/visual-storytelling.mp3`]: 25.522,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-4/report-generation.mp3`]: 25.469,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-4/quality-control.mp3`]: 17.842,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-4/takeaways.mp3`]: 21.76,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-4/assessment.mp3`]: 5.773,

    // Module 5 (8 cues)
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-5/intro.mp3`]: 29.179,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-5/pillars.mp3`]: 22.021,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-5/aige-framework.mp3`]: 29.179,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-5/data-handling.mp3`]: 27.742,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-5/enterprise-optout.mp3`]: 22.126,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-5/red-lines.mp3`]: 19.435,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-5/takeaways.mp3`]: 22.073,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-5/assessment.mp3`]: 6.374,

    // Module 6 (10 cues)
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-6/intro.mp3`]: 35.579,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-6/pipeline.mp3`]: 30.119,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-6/identify-friction.mp3`]: 25.652,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-6/tool-matching.mp3`]: 28.944,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-6/validation-audit.mp3`]: 29.962,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-6/roi-formulation.mp3`]: 27.455,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-6/propose-pitch.mp3`]: 24.033,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-6/30day-commitment.mp3`]: 26.776,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-6/completion.mp3`]: 39.549,
    [`${import.meta.env.BASE_URL}assets/audio/awang/module-6/assessment.mp3`]: 6.949,
  };

  private activeCueId = "";
  private cueStartSec = 0;
  private cueDurationSec = 0;
  private currentSeekToken = 0;
  private isSpeechActive = false;
  private speechStartTimestamp = 0;

  private wordListeners = new Set<(charIndex: number, text: string) => void>();

  constructor() {
    if (typeof window !== "undefined") {
      (window as any).__catchupAudio = this;
      this.mediaElement = new Audio();
      this.mediaElement.preload = "auto";
      this.mediaElement.onended = () => {
        this.isMediaPaused = false;
        this.isMediaActive = false;
      };
      this.mediaElement.onerror = (e) => {
        console.warn("Audio media element notice:", e);
        this.isMediaPaused = false;
      };
      this.mediaElement.onloadedmetadata = () => {
        if (this.mediaElement && this.currentAudioSrc && this.mediaElement.duration > 0) {
          this.knownDurations[this.currentAudioSrc] = this.mediaElement.duration;
        }
      };
    }
  }

  /**
   * Prime and unlock the media element within a user gesture.
   */
  unlock(audioSrc?: string): void {
    if (!this.mediaElement) return;

    if (audioSrc && !this.isVoiceReferenceSample(audioSrc)) {
      if (this.currentAudioSrc !== audioSrc) {
        this.currentAudioSrc = audioSrc;
        this.mediaElement.src = audioSrc;
      }
      this.mediaElement.load();

      try {
        const p = this.mediaElement.play();
        if (p !== undefined) {
          p.then(() => {
            if (!this.isMediaActive && this.mediaElement) {
              this.mediaElement.pause();
              this.mediaElement.currentTime = 0;
            }
          }).catch(() => {
            // Handled - user gesture unlock attempted
          });
        }
      } catch {
        // ignore
      }
    }
  }

  onWordBoundary(cb: (charIndex: number, text: string) => void): () => void {
    this.wordListeners.add(cb);
    return () => this.wordListeners.delete(cb);
  }

  /**
   * Returns current playback time of the audio media element in seconds,
   * available whether playing or paused as long as media is active and ready.
   */
  getMediaPlaybackTime(src?: string): number | null {
    if (
      this.mediaElement &&
      this.isMediaActive &&
      this.mediaElement.readyState >= 1 &&
      (!src || this.currentAudioSrc.includes(src))
    ) {
      return this.mediaElement.currentTime;
    }
    return null;
  }

  /**
   * Returns duration of current media element if available, or null.
   * Checks known precached durations first to guarantee instantaneous zero-latency access.
   */
  getMediaDuration(src?: string): number | null {
    if (src) {
      for (const [key, dur] of Object.entries(this.knownDurations)) {
        if (src.includes(key) || key.includes(src)) return dur;
      }
    }
    if (
      this.mediaElement &&
      (!src || this.currentAudioSrc.includes(src)) &&
      this.mediaElement.duration &&
      !isNaN(this.mediaElement.duration) &&
      this.mediaElement.duration > 0
    ) {
      if (src) this.knownDurations[src] = this.mediaElement.duration;
      return this.mediaElement.duration;
    }
    return null;
  }

  /**
   * Authoritative global playback clock for the active narration cue.
   * Returns cueStartSec + localAudioTime, or null if no narration is playing.
   */
  getAuthoritativeGlobalTime(): number | null {
    if (this.isMediaActive && this.mediaElement && this.mediaElement.readyState >= 1) {
      if (!this.mediaElement.ended) {
        return this.cueStartSec + this.mediaElement.currentTime;
      }
    }
    if (this.isSpeechActive && !this.isSpeechPaused) {
      const elapsed = (performance.now() - this.speechStartTimestamp) / 1000;
      return this.cueStartSec + elapsed;
    }
    return null;
  }

  getActiveCueId(): string {
    return this.activeCueId;
  }

  getCueDuration(): number {
    return this.cueDurationSec;
  }

  getIsPaused(): boolean {
    if (this.isMediaActive && this.mediaElement) {
      return this.mediaElement.paused || this.isMediaPaused;
    }
    if (this.isSpeechActive) {
      return this.isSpeechPaused;
    }
    return this.isMediaPaused || this.isSpeechPaused;
  }

  private notifyWordBoundary(charIndex: number, text: string): void {
    for (const listener of this.wordListeners) {
      try {
        listener(charIndex, text);
      } catch {
        // ignore
      }
    }
  }

  /**
   * Plays a pre-recorded audio file (e.g. ElevenLabs Awang voice MP3).
   * Automatically stops any active browser speech synthesis and ensures
   * only one audio stream plays at a time.
   */
  playClip(
    src: string,
    offsetSec: number = 0,
    onPlayStarted?: () => void,
    onEnded?: () => void,
    cueInfo?: { cueId: string; startSec: number; durationSec?: number }
  ): void {
    if (!src || this.isVoiceReferenceSample(src)) {
      if (src && this.isVoiceReferenceSample(src)) {
        console.warn(
          `[AudioController] Blocked playback of "${src}". Awang-intro.mp3 is marked VOICE_REFERENCE_ONLY and cannot be played as lesson narration.`
        );
      }
      return;
    }

    if (cueInfo) {
      this.activeCueId = cueInfo.cueId;
      this.cueStartSec = cueInfo.startSec;
      this.cueDurationSec = cueInfo.durationSec ?? (this.getMediaDuration(src) ?? 0);
    }

    // Immediately stop and cancel any active speech synthesis
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.currentText = "";
      this.isSpeechPaused = false;
      this.isSpeechActive = false;
    }

    if (this.mediaElement) {
      this.mediaElement.onended = () => {
        this.isMediaPaused = false;
        this.isMediaActive = false;
        onEnded?.();
      };
    }

    if (!this.mediaElement) {
      return;
    }

    const dur = this.getMediaDuration(src);
    const clampedOffset = Math.max(0, dur ? Math.min(dur, offsetSec) : offsetSec);
    this.isMediaActive = true;
    this.isMediaPaused = false;

    // If already playing the exact same source
    if (this.currentAudioSrc === src && this.mediaElement.src.includes(src)) {
      if (this.isMediaPaused || this.mediaElement.paused) {
        this.seekMedia(clampedOffset);
        this.isMediaPaused = false;
        this.isMediaActive = true;
        this.mediaElement.play()
          .then(() => onPlayStarted?.())
          .catch((err) => {
            console.warn("Audio resume notice:", err);
          });
        return;
      }

      if (Math.abs(this.mediaElement.currentTime - clampedOffset) > 0.5) {
        this.seekMedia(clampedOffset);
      }
      onPlayStarted?.();
      return;
    }

    // Switch to new audio source
    this.mediaElement.pause();
    this.currentAudioSrc = src;
    this.mediaElement.src = src;
    this.isMediaPaused = false;
    this.isMediaActive = true;

    if (clampedOffset > 0) {
      this.seekMedia(clampedOffset);
    } else {
      try {
        this.mediaElement.currentTime = 0;
      } catch {
        // ignore
      }
    }

    const doPlay = () => {
      if (!this.mediaElement) return;
      const playPromise = this.mediaElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            onPlayStarted?.();
          })
          .catch((err) => {
            console.warn("Audio play notice:", err);
            if (err.name === "NotAllowedError") {
              const retryOnClick = () => {
                document.removeEventListener("click", retryOnClick);
                document.removeEventListener("keydown", retryOnClick);
                if (this.mediaElement && this.isMediaActive && !this.isMediaPaused) {
                  this.mediaElement.play()
                    .then(() => onPlayStarted?.())
                    .catch(() => {});
                }
              };
              document.addEventListener("click", retryOnClick, { once: true });
              document.addEventListener("keydown", retryOnClick, { once: true });
            }
          });
      }
    };

    doPlay();
  }

  /**
   * Seeks the active media element to a specific offset in seconds.
   * Uses generation tokens to protect against asynchronous race conditions.
   */
  seekClip(
    src: string,
    offsetSec: number,
    isPlaying: boolean,
    token?: number,
    cueInfo?: { cueId: string; startSec: number; durationSec?: number }
  ): void {
    if (!src || this.isVoiceReferenceSample(src)) {
      if (src && this.isVoiceReferenceSample(src)) {
        console.warn(
          `[AudioController] Blocked seek of "${src}". Awang-intro.mp3 is marked VOICE_REFERENCE_ONLY and cannot be played as lesson narration.`
        );
      }
      this.stopClip();
      return;
    }

    if (token !== undefined) {
      this.currentSeekToken = token;
    }
    const currentToken = this.currentSeekToken;

    // Immediately stop and cancel any active speech synthesis
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.currentText = "";
      this.isSpeechPaused = false;
      this.isSpeechActive = false;
    }

    if (cueInfo) {
      this.activeCueId = cueInfo.cueId;
      this.cueStartSec = cueInfo.startSec;
      this.cueDurationSec = cueInfo.durationSec ?? (this.getMediaDuration(src) ?? 0);
    }

    if (!this.mediaElement) {
      return;
    }

    const dur = this.getMediaDuration(src);
    const clampedOffset = Math.max(0, dur ? Math.min(dur, offsetSec) : offsetSec);

    // If source matches current
    if (this.currentAudioSrc === src && this.mediaElement.src.includes(src)) {
      this.isMediaActive = true;
      try {
        this.mediaElement.currentTime = clampedOffset;
      } catch (e) {
        console.warn("Audio seek error:", e);
      }

      if (isPlaying) {
        this.isMediaPaused = false;
        if (this.mediaElement.paused) {
          this.mediaElement.play().catch((err) => {
            if (currentToken === this.currentSeekToken) {
              console.warn("Audio play after seek notice:", err);
            }
          });
        }
      } else {
        this.mediaElement.pause();
        this.isMediaPaused = true;
      }
      return;
    }

    // Switch to new audio source
    this.mediaElement.pause();
    this.currentAudioSrc = src;
    this.mediaElement.src = src;
    this.isMediaActive = true;

    const onMeta = () => {
      if (currentToken !== this.currentSeekToken) return;
      this.mediaElement?.removeEventListener("loadedmetadata", onMeta);
      if (!this.mediaElement) return;
      try {
        this.mediaElement.currentTime = clampedOffset;
      } catch {}
      if (isPlaying) {
        this.isMediaPaused = false;
        this.mediaElement.play().catch(() => {});
      } else {
        this.mediaElement.pause();
        this.isMediaPaused = true;
      }
    };

    if (this.mediaElement.readyState >= 1) {
      try {
        this.mediaElement.currentTime = clampedOffset;
      } catch {}
      if (isPlaying) {
        this.isMediaPaused = false;
        this.mediaElement.play().catch(() => {});
      } else {
        this.mediaElement.pause();
        this.isMediaPaused = true;
      }
    } else {
      this.mediaElement.addEventListener("loadedmetadata", onMeta, { once: true });
      this.mediaElement.load();
    }
  }

  /**
   * Seeks speech synthesis for beats without pre-recorded audio.
   */
  seekSpeech(
    text: string,
    offsetSec: number,
    token?: number,
    cueInfo?: { cueId: string; startSec: number; durationSec?: number }
  ): void {
    if (token !== undefined) {
      this.currentSeekToken = token;
    }
    this.stopClip();

    if (cueInfo) {
      this.activeCueId = cueInfo.cueId;
      this.cueStartSec = cueInfo.startSec;
      this.cueDurationSec = cueInfo.durationSec ?? 0;
    }

    let targetText = text;
    if (offsetSec > 0 && cueInfo && cueInfo.durationSec && cueInfo.durationSec > 0) {
      const fraction = Math.min(0.95, offsetSec / cueInfo.durationSec);
      const charIndex = Math.floor(text.length * fraction);
      const spaceIndex = text.indexOf(" ", charIndex);
      if (spaceIndex !== -1 && spaceIndex < text.length - 10) {
        targetText = text.slice(spaceIndex + 1);
      }
    }

    this.isSpeechActive = true;
    this.speechStartTimestamp = performance.now() - (offsetSec * 1000);
    this.speak(targetText, undefined, undefined, cueInfo, offsetSec);
  }

  private seekMedia(offsetSec: number): void {
    if (!this.mediaElement) {
      return;
    }

    if (offsetSec <= 0) {
      try {
        this.mediaElement.currentTime = 0;
      } catch {
        // ignore
      }
      return;
    }

    if (this.mediaElement.readyState >= 1) {
      // HAVE_METADATA or higher
      if (this.mediaElement.duration && offsetSec >= this.mediaElement.duration) {
        this.mediaElement.pause();
        this.isMediaPaused = true;
        return;
      }
      try {
        this.mediaElement.currentTime = offsetSec;
      } catch {
        // ignore
      }
    } else {
      const el = this.mediaElement;
      const targetSrc = this.currentAudioSrc;
      const onMeta = () => {
        el.removeEventListener("loadedmetadata", onMeta);
        if (this.currentAudioSrc === targetSrc) {
          if (el.duration && offsetSec >= el.duration) {
            el.pause();
            this.isMediaPaused = true;
            return;
          }
          try {
            el.currentTime = offsetSec;
          } catch {
            // ignore
          }
        }
      };
      el.addEventListener("loadedmetadata", onMeta);
    }
  }

  /**
   * Stops the media element cleanly.
   */
  stopClip(): void {
    if (this.mediaElement) {
      this.mediaElement.pause();
      try {
        this.mediaElement.currentTime = 0;
      } catch {
        // ignore
      }
    }
    this.currentAudioSrc = "";
    this.isMediaPaused = false;
    this.isMediaActive = false;
  }

  /**
   * Speech synthesis playback for beats without explicit audioSrc.
   */
  speak(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    cueInfo?: { cueId: string; startSec: number; durationSec?: number },
    offsetSec: number = 0
  ): void {
    if (!text) {
      return;
    }

    // Stop any media clip first so they never overlap
    this.stopClip();

    if (cueInfo) {
      this.activeCueId = cueInfo.cueId;
      this.cueStartSec = cueInfo.startSec;
      this.cueDurationSec = cueInfo.durationSec ?? 0;
    }

    this.isSpeechActive = true;
    this.speechStartTimestamp = performance.now() - (offsetSec * 1000);

    // If speaking the exact same text and we are paused, resume immediately
    if (text === this.currentText && this.isSpeechPaused) {
      this.resume();
      onStart?.();
      return;
    }
    if (text === this.currentText && typeof window !== "undefined" && window.speechSynthesis?.speaking) {
      onStart?.();
      return;
    }

    this.currentText = text;
    this.isSpeechPaused = false;
    if (typeof window === "undefined" || !window.speechSynthesis) {
      onStart?.();
      onEnd?.();
      return;
    }

    const synth = window.speechSynthesis;

    // Unpause if stuck in a paused state
    if (synth.paused) {
      synth.resume();
    }

    const dispatchSpeak = () => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        onEnd?.();
        return;
      }
      const s = window.speechSynthesis;
      if (s.paused) {
        s.resume();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.96;
      utterance.pitch = 1;
      utterance.lang = "en-GB";

      utterance.onstart = () => {
        this.speechStartTimestamp = performance.now() - (offsetSec * 1000);
        this.isSpeechActive = true;
        this.isSpeechPaused = false;
        onStart?.();
      };

      utterance.onboundary = (e: SpeechSynthesisEvent) => {
        if (e.name === "word") {
          this.notifyWordBoundary(e.charIndex, text);
        }
      };

      utterance.onend = () => {
        this.isSpeechPaused = false;
        this.isSpeechActive = false;
        this.notifyWordBoundary(text.length, text);
        onEnd?.();
      };

      utterance.onerror = (e) => {
        if (e.error !== "interrupted" && e.error !== "canceled") {
          console.warn("SpeechSynthesis utterance notice:", e);
        }
        this.isSpeechPaused = false;
        this.isSpeechActive = false;
        onEnd?.();
      };

      s.speak(utterance);
      if (s.paused) {
        s.resume();
      }
      onStart?.();
    };

    if (synth.speaking || synth.pending) {
      synth.cancel();
      // Delay dispatch by 25ms to allow Chromium internal speech cancellation to complete cleanly
      setTimeout(dispatchSpeak, 25);
    } else {
      dispatchSpeak();
    }
  }

  pause(): void {
    // Pause media clip if active
    if (this.isMediaActive && this.mediaElement && !this.mediaElement.paused) {
      this.mediaElement.pause();
      this.isMediaPaused = true;
    }

    // Pause speech synthesis if active
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const synth = window.speechSynthesis;
      if (synth.speaking && !synth.paused) {
        synth.pause();
        this.isSpeechPaused = true;
      }
    }
  }

  resume(): void {
    // Resume media clip if active
    if (this.isMediaActive && this.mediaElement) {
      if (this.isMediaPaused || this.mediaElement.paused) {
        this.isMediaPaused = false;
        this.mediaElement.play().catch((err) => {
          console.warn("Audio resume error:", err);
        });
      }
      return;
    }

    // Resume speech synthesis if active
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const synth = window.speechSynthesis;
      if (synth.paused || this.isSpeechPaused) {
        synth.resume();
        this.isSpeechPaused = false;
      }
    }
  }

  cancel(): void {
    this.stopClip();
    this.currentText = "";
    this.isSpeechPaused = false;
    this.isSpeechActive = false;
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}
