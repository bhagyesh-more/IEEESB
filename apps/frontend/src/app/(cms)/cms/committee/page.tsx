"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { GlassCard } from "@/components/animated/GlassCard";
import { ImageUploader } from "@/components/common/ImageUploader";
import { Users, Plus, Trash2, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function CMSCommitteePage() {
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [category, setCategory] = useState("OFFICER");
  const [avatarUrl, setAvatarUrl] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80");
  const [bio, setBio] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    setIsLoading(true);
    try {
      const res = await api.get("/committee");
      setMembers(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !designation) {
      setStatusMessage({ type: "error", text: "Please provide Full Name and Designation/Role." });
      return;
    }
    setIsSubmitting(true);
    setStatusMessage(null);
    try {
      const res = await api.post("/committee", {
        name,
        designation,
        category,
        avatarUrl,
        bio,
        academicYear: "2025-2026",
        isActive: true,
      });

      setName("");
      setDesignation("");
      setBio("");
      setStatusMessage({ type: "success", text: `Officer '${res.data?.data?.name}' added successfully!` });
      await fetchMembers();
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.response?.data?.error?.message || "Failed to add committee officer.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, memberName: string) => {
    if (!confirm(`Are you sure you want to delete officer '${memberName}'?`)) return;
    try {
      await api.delete(`/committee/${id}`);
      setStatusMessage({ type: "success", text: `Officer '${memberName}' deleted successfully.` });
      setMembers((prev) => prev.filter((m) => m._id !== id));
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.response?.data?.error?.message || "Failed to delete officer.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-10 space-y-8">
      <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
        <Link href="/cms/dashboard">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-white">Executive Committee Governance</h1>
          <p className="text-sm text-slate-400">Add, manage, or delete student officers, faculty counselors, and team leads</p>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`flex items-center gap-2.5 p-3.5 rounded-xl text-sm border ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-300"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Member Form */}
        <GlassCard className="space-y-4 h-fit border-sky-500/30">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Plus className="h-5 w-5 text-sky-400" />
            <span>Add Committee Officer</span>
          </h2>

          <form onSubmit={handleCreate} className="space-y-4 text-sm">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Full Name</label>
              <Input
                placeholder="Rohan Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Designation / Role</label>
              <Input
                placeholder="Chairperson / Technical Lead"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 rounded-lg border border-slate-800 bg-slate-950 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="OFFICER">OFFICER</option>
                <option value="FACULTY">FACULTY</option>
                <option value="LEAD">LEAD</option>
                <option value="MENTOR">MENTOR</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Avatar Photo</label>
              <ImageUploader
                folder="mmit-ieee/committee"
                value={avatarUrl}
                onChange={(url) => setAvatarUrl(url)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Short Bio</label>
              <textarea
                rows={2}
                placeholder="Brief introduction..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <Button type="submit" variant="gradient" className="w-full gap-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Add Member</span>
                </>
              )}
            </Button>
          </form>
        </GlassCard>

        {/* Member Roster List */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
            </div>
          ) : members.length === 0 ? (
            <GlassCard className="text-center py-12 space-y-2">
              <Users className="h-10 w-10 mx-auto text-slate-500" />
              <h3 className="font-bold text-white">No Committee Members Found</h3>
              <p className="text-xs text-slate-400">Add officer records using the form on the left.</p>
            </GlassCard>
          ) : (
            members.map((member) => (
              <GlassCard key={member._id} className="flex items-center justify-between p-4 gap-4 border-slate-800 hover:border-sky-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <Avatar
                    src={member.avatarUrl}
                    alt={member.name}
                    fallback={member.name.substring(0, 2).toUpperCase()}
                    className="h-12 w-12 border border-sky-500/30 shadow-md shadow-sky-500/10"
                  />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base">{member.name}</h3>
                      <Badge variant="ieee" className="text-[10px]">
                        {member.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-sky-400 font-semibold">{member.designation}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(member._id, member.name)}
                  className="p-2.5 rounded-lg border border-slate-800 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/40 transition-all"
                  title={`Delete ${member.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </GlassCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
