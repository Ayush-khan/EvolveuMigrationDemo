import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Index from "./router/Index";

function App() {
  const API_URL = import.meta.env.VITE_API_URL;
  // const API_URL = import.meta.env.API_URL;
  console.log("this is API_URL", API_URL);
  return (
    <div className="overflow-x-hidden">
      <Index />
    </div>
  );
}

export default App;
