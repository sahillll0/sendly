"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("U");
  const [userImage, setUserImage] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    const storedName = localStorage.getItem("userName");
    setIsLoggedIn(!!storedName);
    if (storedName && storedName.length > 0) {
      setUserName(storedName.charAt(0).toUpperCase());
    }

    if (storedName) {
      const fetchProfile = async () => {
        try {
          const res = await fetch("/api/user/profile");
          if (res.ok) {
            const data = await res.json();
            if (data.user?.image) {
              setUserImage(data.user.image);
            }
            if (data.user?.name) {
              setUserName(data.user.name.charAt(0).toUpperCase());
            }
          }
        } catch (err) {
          console.error("Failed to fetch profile picture in Navbar", err);
        }
      };

      fetchProfile();

      window.addEventListener("profileUpdated", fetchProfile);
      return () => {
        window.removeEventListener("profileUpdated", fetchProfile);
      };
    }
  }, []);

  if (pathname.startsWith("/auth")) return null;

  return (
    <nav className="w-full border-b border-white/5 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-3 text-2xl font-bold tracking-tight text-white group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full group-hover:bg-primary/40 transition-all"></div>
                <svg width="32" height="32" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative">
                  <rect width="512" height="512" rx="128" fill="url(#nav_brand_grad)" />
                  <path d="M440 72L220 292M440 72L300 440L220 292L72 212L440 72Z" stroke="white" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M440 72L300 440L220 292L72 212L440 72Z" fill="white" fillOpacity="0.2" />
                  <defs>
                    <linearGradient id="nav_brand_grad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#3B82F6" />
                      <stop offset="1" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Sendly</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/docs"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Docs
            </Link>
            {isMounted && isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                >
                  Dashboard
                </Link>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/20 to-violet-500/20 flex items-center justify-center text-sm font-bold text-primary border border-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.2)] overflow-hidden">
                  {userImage ? (
                    <img src={userImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    userName
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm font-bold bg-white text-slate-900 px-6 py-2.5 rounded-xl hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Hamburger Menu for Mobile */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#020617] border-t border-white/5">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/docs" className="block px-3 py-2 rounded-md text-base font-medium text-slate-400 hover:text-white hover:bg-white/5">Docs</Link>
            {isMounted && isLoggedIn ? (
              <>
                <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-slate-400 hover:text-white hover:bg-white/5">Dashboard</Link>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block px-3 py-2 rounded-md text-base font-medium text-slate-400 hover:text-white hover:bg-white/5">Log in</Link>
                <Link href="/auth/register" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-primary hover:bg-primary-hover">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
