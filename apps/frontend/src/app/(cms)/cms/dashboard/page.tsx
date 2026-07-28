"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { GlassCard } from "@/components/animated/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Bell, Users, Shield, FileText, LogOut, Activity } from "lucide-react";

export default function CMSDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.data.user);
      } catch (err) {
        router.push("/cms/login");
      } finally {
        setIsLoading(false);
      }
    }
    fetchMe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {}
    localStorage.removeItem("accessToken");
    router.push("/cms/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-slate-400">
        Loading CMS session...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-white">CMS Governance Dashboard</h1>
            <Badge variant="ieee" className="text-xs">
              {user?.role?.name || "SUPER_ADMIN"}
            </Badge>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Welcome back, <span className="text-sky-400 font-semibold">{user?.name}</span> ({user?.email})
          </p>
        </div>

        <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2 text-rose-400 hover:text-rose-300">
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>

      {/* Modules Control Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/cms/events">
          <GlassCard className="space-y-3 hover:border-sky-500/50 transition-all cursor-pointer">
            <div className="h-10 w-10 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Events Module</h3>
            <p className="text-xs text-slate-400">Manage workshops, hackathons, and registrations.</p>
          </GlassCard>
        </Link>

        <Link href="/cms/announcements">
          <GlassCard className="space-y-3 hover:border-blue-500/50 transition-all cursor-pointer">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Bell className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Announcements</h3>
            <p className="text-xs text-slate-400">Publish urgent notices and ticker alerts.</p>
          </GlassCard>
        </Link>

        <Link href="/cms/committee">
          <GlassCard className="space-y-3 hover:border-indigo-500/50 transition-all cursor-pointer">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Executive Committee</h3>
            <p className="text-xs text-slate-400">Update officer profiles, designations, and ordering.</p>
          </GlassCard>
        </Link>

        <Link href="/cms/audit-logs">
          <GlassCard className="space-y-3 hover:border-emerald-500/50 transition-all cursor-pointer">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Audit Security Logs</h3>
            <p className="text-xs text-slate-400">View real-time system mutations and security events.</p>
          </GlassCard>
        </Link>
      </div>

      {/* Permissions Badges */}
      <GlassCard className="space-y-4">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <Shield className="h-4 w-4 text-sky-400" />
          <span>Active Role Permissions ({user?.role?.permissions?.length || 0})</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {user?.role?.permissions?.map((perm: string) => (
            <Badge key={perm} variant="secondary" className="text-xs font-mono">
              {perm}
            </Badge>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
