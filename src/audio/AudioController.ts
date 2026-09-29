/**
 * Pre-warms and unlocks the browser speech synthesis engine
 * and HTMLAudioElement within a trusted user gesture (e.g. clicking 'Start Recap').
 */
export function unlockAudioSystem(): void {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    try {
      window.speechSynthesis.getVoices();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
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

  constructor() {
    if (typeof window !== "undefined") {
      (window as any).__catchupAudio = this;
      this.mediaElement = new Audio();
      this.mediaElement.preload = "auto";
      this.mediaElement.onended = () => {
        this.isMediaPaused = false;
      };
      this.mediaElement.onerror = (e) => {
        console.warn("Audio media element notice:", e);
        this.isMediaPaused = false;
      };
    }
  }

  /**
   * Plays a pre-recorded audio file (e.g. ElevenLabs Awang voice MP3).
   * Automatically stops any active browser speech synthesis and ensures
   * only one audio stream plays at a time.
   */
  playClip(src: string, offsetSec: number = 0): void {
    if (!src) {
      return;
    }

    // Immediately stop and cancel any active speech synthesis
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.currentText = "";
      this.isSpeechPaused = false;
    }

    if (!this.mediaElement) {
      return;
    }

    const clampedOffset = Math.max(0, offsetSec);

    // If already playing the exact same source
    if (this.currentAudioSrc === src && this.mediaElement.src.includes(src)) {
      // If paused, resume
      if (this.isMediaPaused || this.mediaElement.paused) {
        this.seekMedia(clampedOffset);
        this.isMediaPaused = false;
        this.isMediaActive = true;
        this.mediaElement.play().catch((err) => {
          console.warn("Audio resume notice:", err);
        });
        return;
      }

      // If active and offset differs significantly (>0.5s), seek
      if (Math.abs(this.mediaElement.currentTime - clampedOffset) > 0.5) {
        this.seekMedia(clampedOffset);
      }
      return;
    }

    // Switch to new audio source
    this.mediaElement.pause();
    this.currentAudioSrc = src;
    this.mediaElement.src = src;
    this.isMediaPaused = false;
    this.isMediaActive = true;

    this.seekMedia(clampedOffset);
    this.mediaElement.play().catch((err) => {
      console.warn("Audio play notice:", err);
    });
  }

  /**
   * Seeks the active media element to a specific offset in seconds.
   */
  seekClip(src: string, offsetSec: number, isPlaying: boolean): void {
    // Immediately stop and cancel any active speech synthesis
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.currentText = "";
      this.isSpeechPaused = false;
    }

    if (!this.mediaElement) {
      return;
    }

    const clampedOffset = Math.max(0, offsetSec);

    // If source doesn't match current, load it
    if (this.currentAudioSrc !== src || !this.mediaElement.src.includes(src)) {
      this.mediaElement.pause();
      this.currentAudioSrc = src;
      this.mediaElement.src = src;
      this.isMediaActive = true;
    }

    // Check if offset exceeds known duration
    if (this.mediaElement.duration && clampedOffset >= this.mediaElement.duration) {
      this.mediaElement.pause();
      this.isMediaPaused = true;
      return;
    }

    this.seekMedia(clampedOffset);

    if (isPlaying) {
      this.isMediaPaused = false;
      this.isMediaActive = true;
      this.mediaElement.play().catch((err) => {
        console.warn("Audio play after seek notice:", err);
      });
    } else {
      this.mediaElement.pause();
      this.isMediaPaused = true;
    }
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
   * Existing speech synthesis fallback for beats without explicit audioSrc.
   */
  speak(text: string): void {
    if (!text) {
      return;
    }

    // Stop any media clip first so they never overlap
    this.stopClip();

    // If speaking the exact same text and we are paused, resume immediately
    if (text === this.currentText && this.isSpeechPaused) {
      this.resume();
      return;
    }
    if (text === this.currentText && typeof window !== "undefined" && window.speechSynthesis?.speaking) {
      return;
    }

    this.currentText = text;
    this.isSpeechPaused = false;
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }

    const synth = window.speechSynthesis;

    // Unpause if stuck in a paused state
    if (synth.paused) {
      synth.resume();
    }
    if (synth.speaking || synth.pending) {
      synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.96;
    utterance.pitch = 1;
    utterance.lang = "en-GB";

    utterance.onend = () => {
      this.isSpeechPaused = false;
    };
    utterance.onerror = (e) => {
      console.warn("SpeechSynthesis utterance notice:", e);
      this.isSpeechPaused = false;
    };

    // Dispatch speech immediately
    synth.speak(utterance);

    // Safeguard for Chromium quirk where speak() queues while synth is silently paused
    if (synth.paused) {
      synth.resume();
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
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}
