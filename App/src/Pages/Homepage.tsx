import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Button from "../Components/Button";

import imageDesktop from "../assets/img/loadingscreen_desktop.webp";
import imageMobile from "../assets/img/loadingscreen_mobile.webp";

import "../styles/homepage.scss";
import "../styles/button.scss";
import { Helmet } from "react-helmet-async";

const Homepage: React.FC = () => {
  // const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    window.matchMedia("(max-width: 768px)").matches
  );
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleResize = () => setIsMobile(mediaQuery.matches);

    // Nettoyage de l'événement lors du démontage

    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return (
    <div className="homepage">
      <Helmet>
        <title>Bienvenue sur WeStiti - Accueil</title>
        <meta name="description" content="Découvrez WeStiti, une plateforme moderne et performante." />
        <meta property="og:title" content="Bienvenue sur WeStiti" />
        <meta property="og:description" content="Découvrez WeStiti, une plateforme moderne et performante." />
        <meta property="og:image" content={imageDesktop} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <div className="homepage__box">
        <div className="left__section">
          <h1>Bienvenue sur Westiti</h1>
          <div className="buttons">
            <Link to="/signup">
              <Button className="btn" to="/signup">
                S'inscrire
              </Button>
            </Link>
            <Link to="/signin">
              <Button className="btn" type="button">
                Se connecter
              </Button>
            </Link>
          </div>
        </div>
        <div className="right__section">
          <img src={isMobile ? imageMobile : imageDesktop} alt="Illustration" loading="lazy" />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
