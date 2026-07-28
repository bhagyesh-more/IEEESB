"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema, EventInput, EventStatus } from "@mmit-ieee/shared";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUploader } from "@/components/common/ImageUploader";
import { X, Calendar, Plus, Loader2 } from "lucide-react";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventInput>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData || {
      title: "",
      slug: "",
      description: "",
      category: "Workshop",
      venue: "MMIT Main Auditorium",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      bannerUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
      isRegistrationOpen: true,
      maxCapacity: 100,
      status: EventStatus.PUBLISHED,
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: EventInput) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      if (initialData?._id) {
        await api.patch(`/events/${initialData._id}`, data);
      } else {
        await api.post("/events", data);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.error?.message || "Failed to save event. Please check inputs."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-6 my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-sky-400" />
            <h2 className="text-xl font-bold text-white">
              {initialData ? "Edit Event" : "Create New Event"}
            </h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Event Title</label>
              <Input
                placeholder="AI & Machine Learning Summit 2026"
                {...register("title")}
                onChange={(e) => {
                  register("title").onChange(e);
                  if (!initialData) {
                    const generatedSlug = e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)+/g, "");
                    setValue("slug", generatedSlug);
                  }
                }}
              />
              {errors.title && <p className="text-xs text-rose-400">{errors.title.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">URL Slug</label>
              <Input placeholder="ai-ml-summit-2026" {...register("slug")} />
              {errors.slug && <p className="text-xs text-rose-400">{errors.slug.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Category</label>
              <Input placeholder="Workshop / Hackathon / Webinar" {...register("category")} />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Venue / Location</label>
              <Input placeholder="MMIT Main Auditorium" {...register("venue")} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Start Date</label>
              <Input type="date" {...register("startDate")} />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">End Date</label>
              <Input type="date" {...register("endDate")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Event Description</label>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Detailed agenda, key takeaways, and speaker details..."
              {...register("description")}
            />
            {errors.description && <p className="text-xs text-rose-400">{errors.description.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Event Banner Image</label>
            <ImageUploader
              folder="mmit-ieee/events"
              defaultUrl={watch("bannerUrl")}
              onUploadSuccess={(url) => setValue("bannerUrl", url)}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" disabled={isLoading} className="gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Event...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  {initialData ? "Update Event" : "Create Event"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
