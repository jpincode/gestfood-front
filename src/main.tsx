import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext.tsx";
import { ClientProvider } from "./context/ClientContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ClientProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </ClientProvider>
    </BrowserRouter>
  </StrictMode>
);
