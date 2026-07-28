"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { PERMISSIONS, UserRole } from "@mmit-ieee/shared";
import { GlassCard } from "@/components/animated/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Plus,
  Trash2,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Key,
} from "lucide-react";

const SYSTEM_ROLES = Object.values(UserRole);

export default function CMSRolesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch Roles
  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await api.get("/roles");
      return res.data?.data || [];
    },
  });

  // Create Role Mutation
  const createMutation = useMutation({
    mutationFn: async (newRole: { name: string; description: string; permissions: string[] }) => {
      return await api.post("/roles", newRole);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setIsModalOpen(false);
      setRoleName("");
      setDescription("");
      setSelectedPermissions([]);
      setErrorMessage(null);
    },
    onError: (err: any) => {
      setErrorMessage(err.response?.data?.error?.message || "Failed to create role");
    },
  });

  // Delete Role Mutation
  const deleteMutation = useMutation({
    mutationFn: async (roleId: string) => {
      return await api.delete(`/roles/${roleId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });

  const togglePermission = (perm: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName || !description) {
      setErrorMessage("Please enter a role name and description.");
      return;
    }
    if (selectedPermissions.length === 0) {
      setErrorMessage("Please select at least one permission.");
      return;
    }
    createMutation.mutate({
      name: roleName,
      description,
      permissions: selectedPermissions,
    });
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
            <Shield className="h-4 w-4" />
            <span>Access Control & Security</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            RBAC Role Governance
          </h1>
          <p className="text-sm text-slate-400">
            Define organizational roles, assign granular system permissions, and manage governance policies.
          </p>
        </div>

        <Button
          variant="gradient"
          onClick={() => setIsModalOpen(true)}
          className="gap-2 shadow-lg shadow-sky-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>Create Custom Role</span>
        </Button>
      </div>

      {/* Roles Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-sky-400 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role: any) => {
            const isSystemRole = SYSTEM_ROLES.includes(role.name);
            return (
              <GlassCard
                key={role._id}
                className="space-y-5 p-6 flex flex-col justify-between border-slate-800 hover:border-sky-500/30 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={isSystemRole ? "ieee" : "outline"}
                        className="px-3 py-1 text-xs font-bold"
                      >
                        {role.name}
                      </Badge>
                      {isSystemRole && (
                        <span className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          <Lock className="h-3 w-3 text-amber-400" />
                          System
                        </span>
                      )}
                    </div>

                    {!isSystemRole && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete role '${role.name}'?`)) {
                            deleteMutation.mutate(role._id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {role.description || "Custom organizational role."}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                      <span>Permissions ({role.permissions?.length || 0})</span>
                      <Key className="h-3.5 w-3.5 text-sky-400" />
                    </div>

                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                      {role.permissions?.map((perm: string) => (
                        <span
                          key={perm}
                          className="text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-sky-300 font-mono"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Create Role Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <GlassCard className="w-full max-w-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto border-sky-500/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Create New Custom Role</h2>
                <p className="text-xs text-slate-400">Specify role details and assign access privileges.</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                ✕
              </Button>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Role Identifier Name</label>
                <Input
                  placeholder="e.g. EVENT_COORDINATOR"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value.toUpperCase())}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Role Description</label>
                <Input
                  placeholder="Brief description of responsibilities..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Assign System Permissions</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-3 rounded-xl bg-slate-950 border border-slate-800">
                  {Object.values(PERMISSIONS).map((perm) => {
                    const isSelected = selectedPermissions.includes(perm);
                    return (
                      <button
                        type="button"
                        key={perm}
                        onClick={() => togglePermission(perm)}
                        className={`flex items-center justify-between p-2 rounded-lg text-left text-xs transition-all ${
                          isSelected
                            ? "bg-sky-500/20 border border-sky-500/40 text-white"
                            : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <span className="font-mono text-[11px] truncate">{perm}</span>
                        {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-sky-400 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gradient"
                  disabled={createMutation.isPending}
                  className="gap-2"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Role</span>
                  )}
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
