import React from 'react';

export const RaikuLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 94 72"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Raiku Logo"
  >
    <path d="M31.5 12 L46.5 12 L65 36 L50 36 L65 54 L94 54 L79 72 L20 72 L5 54 L34 54 L19 36 L34 36 Z" />
  </svg>
);