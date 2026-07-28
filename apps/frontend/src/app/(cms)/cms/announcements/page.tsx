"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/animated/GlassCard";
import { Bell, Plus, Trash2, ArrowLeft, Loader2, Pin, CheckCircle2 } from "lucide-react";

export default function CMSAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("NORMAL");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  async function fetchAnnouncements() {
    try {
      const res = await api.get("/announcements");
      setAnnouncements(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    setIsSubmitting(true);
    try {
      await api.post("/announcements", { title, content, priority });
      setTitle("");
      setContent("");
      fetchAnnouncements();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || "Failed to create announcement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    try {
      await api.delete(`/announcements/${id}`);
      fetchAnnouncements();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || "Failed to delete");
    }
  };

  const togglePin = async (id: string, currentPinStatus: boolean) => {
    try {
      await api.patch(`/announcements/${id}`, { isPinned: !currentPinStatus });
      fetchAnnouncements();
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-10 space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/cms/dashboard">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-white">Announcements Governance</h1>
          <p className="text-sm text-slate-400">Publish urgent notices, ticker alerts, and news updates</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Announcement Form */}
        <GlassCard className="space-y-4 h-fit">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Plus className="h-5 w-5 text-sky-400" />
            <span>Publish New Notice</span>
          </h2>

          <form onSubmit={handleCreate} className="space-y-4 text-sm">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Notice Title</label>
              <Input
                placeholder="Call for Student Branch Membership 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full h-10 rounded-lg border border-slate-800 bg-slate-950 px-3 text-slate-200"
              >
                <option value="NORMAL">NORMAL</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Notice Content</label>
              <textarea
                rows={3}
                placeholder="Details of the announcement..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500"
                required
              />
            </div>

            <Button type="submit" variant="gradient" className="w-full gap-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Publish Notice</span>
                </>
              )}
            </Button>
          </form>
        </GlassCard>

        {/* Announcements List */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
            </div>
          ) : announcements.length === 0 ? (
            <GlassCard className="text-center py-12 space-y-2">
              <Bell className="h-10 w-10 mx-auto text-slate-500" />
              <h3 className="font-bold text-white">No Active Announcements</h3>
              <p className="text-xs text-slate-400">Use the form on the left to post a notice.</p>
            </GlassCard>
          ) : (
            announcements.map((ann) => (
              <GlassCard key={ann._id} className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-white">{ann.title}</h3>
                    <Badge variant={ann.priority === "URGENT" ? "destructive" : "ieee"}>
                      {ann.priority}
                    </Badge>
                    {ann.isPinned && (
                      <Badge variant="success" className="gap-1 text-[10px]">
                        <Pin className="h-3 w-3" /> Pinned
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePin(ann._id, ann.isPinned)}
                      className={`p-1.5 rounded-lg border text-xs transition-colors ${
                        ann.isPinned
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "border-slate-800 text-slate-400 hover:bg-slate-800"
                      }`}
                      title="Toggle Pin"
                    >
                      <Pin className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(ann._id)}
                      className="p-1.5 rounded-lg border border-slate-800 text-rose-400 hover:bg-rose-500/20 transition-colors"
                      title="Delete Notice"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">{ann.content}</p>
                <p className="text-[11px] font-mono text-slate-500 pt-1">
                  Posted: {new Date(ann.createdAt).toLocaleString()}
                </p>
              </GlassCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
