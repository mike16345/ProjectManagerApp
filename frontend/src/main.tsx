import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ChakraProvider } from "@chakra-ui/react";

const domNode = document.getElementById("root") as HTMLElement;
const root = createRoot(domNode);

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
