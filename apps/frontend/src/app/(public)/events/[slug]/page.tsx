"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/animated/GlassCard";
import { HeroEntrance } from "@/components/animated/HeroEntrance";
import { Calendar, MapPin, ArrowLeft, Users, CheckCircle2, Loader2, Sparkles, X } from "lucide-react";

export default function EventDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [event, setEvent] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [participantName, setParticipantName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("MMIT Pune");
  const [ieeeNumber, setIeeeNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await api.get(`/events/${slug}`);
        setEvent(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (slug) fetchEvent();
  }, [slug]);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await api.post(`/events/${event._id}/register`, {
        participantName,
        email,
        phone,
        college,
        ieeeNumber,
      });
      setRegisterSuccess(true);
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.error?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Event Not Found</h1>
        <Link href="/events">
          <Button variant="outline">Back to Events Catalog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-10 space-y-10 max-w-4xl">
      <Link href="/events">
        <Button variant="outline" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Events</span>
        </Button>
      </Link>

      <GlassCard className="space-y-6 overflow-hidden p-0">
        <div className="relative h-64 md:h-96 w-full overflow-hidden bg-slate-900">
          <img src={event.bannerUrl} alt={event.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute top-4 left-4">
            <Badge variant="ieee" className="px-3 py-1 text-xs">
              {event.category}
            </Badge>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300 pt-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-sky-400" />
                <span>{new Date(event.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-sky-400" />
                <span>{event.venue}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-sky-400" />
                <span>{event.registeredCount || 0} Participants Registered</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 space-y-3">
            <h2 className="text-xl font-bold text-white">Event Description</h2>
            <p className="text-slate-300 leading-relaxed text-sm md:text-base whitespace-pre-line">
              {event.description}
            </p>
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-white text-base">Registration Status</p>
              <p className="text-xs text-slate-400">
                {event.isRegistrationOpen ? "Open to all students & IEEE members" : "Registration Closed"}
              </p>
            </div>

            <Button
              variant="gradient"
              size="lg"
              disabled={!event.isRegistrationOpen}
              onClick={() => setIsRegisterModalOpen(true)}
              className="gap-2"
            >
              <Sparkles className="h-5 w-5" />
              <span>Register Now</span>
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Registration Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white">Event Registration</h3>
              <button
                onClick={() => {
                  setIsRegisterModalOpen(false);
                  setRegisterSuccess(false);
                  setErrorMessage(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {registerSuccess ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-lg text-white">Registration Confirmed!</h4>
                <p className="text-xs text-slate-400">
                  Thank you for registering. You will receive an email confirmation shortly.
                </p>
                <Button variant="outline" onClick={() => setIsRegisterModalOpen(false)}>
                  Close Window
                </Button>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3 text-sm">
                {errorMessage && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                    {errorMessage}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Full Name</label>
                  <Input required placeholder="Rohan Patel" value={participantName} onChange={(e) => setParticipantName(e.target.value)} />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Email Address</label>
                  <Input required type="email" placeholder="rohan@mmit.edu.in" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Phone Number</label>
                  <Input required placeholder="+91 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">College / Institution</label>
                  <Input required value={college} onChange={(e) => setCollege(e.target.value)} />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">IEEE Member ID (Optional)</label>
                  <Input placeholder="98765432" value={ieeeNumber} onChange={(e) => setIeeeNumber(e.target.value)} />
                </div>

                <Button type="submit" variant="gradient" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Registration"}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
