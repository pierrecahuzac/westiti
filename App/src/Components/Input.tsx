import React, { useState } from "react";
import "../styles/input.scss";

interface InputProps {
  type: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value?: string }[];
  classname?: string;
}

const Input: React.FC<InputProps> = ({
  type,
  name,
  value,
  onChange,
  label,
  required = false,
  placeholder,
  options,
  classname,
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const inputType = type === "password" && isPasswordVisible ? "text" : type;

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  return (
    <div
      className={`user__box ${type === "datetime-local" ? "date__input" : ""}`}
    >
      {type === "select" && options ? (
        // Rendu du champ select
        <>
          <select
            name={name}
            required={required}
            value={value}
            onChange={onChange}
            className="custom__select"
          >
            <option value="" disabled>
              {placeholder || "Sélectionnez une option"}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <label>{label}</label>
        </>
      ) : (
        // Rendu des autres types d'input
        <>
          <input
            type={inputType}
            name={name}
            required={required}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={classname}
          />
          <label>{label}</label>
          {type === "password" && (
            <button
              type="button"
              className="input__toggle-password"
              onClick={togglePasswordVisibility}
              aria-label={
                isPasswordVisible
                  ? "Masquer le mot de passe"
                  : "Afficher le mot de passe"
              }
            >
              {isPasswordVisible ? "👁️" : "👁️‍🗨️"}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Input;
