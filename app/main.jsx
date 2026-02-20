import React from "react";
import { AnimatePresence } from "framer-motion";
import App from "../components/App";
import "../styles/globals.css";

export default function Main() {
  return (
    <AnimatePresence>
      <App />
    </AnimatePresence>
  );
}
