import { LoginModal } from "../common/LoginModal";

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <LoginModal defaultOpen />
    </div>
  );
}
