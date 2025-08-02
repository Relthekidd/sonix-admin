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
}

export function LoginModal({ defaultOpen = false }: LoginModalProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="px-4 py-2 rounded-md bg-white/10 text-white hover:bg-white/20 transition">
        Login
      </DialogTrigger>
      <DialogContent className="w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl shadow-lg text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">
            Sign In
          </DialogTitle>
        </DialogHeader>
        <form className="mt-4 space-y-4">
          <Input
            type="text"
            placeholder="Username"
            className="bg-white/20 border-white/30 placeholder-white/70 text-white"
          />
          <Input
            type="password"
            placeholder="Password"
            className="bg-white/20 border-white/30 placeholder-white/70 text-white"
          />
          <button
            type="submit"
            className="w-full rounded-lg border border-white/30 bg-white/30 px-4 py-2 text-white backdrop-blur-sm transition hover:bg-white/40"
          >
            Submit
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
