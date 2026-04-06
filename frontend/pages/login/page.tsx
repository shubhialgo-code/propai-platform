"use client";

import { useState } from "react";
import { User, Lock, Mail, Github } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-3xl border bg-white p-10 shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-slate-900">{isLogin ? "Welcome Back" : "Create Account"}</h1>
          <p className="mt-2 text-sm text-slate-500">PropAI - The smarter way to find your home</p>
        </div>

        <form className="mt-8 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-300" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border px-10 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-300" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border px-10 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
          
          {isLogin && (
            <div className="flex items-center justify-end">
              <button className="text-xs font-bold text-indigo-600 hover:underline">Forgot password?</button>
            </div>
          )}

          <button className="mt-6 w-full rounded-xl bg-indigo-600 py-4 font-bold text-white shadow-lg transition-all hover:bg-indigo-700 active:scale-95">
            {isLogin ? "Sign In" : "Get Started"}
          </button>
        </form>

        <div className="relative flex items-center gap-4 py-4">
          <div className="h-px flex-1 bg-slate-100"></div>
          <span className="text-xs font-bold text-slate-400 uppercase">OR CONTINUe WITH</span>
          <div className="h-px flex-1 bg-slate-100"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
            <Github className="h-5 w-5" /> GitHub
          </button>
          <button className="flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
             Google
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          {isLogin ? "New to PropAI?" : "Already have an account?"}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="ml-1 font-bold text-indigo-600 hover:underline"
          >
            {isLogin ? "Create an account" : "Sign in here"}
          </button>
        </p>
      </div>
    </div>
  );
}
