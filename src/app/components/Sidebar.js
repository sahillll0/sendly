"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Modal from "./Modal";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("U");
  const [fullUserName, setFullUserName] = useState("User");
  const [userImage, setUserImage] = useState("");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName && storedName.length > 0) {
      setUserName(storedName.charAt(0).toUpperCase());
      setFullUserName(storedName);
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.user?.image) {
            setUserImage(data.user.image);
          }
          if (data.user?.name) {
            setFullUserName(data.user.name);
            setUserName(data.user.name.charAt(0).toUpperCase());
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile picture in Sidebar", err);
      }
    };

    fetchProfile();
    window.addEventListener("profileUpdated", fetchProfile);
    return () => {
      window.removeEventListener("profileUpdated", fetchProfile);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) { console.error(err); }
    localStorage.removeItem("userName");
    window.dispatchEvent(new Event("storage"));
    router.push("/auth/login");
  };

  const navItems = [
    { name: "Overview", href: "/dashboard" },
    { name: "Projects", href: "/dashboard/api-key" },
    { name: "Submissions", href: "/dashboard/submissions" },
    { name: "Profile", href: "/dashboard/profile" },
  ];

  return (
    <aside className="w-64 border-r border-border bg-[#0b1120] flex flex-col h-full relative z-10">
      <div className="p-6 flex-col flex h-full">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 pt-6 border-t border-border mt-auto flex flex-col gap-2">
          <div className="flex items-center space-x-3 px-3 mb-2 cursor-pointer" onClick={() => router.push("/dashboard/profile")}>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary border border-primary/30 overflow-hidden shrink-0">
              {userImage ? (
                <img src={userImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                userName
              )}
            </div>
            <div className="text-sm font-medium text-white truncate text-ellipsis overflow-hidden">
              {fullUserName}
            </div>
          </div>
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center px-3 py-2 w-full text-left text-sm font-medium text-red-500 hover:bg-red-500/10 hover:text-red-400 rounded-md transition-colors"
          >
            Log out
          </button>
        </div>
      </div>

      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Log out?"
        message="Are you sure you want to log out of your account? You will need to sign in again to access your dashboard."
        confirmText="Log out"
        variant="warning"
      />
    </aside>
  );
}
