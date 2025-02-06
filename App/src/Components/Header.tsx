// Header.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useToast from "../Hooks/useToast";

import Logo from "../assets/img/logo_resize.webp";

import "../styles/header.scss";
import axios from "axios";

const Header: React.FC = () => {
  const { onError, onSuccess } = useToast();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [userIsConnected, setUserIsConnected] = useState(
    localStorage.getItem("isConnected")
  );
  const navigate = useNavigate();

  const handleMenuToggle = (): void => {
    setMenuIsOpen(!menuIsOpen);
  };

  const handleLogout = async (): Promise<void> => {


    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
     
      if (response.status === 200) {
        onSuccess("Déconnexion réussie");
        localStorage.clear();
        setMenuIsOpen(false);
        setUserIsConnected(null);
        navigate("/");
      }
    } catch (error) {
      onError("Erreur lors de la déconnexion");
      console.log(error);
    }
  };
  
  const currentYear = new Date().getFullYear();

  return (
    <div className={`header ${menuIsOpen ? "menu-open" : ""}`}>
      <Link
        to={`/dashboard/${localStorage.getItem("userId")}`}
        className="logo"
      >
        <img src={Logo} alt="logo" />
      </Link>

      <div className="menu-icon" onClick={handleMenuToggle}>
        {/* L'icône du menu sera stylisée avec CSS */}
      </div>
      <nav className="nav">
        <ul className="pt-5">
          {userIsConnected ? (
            <li>
              <Link
                to={`/profile/${localStorage.getItem("userId")}`}
                onClick={handleMenuToggle}
              >
                {localStorage.getItem("username")}
              </Link>
            </li>
          ) : (
            <li>
              <Link to={`/signin`} onClick={handleMenuToggle}>
                Se connecter
              </Link>
            </li>
          )}

          <li>
            <Link
              to={`/dashboard/${localStorage.getItem("userId")}`}
              onClick={handleMenuToggle}
            >
              Mes événements
            </Link>
          </li>
          {/* <li>
            <Link to="/contact" onClick={handleMenuToggle}>
              Contact
            </Link>
          </li> */}
          {userIsConnected && (
            <li
              onClick={() => {
                handleMenuToggle();
                handleLogout();
              }}
            >
              <span className="header__logout">Déconnexion</span>
            </li>
          )}
          {/* Ajout du texte "Westiti2024" en bas du menu */}
          <li className="nav__footer">
            <span>
              Westiti©
              {currentYear}
            </span>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
