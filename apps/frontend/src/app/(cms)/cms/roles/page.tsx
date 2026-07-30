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
  UserCheck,
  Mail,
  User,
} from "lucide-react";

const SYSTEM_ROLES = Object.values(UserRole);

export default function CMSRolesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // User Role Assignment Form State
  const [targetEmail, setTargetEmail] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [assignStatus, setAssignStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch Roles
  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await api.get("/roles");
      return res.data?.data || [];
    },
  });

  // Fetch Users and their Assigned Roles
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ["role-users"],
    queryFn: async () => {
      const res = await api.get("/roles/users");
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
      const detailMsg = err.response?.data?.error?.details?.[0]?.message;
      setErrorMessage(detailMsg ? `Validation error: ${detailMsg}` : err.response?.data?.error?.message || "Failed to create role");
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

  // Assign Role to User Mutation
  const assignMutation = useMutation({
    mutationFn: async (payload: { email: string; roleId: string }) => {
      return await api.post("/roles/assign-user", payload);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["role-users"] });
      setAssignStatus({
        type: "success",
        text: res.data?.message || "Role assigned successfully!",
      });
      setTargetEmail("");
      setSelectedRoleId("");
    },
    onError: (err: any) => {
      setAssignStatus({
        type: "error",
        text: err.response?.data?.error?.message || "Failed to assign role to user email",
      });
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

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmail || !selectedRoleId) {
      setAssignStatus({ type: "error", text: "Please provide user email and select a role." });
      return;
    }
    setAssignStatus(null);
    assignMutation.mutate({
      email: targetEmail,
      roleId: selectedRoleId,
    });
  };

  const handleQuickReassign = (userEmail: string, roleId: string) => {
    setAssignStatus(null);
    assignMutation.mutate({
      email: userEmail,
      roleId,
    });
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 space-y-10">
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
            Define organizational roles, assign granular permissions, and map roles to user accounts by email.
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

      {/* Assign Role to User Email Panel */}
      <GlassCard className="space-y-6 border-sky-500/30">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
          <UserCheck className="h-5 w-5 text-sky-400" />
          <h2 className="text-lg font-bold text-white">Assign Role to User Account</h2>
        </div>

        {assignStatus && (
          <div
            className={`flex items-center gap-2.5 p-3.5 rounded-xl text-xs border ${
              assignStatus.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-rose-500/10 border-rose-500/30 text-rose-300"
            }`}
          >
            {assignStatus.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            <span>{assignStatus.text}</span>
          </div>
        )}

        <form onSubmit={handleAssignSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">User Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                type="email"
                placeholder="admin@mmit.edu.in or user@example.com"
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Target Role</label>
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="w-full h-10 rounded-lg border border-slate-800 bg-slate-950 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
              required
            >
              <option value="">Select Target Role...</option>
              {roles.map((r: any) => (
                <option key={r._id} value={r._id}>
                  {r.name} ({r.permissions?.length || 0} perms)
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" variant="gradient" disabled={assignMutation.isPending} className="gap-2">
            {assignMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <UserCheck className="h-4 w-4" />
                <span>Assign Role to User</span>
              </>
            )}
          </Button>
        </form>
      </GlassCard>

      {/* User Accounts Directory Table */}
      <GlassCard className="space-y-4 p-0 overflow-hidden border-slate-800">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-sky-400" />
            <h3 className="font-bold text-white text-base">Registered User Accounts & Assigned Roles</h3>
          </div>
          <span className="text-xs text-slate-400">{users.length} Account(s) Found</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase">
              <tr>
                <th scope="col" className="px-6 py-3.5">USER NAME</th>
                <th scope="col" className="px-6 py-3.5">EMAIL ADDRESS</th>
                <th scope="col" className="px-6 py-3.5">CURRENT ASSIGNED ROLE</th>
                <th scope="col" className="px-6 py-3.5">REASSIGN ROLE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {isLoadingUsers ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-400">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto mb-1 text-sky-400" />
                    <span>Loading user accounts...</span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-500">
                    No registered user accounts found.
                  </td>
                </tr>
              ) : (
                users.map((u: any) => (
                  <tr key={u._id} className="hover:bg-sky-500/5 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-white">{u.name}</td>
                    <td className="px-6 py-3.5 font-mono text-slate-300">{u.email}</td>
                    <td className="px-6 py-3.5">
                      <Badge variant="ieee" className="text-[10px]">
                        {u.role?.name || "UNASSIGNED"}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5">
                      <select
                        value={u.role?._id || ""}
                        onChange={(e) => handleQuickReassign(u.email, e.target.value)}
                        className="h-8 rounded border border-slate-800 bg-slate-950 px-2 text-xs text-sky-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      >
                        <option value="" disabled>Change Role...</option>
                        {roles.map((r: any) => (
                          <option key={r._id} value={r._id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Roles Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Key className="h-5 w-5 text-sky-400" />
          <span>Configured Role Policies ({roles.length})</span>
        </h2>

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
      </div>

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
