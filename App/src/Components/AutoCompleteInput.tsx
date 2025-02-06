import React, { useState } from "react";
import "../styles/autocomplete.scss";
import { AutoCompleteInputProps } from "../@types/AutoCompleteInputProps";

const AutoCompleteInput: React.FC<AutoCompleteInputProps> = ({
  value,
  onChange,
  label,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
          query
        )}&limit=5`
      );
      const data = await response.json();
      if (data && data.features) {
        const addresses = data.features.map(
          (feature: any) => feature.properties.label
        );
        setSuggestions(addresses);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des suggestions :", error);
      setSuggestions([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    fetchSuggestions(newValue);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setSuggestions([]);
    setIsFocused(false);
  };

  return (
    <div className="autocomplete__container">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Délai pour permettre le clic sur une suggestion
        placeholder=" "
        className="autocomplete__input"
      />
      <label>{label}</label>
      {isFocused && suggestions.length > 0 && (
        <ul className="autocomplete__suggestions">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="autocomplete__suggestion"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoCompleteInput;
