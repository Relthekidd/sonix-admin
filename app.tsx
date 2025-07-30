import React from 'react';
import { Dashboard } from "./components/Dashboard";
import { AuthProvider } from "./utils/auth/AuthContext";

export default function App() {
  return (
    <div className="min-h-screen bg-sonix-black">
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </div>
  );
}