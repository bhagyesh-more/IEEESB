"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/animated/GlassCard";
import { HeroEntrance } from "@/components/animated/HeroEntrance";
import { ScrollReveal } from "@/components/animated/ScrollReveal";
import { Calendar, MapPin, ArrowRight, Loader2, Search } from "lucide-react";

const officialEventsData = [
  {
    _id: "evt-official-1",
    title: "Industrial Visit to National PARAM Supercomputing Facility",
    slug: "param-supercomputing-visit",
    category: "Industrial Visit",
    venue: "C-DAC, Pune",
    startDate: "2026-05-08T09:00:00.000Z",
    bannerUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
    description: "Organized by the IEEE Computer Society Chapter of MMIT IEEE Student Branch. A total of 31 IEEE student members along with faculty coordinators explored advanced supercomputing systems like PARAM Siddhi-AI, PARAM Rudra, and AIRAWAT at C-DAC.",
  },
  {
    _id: "evt-official-2",
    title: "Building AI Agents: International Hands-on Expert Session",
    slug: "building-ai-agents-microsoft",
    category: "Workshop",
    venue: "MMIT Seminar Hall & Online",
    startDate: "2026-04-15T10:00:00.000Z",
    bannerUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    description: "International hands-on session featuring Mr. Mayuresh Waykole from Microsoft. Participants built a functional AI agent in a guided 60-minute workshop followed by an interactive Q&A session.",
  },
  {
    _id: "evt-official-3",
    title: "PRAXIS: Premier Scholar's Knowledge Exchange Program",
    slug: "praxis-knowledge-exchange",
    category: "Knowledge Exchange",
    venue: "MMIT IEEE SB Center",
    startDate: "2026-03-20T11:00:00.000Z",
    bannerUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
    description: "Monthly recurring global hands-on workshop series organized by MMIT IEEE Student Branch in collaboration with IEEE Pune Section, focusing on Ethical Hacking, the Dark Web, and Generative AI.",
  },
];

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await api.get("/events");
        const dbData = res.data?.data || [];
        setEvents(dbData.length > 0 ? dbData : officialEventsData);
      } catch (err) {
        setEvents(officialEventsData);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-16 pb-20 pt-10">
      <section className="container mx-auto px-4 md:px-8 text-center space-y-4">
        <HeroEntrance delay={0.1}>
          <Badge variant="ieee" className="px-4 py-1 text-sm">
            Technical Workshops & Hackathons
          </Badge>
        </HeroEntrance>

        <HeroEntrance delay={0.2}>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            Upcoming & Past <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">Events</span>
          </h1>
        </HeroEntrance>

        <HeroEntrance delay={0.3}>
          <p className="text-slate-400 max-w-xl mx-auto text-base">
            Join our flagship technical workshops, supercomputing visits, and expert speaker sessions.
          </p>
        </HeroEntrance>
      </section>

      {/* Filter / Search Bar */}
      <section className="container mx-auto px-4 md:px-8 max-w-md">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search events by title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-full border border-slate-800 bg-slate-900/80 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </section>

      {/* Events Grid */}
      <section className="container mx-auto px-4 md:px-8">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <GlassCard className="text-center py-12 text-slate-400">
            No events found matching your search.
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <ScrollReveal key={event._id} direction="up" delay={index * 0.1}>
                <GlassCard className="flex flex-col h-full space-y-4 overflow-hidden group border-slate-800 hover:border-sky-500/40 transition-all">
                  <div className="relative h-48 w-full overflow-hidden rounded-xl bg-slate-900">
                    <img
                      src={event.bannerUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80"}
                      alt={event.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="ieee">{event.category}</Badge>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-sky-400 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-sky-400" />
                        <span>{new Date(event.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-sky-400" />
                        <span>{event.venue}</span>
                      </div>
                    </div>

                    <Link href={`/events/${event.slug}`} className="block">
                      <Button variant="outline" className="w-full justify-between group-hover:bg-ieee-blue group-hover:text-white transition-colors">
                        <span>View Details</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
