import React, { useEffect, useRef, useState } from 'react';

/**
 * RedParticleCursor - Desktop Red Ion Embers Cursor Effect
 * Progressive enhancement: Enabled ONLY for desktop fine-pointer non-reduced-motion devices.
 */
export const RedParticleCursor = () => {
  const canvasRef = useRef(null);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Feature & Device checks
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isLargeScreen = window.innerWidth >= 768;
    const saveData = navigator.connection?.saveData === true;

    if (!hasFinePointer || prefersReducedMotion || !isLargeScreen || saveData) {
      setIsEnabled(false);
      return;
    }

    setIsEnabled(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let lastTime = 0;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      // Limit particle generation rate
      const now = performance.now();
      if (now - lastTime < 24) return; // ~40fps emitter rate
      lastTime = now;

      if (particles.length > 25) {
        particles.shift(); // Cap array size for performance
      }

      particles.push({
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 2.5 + 1.2,
        alpha: 0.85,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8 - 0.4, // Slight upward drift
        color: Math.random() > 0.4 ? '#FF2A2A' : '#FF4D3D',
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.035; // Fast decay

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          i--;
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = '#FF2A2A';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!isEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      aria-hidden="true"
    />
  );
};
