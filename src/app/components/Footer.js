"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Footer() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    const userName = localStorage.getItem("userName");
    setIsLoggedIn(!!userName);
  }, []);

  if (pathname.startsWith("/auth") || pathname.startsWith("/dashboard")) return null;

  return (
    <footer className="border-t border-border mt-auto py-8 bg-background text-sm text-muted-foreground w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-center md:text-left">
        
        {/* Logo and Project Name */}
        <div className="flex items-center justify-center md:justify-start space-x-2">
          <svg width="24" height="24" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="128" fill="url(#footer_brand_grad)"/>
            <path d="M440 72L220 292M440 72L300 440L220 292L72 212L440 72Z" stroke="white" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M440 72L300 440L220 292L72 212L440 72Z" fill="white" fillOpacity="0.2"/>
            <defs>
              <linearGradient id="footer_brand_grad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3B82F6"/>
                <stop offset="1" stopColor="#8B5CF6"/>
              </linearGradient>
            </defs>
          </svg>
          <span className="text-lg font-bold tracking-tight text-foreground">Sendly</span>
        </div>

        {/* Dynamic Links */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {isMounted && isLoggedIn ? (
            <>
              <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
              <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
              <Link href="/account" className="hover:text-foreground transition-colors">Account</Link>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="hover:text-foreground transition-colors">Login</Link>
              <Link href="/auth/register" className="hover:text-foreground transition-colors">Register</Link>
            </>
          )}
        </div>

        {/* Copyright */}
        <div className="text-sm">
          &copy; {new Date().getFullYear()} Sendly. All rights reserved.
        </div>
        
      </div>
    </footer>
  );
}
