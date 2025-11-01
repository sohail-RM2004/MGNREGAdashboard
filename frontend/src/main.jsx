import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./i18n"; // initialize i18next
import "./styles.css";

createRoot(document.getElementById("root")).render(<App />);
