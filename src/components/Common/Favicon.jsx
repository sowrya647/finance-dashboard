import React, { useEffect } from 'react';

const Favicon = () => {
  useEffect(() => {
    // Create canvas for favicon
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 64, 64);
    gradient.addColorStop(0, '#3b82f6');
    gradient.addColorStop(1, '#8b5cf6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    
    // Draw shield shape
    ctx.beginPath();
    ctx.moveTo(32, 8);
    ctx.lineTo(52, 16);
    ctx.lineTo(52, 36);
    ctx.lineTo(32, 56);
    ctx.lineTo(12, 36);
    ctx.lineTo(12, 16);
    ctx.closePath();
    ctx.fillStyle = 'white';
    ctx.fill();
    
    // Draw dollar sign
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = gradient;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', 32, 34);
    
    // Convert to favicon
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = canvas.toDataURL();
    document.getElementsByTagName('head')[0].appendChild(link);
  }, []);

  return null;
};

export default Favicon;