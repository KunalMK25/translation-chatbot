import React from 'react';

interface VoiceButtonProps {
  isSupported: boolean;
  isRecording: boolean;
  onClick: () => void;
}

export function VoiceButton({ isSupported, isRecording, onClick }: VoiceButtonProps) {
  if (!isSupported) return null;

  return (
    <button
      className={`mic-btn${isRecording ? ' mic-btn--active' : ''}`}
      aria-label={isRecording ? 'Stop voice input' : 'Start voice input'}
      aria-pressed={isRecording ? 'true' : 'false'}
      onClick={onClick}
      type="button"
    >
      🎤
    </button>
  );
}
