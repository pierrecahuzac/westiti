import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "../styles/modale.scss";

interface ModaleProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const Modale: React.FC<ModaleProps> = ({ children, isOpen, onClose },) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modale__overlay">
      <div className="modale__box" ref={modalRef}>
        {/* Bouton de fermeture */}
        <button className="modale__close" onClick={onClose}>
          &times;
        </button>
        <div className="modale__content">{children}</div>
      </div>
    </div>
  );
};

export default Modale;
