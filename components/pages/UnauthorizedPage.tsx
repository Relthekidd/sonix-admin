import { Link } from "react-router-dom";

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
        <Link to="/" className="text-sonix-purple underline">
          Go back home
        </Link>
      </div>
    </div>
  );
}
