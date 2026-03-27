"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/app/components/Modal";
import { uploadProfileImage } from "@/app/components/cloudinary/actions";

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [isUpdatePasswordModalOpen, setIsUpdatePasswordModalOpen] = useState(false);

  // Profile Form
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ text: "", type: "" });

  // Password Form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ text: "", type: "" });

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setName(data.user.name || "");
        setImage(data.user.image || "");
      }
    } catch (err) {
      console.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setProfileMsg({ text: "", type: "" });

    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const result = await uploadProfileImage(formData);

      if (result.success) {
        const res = await fetch("/api/user/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: result.imageUrl }),
        });

        if (res.ok) {
          setImage(result.imageUrl);
          setProfileMsg({ text: "Profile image updated successfully!", type: "success" });
          window.dispatchEvent(new Event("profileUpdated"));
        } else {
          const data = await res.json();
          setProfileMsg({ text: data.error || "Failed to update profile image", type: "error" });
        }
      } else {
        setProfileMsg({ text: result.message || "Image upload failed", type: "error" });
      }
    } catch (err) {
      setProfileMsg({ text: "An error occurred during upload", type: "error" });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg({ text: "", type: "" });

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();

      if (res.ok) {
        setProfileMsg({ text: "Profile updated successfully!", type: "success" });
        window.dispatchEvent(new Event("profileUpdated"));
      } else {
        setProfileMsg({ text: data.error || "Update failed", type: "error" });
      }
    } catch (err) {
      setProfileMsg({ text: "An error occurred", type: "error" });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setPasswordMsg({ text: "Please fill in all password fields.", type: "error" });
      return;
    }
    setIsUpdatePasswordModalOpen(true);
  };

  const confirmUpdatePassword = async () => {
    setPasswordSaving(true);
    setPasswordMsg({ text: "", type: "" });

    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setPasswordMsg({ text: "Password updated successfully! Redirecting to login...", type: "success" });
        setCurrentPassword("");
        setNewPassword("");
        setTimeout(async () => {
          try { await fetch("/api/auth/logout", { method: "POST" }); } catch (err) { }
          localStorage.removeItem("userName");
          window.dispatchEvent(new Event("storage"));
          router.push("/auth/login");
        }, 1500);
      } else {
        setPasswordMsg({ text: data.error || "Update failed", type: "error" });
      }
    } catch (err) {
      setPasswordMsg({ text: "An error occurred", type: "error" });
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch("/api/user/profile", {
        method: "DELETE",
      });

      if (res.ok) {
        try { await fetch("/api/auth/logout", { method: "POST" }); } catch (err) { }
        localStorage.removeItem("userName");
        window.dispatchEvent(new Event("storage"));
        router.push("/");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete account");
      }
    } catch (err) {
      alert("An error occurred");
    }
  };

  if (loading) {
    return <div className="p-8 text-slate-400">Loading profile...</div>;
  }

  if (!user) {
    return <div className="p-8 text-red-400">Error loading profile data.</div>;
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="flex items-center space-x-6 mb-8">
        <div className="relative group">
          <div
            className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-4xl font-bold text-primary border border-primary/30 shadow-[0_0_15px_rgba(124,58,237,0.2)] overflow-hidden cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {image ? (
              <img src={image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()
            )}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            {isUploading && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1 text-white">{user.name || "User Profile"}</h1>
          <p className="text-slate-400">Manage your account settings, security, and profile information.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#0b1120] border border-white/5 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-400 mb-1">Status</h3>
          <div className="text-xl font-semibold flex items-center text-green-500">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 border border-green-200 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            {user.status}
          </div>
        </div>
        <div className="bg-[#0b1120] border border-white/5 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-400 mb-1">Total API Keys</h3>
          <div className="text-xl font-semibold text-white">
            {user.totalProjects}
          </div>
        </div>
        <div className="bg-[#0b1120] border border-white/5 rounded-2xl p-6 shadow-sm overflow-hidden text-ellipsis">
          <h3 className="text-sm font-medium text-slate-400 mb-1">Member Since</h3>
          <div className="text-xl font-semibold text-white">
            {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="bg-[#0b1120] border border-white/5 rounded-2xl p-8 shadow-sm mb-8">
        <h3 className="text-lg font-medium text-white mb-6">Personal Information</h3>
        <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Email Address</label>
            <input
              type="email"
              disabled
              className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl text-slate-500 cursor-not-allowed"
              value={user.email}
            />
            <p className="text-xs text-slate-500 mt-1">Email cannot be changed.</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Display Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-white placeholder-slate-600"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {profileMsg.text && (
            <div className={`text-sm ${profileMsg.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {profileMsg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={profileSaving}
            className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover transition-colors shadow-none disabled:opacity-50"
          >
            {profileSaving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      <div className="bg-[#0b1120] border border-white/5 rounded-2xl p-8 shadow-sm mb-8">
        <h3 className="text-lg font-medium text-white mb-6">Security</h3>
        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Current Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-white placeholder-slate-600"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">New Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-white placeholder-slate-600"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          {passwordMsg.text && (
            <div className={`text-sm ${passwordMsg.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {passwordMsg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={passwordSaving}
            className="px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors shadow-none disabled:opacity-50"
          >
            {passwordSaving ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      <div className="mt-8 pt-8 border-t border-white/5 max-w-4xl">
        <h3 className="text-lg font-medium text-red-400 mb-2">Danger Zone</h3>
        <p className="text-sm text-slate-500 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            onClick={async () => {
              try { await fetch("/api/auth/logout", { method: "POST" }); } catch (err) { }
              localStorage.removeItem("userName");
              window.dispatchEvent(new Event("storage"));
              router.push("/");
            }}
            className="px-6 py-3 border border-white/10 text-white bg-white/5 font-medium rounded-xl hover:bg-white/10 transition-colors"
          >
            Log Out Completely
          </button>
          <button
            onClick={() => setIsDeleteAccountModalOpen(true)}
            className="px-6 py-3 border border-red-500/20 text-red-400 bg-red-500/10 font-medium rounded-xl hover:bg-red-500/20 transition-colors"
          >
            Delete Account Permanently
          </button>
        </div>
      </div>

      <Modal
        isOpen={isUpdatePasswordModalOpen}
        onClose={() => setIsUpdatePasswordModalOpen(false)}
        onConfirm={confirmUpdatePassword}
        title="Update Password?"
        message="Are you sure you want to change your password? You will be logged out and need to sign in again with your new password."
        confirmText="Update Password"
        variant="warning"
      />

      <Modal
        isOpen={isDeleteAccountModalOpen}
        onClose={() => setIsDeleteAccountModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account Permanently?"
        message="Are you absolutely sure you want to delete your account? This will permanently delete your API keys and ALL form submissions. This action cannot be undone."
        confirmText="Delete My Account"
        variant="danger"
      />
    </div>
  );
}
