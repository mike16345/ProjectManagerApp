import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ChakraProvider } from "@chakra-ui/react";

const root = createRoot(document.getElementById("root")!);
console.log(import.meta.env.VITE_REACT_APP_GOOGLE_API_TOKEN);
root.render(
  <BrowserRouter>
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_REACT_APP_GOOGLE_API_TOKEN || ""}
    >
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>
);
