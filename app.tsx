import React from "react";
import { createRoot } from "react-dom/client";
import { Dashboard } from "./components/Dashboard";
import { AuthProvider } from "./utils/auth/AuthContext";
import { SupabaseAuthProvider } from "./contexts/SupabaseAuthProvider";
import "./styles/globals.css";

function App() {
  return (
    <div className="min-h-screen bg-sonix-black">
      <SupabaseAuthProvider>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </SupabaseAuthProvider>
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

