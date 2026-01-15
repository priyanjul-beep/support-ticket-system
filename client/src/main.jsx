
import { Toaster } from "react-hot-toast";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
      <Toaster position="top-right" />
    </AuthProvider>
  </BrowserRouter>
);
