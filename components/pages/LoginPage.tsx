import { LoginModal } from "../common/LoginModal";

export function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Optional: Add logo or app title here */}
      {/* <img src="/logo.png" alt="Sonix Logo" className="w-20 mb-8" /> */}
      {/* <h1 className="mb-4 text-3xl font-bold text-white">Welcome to Sonix Admin</h1> */}

      <LoginModal defaultOpen showTrigger={false} />
    </main>
  );
}
