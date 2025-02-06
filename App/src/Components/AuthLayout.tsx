import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import imageDesktop from "../assets/img/loadingscreen_desktop.webp";
import imageMobile from "../assets/img/loadingscreen_mobile.webp";
import BackArrowIcon from "../assets/img/back-arrow.svg";
import "../styles/homepage.scss";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);

    // Nettoyage de l'événement lors du démontage
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="homepage">
      <div className="homepage__box">
        <div className="back__arrow">
          <Link to="/">
            <img src={BackArrowIcon} alt="Retour à l'accueil" />
          </Link>
        </div>
        <div className="left__section">
          <h1>{title}</h1>
          {children}
        </div>
        <div className="right__section">
        <img
            src={isMobile ? imageMobile : imageDesktop}
            alt="Illustration"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
