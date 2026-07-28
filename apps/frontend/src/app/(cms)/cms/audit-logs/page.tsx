"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/animated/GlassCard";
import { Activity, ArrowLeft, Loader2, ShieldAlert } from "lucide-react";

export default function CMSAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAuditLogs() {
      try {
        const res = await api.get("/audit-logs");
        setLogs(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAuditLogs();
  }, []);

  return (
    <div className="container mx-auto px-4 md:px-8 py-10 space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/cms/dashboard">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-white">System Security Audit Logs</h1>
          <p className="text-sm text-slate-400">Real-time record of all system mutations and security events</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        </div>
      ) : logs.length === 0 ? (
        <GlassCard className="text-center py-12 space-y-3">
          <Activity className="h-10 w-10 mx-auto text-slate-500" />
          <h3 className="text-lg font-bold text-white">No Audit Logs Yet</h3>
          <p className="text-sm text-slate-400">System mutations will automatically appear here.</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <GlassCard key={log._id} className="flex flex-col md:flex-row md:items-center justify-between p-4 gap-4 text-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <Badge variant="ieee" className="font-mono text-xs">
                    {log.action}
                  </Badge>
                  <span className="font-semibold text-white">{log.entity}</span>
                </div>
                <p className="text-xs text-slate-400">
                  Triggered by: <span className="text-sky-400">{log.userName || "System"}</span> | Entity ID: {log.entityId || "N/A"}
                </p>
              </div>

              <div className="text-xs font-mono text-slate-500 shrink-0">
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
