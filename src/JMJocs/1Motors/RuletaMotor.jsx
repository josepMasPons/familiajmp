import { useRef, useEffect } from "react";

function esImatge(valor, param) {
  if (param === "I") return true;
  return false;
}

export default function RuletaMotor({
  images,
  param,
  go,
  delay,
  onGuanyador,
  mides,
}) {
  const SIZE = parseInt(mides, 10);
  const R = SIZE / 2;

  const canvasRef = useRef(null);
  const angleRef = useRef(0);
  const animRef = useRef(null);
  const timeoutRef = useRef(null);
  const itemsRef = useRef([]);

  const NUMEROS = images.length;
  const anglePerSector = (2 * Math.PI) / NUMEROS;

  /* ===================== DIBUIX ===================== */

  const drawWheel = (ctx) => {
    ctx.clearRect(0, 0, SIZE, SIZE);

    const centerX = R;
    const centerY = R;

    const contentRadius = R * 0.82;
    const imageSize = R * 0.28;
    const fontSize = Math.min(
      R * 0.15,
      (anglePerSector * R) * 0.55
    );
    const borderWidth = R * 0.03;

    ctx.lineWidth = borderWidth;

    for (let i = 0; i < NUMEROS; i++) {
      const start = angleRef.current + i * anglePerSector;
      const end = start + anglePerSector;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, R - borderWidth, start, end);
      ctx.closePath();
      ctx.fillStyle = `hsl(${(i * 360) / NUMEROS},70%,60%)`;
      ctx.fill();
      ctx.strokeStyle = "#222";
      ctx.stroke();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(start + anglePerSector / 2);

      const item = itemsRef.current[i];

      if (item?.isImage && item.loaded) {
        ctx.drawImage(
          item,
          contentRadius - imageSize / 2,
          -imageSize / 2,
          imageSize,
          imageSize
        );
      } else if (!item?.isImage) {
        ctx.fillStyle = "#000";
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.textAlign = 'end';
        ctx.textBaseline = "middle";
        ctx.fillText(item?.text || "", contentRadius, 0);
      }

      ctx.restore();
    }

    // Fletxa
    const arrowWidth = R * 0.12;
    const arrowHeight = R * 0.18;

    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(R - arrowWidth / 2, R * 0.05);
    ctx.lineTo(R + arrowWidth / 2, R * 0.05);
    ctx.lineTo(R, arrowHeight);
    ctx.closePath();
    ctx.fill();
  };

  /* ===================== PREPARAR ITEMS ===================== */

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    itemsRef.current = images.map((src) => {
      if (esImatge(src, param)) {
        const img = new Image();
        img.src = src;
        img.loaded = false;
        img.isImage = true;
        img.onload = () => {
          img.loaded = true;
          drawWheel(ctx);
        };
        return img;
      } else {
        return { text: src, isImage: false };
      }
    });

    drawWheel(ctx);

    return () => {
      cancelAnimationFrame(animRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [images]);

  /* ===================== GIR PROFESSIONAL ===================== */

  const girarProfessional = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    cancelAnimationFrame(animRef.current);

    const winningIndex = Math.floor(Math.random() * NUMEROS);

    const extraSpins = 5;
    const targetAngle =
      extraSpins * 2 * Math.PI +
      (NUMEROS - winningIndex) * anglePerSector -
      anglePerSector / 2 -
      Math.PI / 2;

    const startAngle = angleRef.current;
    const duration = 4000;
    const startTime = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 4);

      angleRef.current =
        startAngle + targetAngle * easeOut;

      drawWheel(ctx);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        angleRef.current = startAngle + targetAngle;
        drawWheel(ctx);
        if (onGuanyador) onGuanyador(winningIndex);
      }
    };

    animRef.current = requestAnimationFrame(animate);
  };

  /* ===================== CONTROL GO (mateix criteri que Daus) ===================== */

  useEffect(() => {
    if (go !== "On") return;

    const temps = delay === "1" ? 500 : 1000;

    timeoutRef.current = setTimeout(() => {
      girarProfessional();
    }, temps);

    return () => {
      clearTimeout(timeoutRef.current);
      cancelAnimationFrame(animRef.current);
    };

  }, [go]);

  /* ===================== RENDER ===================== */

  return (
    <div style={{ textAlign: "center" }}>
      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        style={{
          border: "4px solid #222",
          borderRadius: "50%",
          boxShadow: "0 0 15px rgba(0,0,0,0.4)",
        }}
      />
    </div>
  );
}