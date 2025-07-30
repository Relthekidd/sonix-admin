import React from "react";
import { createRoot } from "react-dom/client";
import { Dashboard } from "./components/Dashboard";
import { AuthProvider } from "./utils/auth/AuthContext";
import "./styles/globals.css";

function App() {
  return (
    <div className="min-h-screen bg-sonix-black">
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);