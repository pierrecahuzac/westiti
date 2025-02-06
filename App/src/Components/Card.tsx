import React, { useEffect, useRef, useState } from "react";
import "../styles/card.scss";

interface CardProps {
  dataImage: string;
  header: string;
  content: string;
}

const Card: React.FC<CardProps> = ({ dataImage, header, content }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const [mouseLeaveDelay, setMouseLeaveDelay] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    if (cardRef.current) {
      setWidth(cardRef.current.offsetWidth);
      setHeight(cardRef.current.offsetHeight);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMouseX(e.clientX - rect.left - width / 2);
      setMouseY(e.clientY - rect.top - height / 2);
    }
  };

  const handleMouseEnter = () => {
    if (mouseLeaveDelay) {
      window.clearTimeout(mouseLeaveDelay);
    }
  };

  const handleMouseLeave = () => {
    const delay = window.setTimeout(() => {
      setMouseX(0);
      setMouseY(0);
    }, 1000);
    setMouseLeaveDelay(delay);
  };

  const mousePX = mouseX / width;
  const mousePY = mouseY / height;

  const rX = mousePX * 30;
  const rY = mousePY * -30;

  const tX = mousePX * -40;
  const tY = mousePY * -40;

  const cardStyle = {
    transform: `rotateY(${rX}deg) rotateX(${rY}deg)`,
    transition:
      mouseX === 0 && mouseY === 0
        ? "1s cubic-bezier(0.445, 0.05, 0.55, 0.95)"
        : "",
  };

  const cardBgStyle = {
    transform: `translateX(${tX}px) translateY(${tY}px)`,
    backgroundImage: `url(${dataImage})`,
    transition:
      mouseX === 0 && mouseY === 0
        ? "1s cubic-bezier(0.445, 0.05, 0.55, 0.95)"
        : "",
  };

  return (
    <div
      className="card-wrap"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={cardRef}
    >
      <div className="card" style={cardStyle}>
        <div className="card-bg" style={cardBgStyle}></div>
        <div className="card-info">
          <h1>{header}</h1>
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
