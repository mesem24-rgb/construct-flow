"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();

  function handleDemoLogin() {
  localStorage.setItem("constructflow-demo", "true");
  router.push("/");
}

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setStatus("Sending login link...");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus("Check your email for the login link.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 dark:bg-slate-950">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <h1 className="text-3xl font-bold tracking-tight">
          Sign in to ConstructFlow
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Enter your email to receive a secure login link.
        </p>

        <div className="mt-6 space-y-4">
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900 dark:border-slate-700 dark:bg-slate-950"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900"
          >
            Send Login Link
          </button>
          <button
  type="button"
  onClick={handleDemoLogin}
  className="w-full rounded-xl border px-5 py-3 font-medium transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
>
  Continue as Demo User
</button>
        </div>

        {status && (
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            {status}
          </p>
        )}
      </form>
    </div>
  );
}