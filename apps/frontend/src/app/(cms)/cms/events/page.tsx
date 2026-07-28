"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/animated/GlassCard";
import { EventModal } from "@/components/cms/EventModal";
import { Calendar, Plus, Trash2, ArrowLeft, Loader2, Edit3, Users } from "lucide-react";

export default function CMSEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const res = await api.get("/events");
      setEvents(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/events/${id}`);
      fetchEvents();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || "Failed to delete event");
    }
  };

  const handleCreateNew = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (event: any) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/cms/dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Events Governance</h1>
            <p className="text-sm text-slate-400">Create, edit, or publish IEEE workshops & hackathons</p>
          </div>
        </div>

        <Button onClick={handleCreateNew} variant="gradient" className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Create New Event</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
        </div>
      ) : events.length === 0 ? (
        <GlassCard className="text-center py-12 space-y-4">
          <Calendar className="h-12 w-12 mx-auto text-slate-500" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No Events Found</h3>
            <p className="text-sm text-slate-400">Click below to create your first event record.</p>
          </div>
          <Button onClick={handleCreateNew} variant="gradient" className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Create First Event</span>
          </Button>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <GlassCard key={event._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-lg text-white">{event.title}</h3>
                  <Badge variant={event.status === "PUBLISHED" ? "success" : "secondary"}>
                    {event.status}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Slug: {event.slug} | Category: {event.category} | Venue: {event.venue}
                </p>
                <div className="flex items-center gap-2 pt-1 text-xs text-sky-400">
                  <Users className="h-3.5 w-3.5" />
                  <span>{event.registeredCount || 0} Registered Participants</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(event)} className="gap-1.5">
                  <Edit3 className="h-3.5 w-3.5 text-sky-400" />
                  <span>Edit</span>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(event._id)}
                  className="gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Event Form Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchEvents}
        initialData={selectedEvent}
      />
    </div>
  );
}
