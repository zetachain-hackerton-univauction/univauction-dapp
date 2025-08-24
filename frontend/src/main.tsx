import "./index.css";
import { createRoot } from "react-dom/client";
import App from "./App.js";

console.log("🚀 Starting React app...");
createRoot(document.getElementById("root")!).render(<App />);
