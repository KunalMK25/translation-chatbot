import React from 'react';

interface SpeakButtonProps {
  messageId: string;
  isSupported: boolean;
  isSpeaking: boolean;
  onClick: () => void;
}

export function SpeakButton({ messageId: _messageId, isSupported, isSpeaking, onClick }: SpeakButtonProps) {
  if (!isSupported) return null;

  return (
    <button
      className={`speak-btn${isSpeaking ? ' speak-btn--active' : ''}`}
      aria-label={isSpeaking ? 'Stop speaking' : 'Speak translation'}
      onClick={onClick}
      type="button"
    >
      🔊
    </button>
  );
}
