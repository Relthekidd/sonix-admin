import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";

interface LoginModalProps {
  /**
   * Whether the modal should be open on initial render.
   * Defaults to `false` which keeps the modal closed until the trigger is used.
   */
  defaultOpen?: boolean;
  /**
   * Hide the trigger button when the modal should appear immediately.
   */
  showTrigger?: boolean;
}

export function LoginModal({ defaultOpen = false, showTrigger = true }: LoginModalProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {showTrigger && (
        <DialogTrigger className="px-4 py-2 text-white transition shadow-lg rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/40">
          Login
        </DialogTrigger>
      )}
      <DialogContent
        className="flex flex-col w-full max-w-sm gap-2 p-8 text-white border shadow-2xl  sm:max-w-md rounded-3xl border-white/30 bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-2xl ring-1 ring-white/10"
        style={{
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.25)",
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold tracking-tight text-center drop-shadow">
            Sign In
          </DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-5 mt-6">
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Username"
              className="px-4 py-3 text-white border shadow-inner  bg-white/30 border-white/40 rounded-xl placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/40"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              className="px-4 py-3 text-white border shadow-inner  bg-white/30 border-white/40 rounded-xl placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/40"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 mt-2 font-semibold text-white transition border shadow  rounded-xl border-white/40 bg-white/30 backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/40 hover:bg-white/50 hover:text-black hover:shadow-2xl active:scale-95"
          >
            Submit
          </button>
        </form>
        {/* Optionally: Add a divider and social login buttons below */}
        {/* <div className="flex items-center my-4">
          <span className="flex-1 border-t border-white/20" />
          <span className="mx-2 text-xs text-white/60">or</span>
          <span className="flex-1 border-t border-white/20" />
        </div>
        <button className="w-full px-4 py-3 mt-2 text-white border shadow rounded-xl border-white/20 bg-gradient-to-r from-blue-500/40 to-purple-500/40 backdrop-blur hover:from-blue-600/40 hover:to-purple-600/40">
          Sign in with Google
        </button> */}
      </DialogContent>
    </Dialog>
  );
}
