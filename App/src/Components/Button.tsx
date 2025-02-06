import React from "react";
//import "../styles/button.scss";
import { ButtonProps } from "../@types/ButtonProps";

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className,
  type,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      className={className}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
