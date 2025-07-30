import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../utils/auth/AuthContext";

export function UnauthorizedPage() {
  const { signOut } = useAuth();
  const [pending, setPending] = useState(false);

  const handleLogout = async () => {
    setPending(true);
    try {
      await signOut();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Access Denied</h1>
          <p>You do not have permission to view this page.</p>
        </div>
        <div className="flex items-center justify-center space-x-4">
          <Link to="/" className="sonix-button-secondary px-4 py-2">
            Go Home
          </Link>
          <button
            onClick={handleLogout}
            className="sonix-button-primary px-4 py-2"
            disabled={pending}
          >
            {pending ? "Logging Out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
}
