import React, { useEffect, useRef } from 'react';

export const SphereCanvas = ({ className = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.offsetWidth || 400);
    let height = (canvas.height = canvas.offsetHeight || 400);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 400;
      height = canvas.height = canvas.offsetHeight || 400;
    };
    window.addEventListener('resize', handleResize);

    // Generate 3D sphere points (Fibonacci sphere distribution)
    const numPoints = 120;
    const points = [];
    const radius = Math.min(width, height) * 0.38;

    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden ratio angle

    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      points.push({ x: x * radius, y: y * radius, z: z * radius });
    }

    let angleX = 0.003;
    let angleY = 0.005;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Rotation matrix calculation
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      // Rotate all points
      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // Rotate Y
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;

        // Rotate X
        const y1 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        p.x = x1;
        p.y = y1;
        p.z = z2;
      }

      // Draw connecting lines between close 3D points
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const p1 = points[i];
          const p2 = points[j];

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dz = p1.z - p2.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < radius * 0.55) {
            const alpha = (1 - dist / (radius * 0.55)) * 0.4;
            ctx.beginPath();
            ctx.moveTo(centerX + p1.x, centerY + p1.y);
            ctx.lineTo(centerX + p2.x, centerY + p2.y);
            ctx.strokeStyle = `rgba(91, 84, 232, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw nodes / points
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const scale = (p.z + radius) / (2 * radius); // Scale by depth z
        const nodeRadius = 1.5 + scale * 2.5;
        const alpha = 0.3 + scale * 0.7;

        ctx.beginPath();
        ctx.arc(centerX + p.x, centerY + p.y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = i % 3 === 0 ? `rgba(255, 122, 89, ${alpha})` : i % 2 === 0 ? `rgba(6, 182, 212, ${alpha})` : `rgba(91, 84, 232, ${alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#5B54E8';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={`w-full h-full ${className}`} />;
};
