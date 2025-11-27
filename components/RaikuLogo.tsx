import React from 'react';

export const RaikuLogo: React.FC<{ className?: string }> = ({ className }) => (
  <img
    src="/logo.png"
    alt="Raiku Logo"
    className={className}
  />
);