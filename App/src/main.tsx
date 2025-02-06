import { createRoot } from "react-dom/client";
import { LoaderProvider } from "./contexts/LoaderContext.tsx";
import App from "./App.tsx";

import "./styles/reset.scss";
import "./styles/index.scss";

createRoot(document.getElementById("root")!).render(
  /*   <StrictMode> */
  <LoaderProvider>
    <App />
  </LoaderProvider>
  /*   </StrictMode> */
);
