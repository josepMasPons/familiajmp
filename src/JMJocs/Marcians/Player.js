import React, { useEffect, useRef } from 'react';
import './Marcians.css';

const Player = ({ position, setPosition, shootBullet }) => {
  const playerRef = useRef();

  useEffect(() => {
    const handleMouseMove = (event) => {
      const gameArea = playerRef.current.parentElement;
      const rect = gameArea.getBoundingClientRect();
      const newPosition = ((event.clientX - rect.left) / rect.width) * 100;
      setPosition(Math.max(0, Math.min(90, newPosition)));
    };

    const handleMouseClick = () => {
      shootBullet();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleMouseClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleMouseClick);
    };
  }, [setPosition, shootBullet]);

  return (
    <div className="ALplayer" ref={playerRef} style={{ left: `${position}%` }}>
      <div className="ALplayer-body">
        <div className="ALplayer-head"></div>
        <div className="ALplayer-gun"></div>
      </div>
    </div>
  );
};

export default Player;
