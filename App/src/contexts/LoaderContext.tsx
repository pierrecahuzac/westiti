import { createContext, useState, useContext, ReactNode } from "react";
import Loader from "../Components/Loader"; // Composant Loader

// Typage des fonctions pour afficher/masquer le loader
interface LoaderContextType {
  showLoader: () => void;
  hideLoader: () => void;
}

// Création du contexte
const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);

  let timeoutId: NodeJS.Timeout;

  const showLoader = () => {
    setLoading(true); // Affiche immédiatement le loader
    timeoutId = setTimeout(() => {
      setLoading(false); // Force un affichage minimal de 2 secondes
    }, 2000);
  };

  const hideLoader = () => {
    clearTimeout(timeoutId); // Annule le timeout si hideLoader est appelé plus tôt
    setLoading(false);
  };

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {loading && <Loader />}
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useLoader doit être utilisé dans un LoaderProvider");
  }
  return context;
};
