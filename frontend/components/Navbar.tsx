"use client";

import Link from "next/link";
import { Search, Heart, User, Home, PlusCircle, MessageSquare } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
          <Home className="h-6 w-6" />
          <span>PropAI</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="/search" className="text-sm font-medium text-slate-600 hover:text-indigo-600">
            Browse
          </Link>
          <Link href="/favorites" className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-indigo-600">
            <Heart className="h-4 w-4" />
            Saved
          </Link>
          <Link href="/submit" className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-indigo-600">
            <PlusCircle className="h-4 w-4" />
            List Property
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/search" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200">
            <Search className="h-5 w-5" />
          </Link>
          <Link href="/login" className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700">
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
