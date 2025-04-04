"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, User, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setFormError("Invalid email or password");
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      setFormError("An error occurred during login");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-card rounded-2xl max-w-md w-full overflow-hidden shadow-xl animate-fade-in">
        <div className="bg-gradient-to-r from-primary to-secondary p-6 text-center">
          <h2 className="text-2xl font-bold text-white">Welcome to PersonaAI</h2>
          <p className="text-white/80 mt-2">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {(error || formError) && (
            <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              <span>
                {error === "CredentialsSignin"
                  ? "Invalid email or password"
                  : formError || "An error occurred. Please try again."}
              </span>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground block">
              Email
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <User size={18} />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input pl-10"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground block">
              Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Lock size={18} />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-10"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full btn-primary py-3 rounded-lg" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          <div className="text-center text-sm text-muted-foreground mt-4">
            <p>Demo accounts (email / password):</p>
            <p className="font-medium text-foreground">
              User: john@example.com / 1234
            </p>
            <p className="font-medium text-foreground">
              Admin: admin@personaai.com / admin123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}