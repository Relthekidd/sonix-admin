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
        <DialogTrigger className="rounded-md bg-white/10 px-4 py-2 text-white transition hover:bg-white/20">
          Login
        </DialogTrigger>
      )}
      <DialogContent className="w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 p-6 text-white shadow-lg backdrop-blur-xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            Sign In
          </DialogTitle>
        </DialogHeader>
        <form className="mt-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Username"
              className="border-white/30 bg-white/20 text-white placeholder-white/70"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              className="border-white/30 bg-white/20 text-white placeholder-white/70"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg border border-white/30 bg-white/30 px-4 py-2 text-white backdrop-blur-sm transition hover:bg-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            Submit
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
