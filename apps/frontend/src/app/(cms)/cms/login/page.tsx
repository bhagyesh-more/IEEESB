"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@mmit-ieee/shared";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/animated/GlassCard";
import { VantaNetBackground } from "@/components/animated/VantaNetBackground";
import { Shield, Lock, Mail, AlertCircle, Loader2 } from "lucide-react";

export default function CMSLoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await api.post("/auth/login", data);
      if (res.data?.data?.accessToken) {
        localStorage.setItem("accessToken", res.data.data.accessToken);
      }
      window.location.href = "/cms/dashboard";
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.error?.message ||
          "Invalid email or password credentials. Please verify your credentials and try again."
      );
      setIsLoading(false);
    }
  };

  return (
    <VantaNetBackground
      color={0x0284c7}
      backgroundColor={0x030712}
      points={15.00}
      maxDistance={25.00}
      className="min-h-[85vh] flex items-center justify-center p-4"
      overlayVariant="both"
    >
      <div className="w-full max-w-md my-12">
        <GlassCard className="space-y-6 p-8 border-sky-500/30 shadow-2xl shadow-sky-950/60">
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40">
              <Shield className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">CMS Admin Portal</h1>
            <p className="text-xs text-slate-400">MMIT IEEE Student Branch Governance</p>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  type="email"
                  placeholder="admin@example.com"
                  className="pl-9"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-400">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-rose-400">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="gradient"
              className="w-full h-11 text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating...
                </span>
              ) : (
                "Sign In to Dashboard"
              )}
            </Button>
          </form>
        </GlassCard>
      </div>
    </VantaNetBackground>
  );
}
