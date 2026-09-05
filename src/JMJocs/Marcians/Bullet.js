import React from 'react';
import './Marcians.css';

const Bullet = ({ position, top }) => {
  return <div className="ALbullet" style={{ left: `${position}%`, top: `${top}%` }} />;
};

export default Bullet;
