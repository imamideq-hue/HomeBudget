import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Lightweight, game-like feedback: a satisfying chime plus a haptic buzz when
 * the user confirms something. Sound + haptics are best-effort and never throw.
 */

let player: AudioPlayer | null = null;

function getPlayer(): AudioPlayer | null {
  if (player) return player;
  try {
    // Allow the chime to play even when the ringer is on silent (iOS).
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
    player = createAudioPlayer(require('../../assets/sounds/success.wav'));
  } catch {
    player = null;
  }
  return player;
}

function chime() {
  try {
    const p = getPlayer();
    if (!p) return;
    p.seekTo(0);
    p.play();
  } catch {
    // Ignore audio errors (e.g. unsupported platform).
  }
}

/** Confirm feedback: chime + a success vibration. Use on saves/additions. */
export function feedbackSuccess() {
  chime();
  if (Platform.OS !== 'web') {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }
}

/** A bigger celebratory buzz for milestones (goal reached). */
export function feedbackCelebrate() {
  chime();
  if (Platform.OS !== 'web') {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setTimeout(
      () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {}),
      180,
    );
  }
}

/** Light selection tick for taps/toggles. */
export function feedbackTap() {
  if (Platform.OS !== 'web') {
    Haptics.selectionAsync().catch(() => {});
  }
}
