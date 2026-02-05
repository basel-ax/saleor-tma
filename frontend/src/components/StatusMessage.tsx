import React from 'react';

interface StatusMessageProps {
  message: string | null;
  onClick: () => void;
  isClosed: boolean;
}

export function StatusMessage({ message, onClick, isClosed }: StatusMessageProps) {
  if (!message) return null;

  return (
    <div className="cafe-status-wrap">
      <div 
        className={`cafe-status js-status ${message ? 'shown' : ''}`}
        onClick={onClick}
      >
        {message}
      </div>
    </div>
  );
}
