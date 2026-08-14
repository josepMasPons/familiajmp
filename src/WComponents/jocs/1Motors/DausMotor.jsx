import { useEffect, useState } from "react";

/**
 * Rotacions EXACTES perquè la cara correcta quedi a dalt
 */
const FACE_ROTATIONS = {
  1: { x: 0, y: 0 },
  2: { x: 0, y: -90 },
  3: { x: 0, y: 180 },
  4: { x: 0, y: 90 },
  5: { x: -90, y: 0 },
  6: { x: 90, y: 0 },
};

export default function DausMotor({ go, delay, onGuanyador, mides }) {
  const SIZE = parseInt(mides, 10);
  const HALF = SIZE / 2;

  const [rolling, setRolling] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [rot1, setRot1] = useState({ x: 0, y: 0 });

  // 🔵 Aquest és l'únic useEffect necessari
  useEffect(() => {

    if (go !== "On") return;

    const temps = delay === "1" ? 1000 : 2500;

    const timeout = setTimeout(() => {
      tirar();
    }, temps);

    return () => clearTimeout(timeout);

  }, [go]);

  const tirar = () => {
    if (rolling) return;

    setRolling(true);
    setRot1({ x: 0, y: 0 });

    setTimeout(() => {
      const n1 = Math.ceil(Math.random() * 6);

      setRot1({
        x: 360 * 5 + FACE_ROTATIONS[n1].x,
        y: 360 * 5 + FACE_ROTATIONS[n1].y,
      });

      setTimeout(() => {
        if (onGuanyador) onGuanyador(n1);

        setRolling(false);

        // Reset visual després d'uns segons
        setTimeout(() => {
          setResetting(true);
          setRot1({ x: 0, y: 0 });

          setTimeout(() => {
            setResetting(false);
          }, 30);

        }, 9000);

      }, 6000);

    }, 20);
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: SIZE * 0.5,
        perspective: SIZE * 20,
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: SIZE * 0.7,
          margin: SIZE * 0.6 + "px 0",
        }}
      >
        <Dau
          rot={rot1}
          resetting={resetting}
          size={SIZE}
          half={HALF}
        />
      </div>
    </div>
  );
}

function Dau({ rot, resetting, size, half }) {
  const faceStyle = {
    position: "absolute",
    width: size,
    height: size,
    background: "#fff",
    border: size * 0.05 + "px solid #333",
    borderRadius: size * 0.22,
    fontSize: size * 0.35,
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: `
      inset 0 0 ${size * 0.15}px rgba(0,0,0,0.15),
      0 ${size * 0.15}px ${size * 0.25}px rgba(0,0,0,0.35)
    `,
  };

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        transformStyle: "preserve-3d",
        transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
        transition: resetting
          ? "none"
          : "transform 6s cubic-bezier(0.22,0.61,0.36,1)",
      }}
    >
      <div style={{ ...faceStyle, transform: `rotateY(0deg) translateZ(${half}px)` }}>1</div>
      <div style={{ ...faceStyle, transform: `rotateY(90deg) translateZ(${half}px)` }}>2</div>
      <div style={{ ...faceStyle, transform: `rotateY(180deg) translateZ(${half}px)` }}>3</div>
      <div style={{ ...faceStyle, transform: `rotateY(-90deg) translateZ(${half}px)` }}>4</div>
      <div style={{ ...faceStyle, transform: `rotateX(90deg) translateZ(${half}px)` }}>5</div>
      <div style={{ ...faceStyle, transform: `rotateX(-90deg) translateZ(${half}px)` }}>6</div>
    </div>
  );
}