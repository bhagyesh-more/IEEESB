"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { GlassCard } from "@/components/animated/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ImageUploader } from "@/components/common/ImageUploader";
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

export default function CMSSlideshowPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<any>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [tag, setTag] = useState("Flagship Event");
  const [imageUrl, setImageUrl] = useState("");
  const [linkHref, setLinkHref] = useState("/events");
  const [linkText, setLinkText] = useState("Explore Event");
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch All Hero Slides
  const { data: slides = [], isLoading } = useQuery({
    queryKey: ["hero-slides-admin"],
    queryFn: async () => {
      const res = await api.get("/hero-slides");
      return res.data?.data || [];
    },
  });

  // Create or Update Mutation
  const saveMutation = useMutation({
    mutationFn: async (slideData: any) => {
      if (editingSlide) {
        return await api.put(`/hero-slides/${editingSlide._id}`, slideData);
      }
      return await api.post("/hero-slides", slideData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-slides-admin"] });
      queryClient.invalidateQueries({ queryKey: ["public-hero-slides"] });
      closeModal();
    },
    onError: (err: any) => {
      setErrorMessage(err.response?.data?.error?.message || "Failed to save slide");
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (slideId: string) => {
      return await api.delete(`/hero-slides/${slideId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-slides-admin"] });
      queryClient.invalidateQueries({ queryKey: ["public-hero-slides"] });
    },
  });

  const openCreateModal = () => {
    setEditingSlide(null);
    setTitle("");
    setSubtitle("");
    setTag("Flagship Event");
    setImageUrl("");
    setLinkHref("/events");
    setLinkText("Explore Event");
    setOrder(slides.length);
    setIsActive(true);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (slide: any) => {
    setEditingSlide(slide);
    setTitle(slide.title);
    setSubtitle(slide.subtitle);
    setTag(slide.tag);
    setImageUrl(slide.imageUrl);
    setLinkHref(slide.linkHref || "");
    setLinkText(slide.linkText || "");
    setOrder(slide.order || 0);
    setIsActive(slide.isActive ?? true);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSlide(null);
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subtitle || !imageUrl) {
      setErrorMessage("Title, Subtitle, and Slide Image are required.");
      return;
    }
    saveMutation.mutate({
      title,
      subtitle,
      tag,
      imageUrl,
      linkHref,
      linkText,
      order: Number(order),
      isActive,
    });
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
            <Sparkles className="h-4 w-4" />
            <span>Landing Page Visual Governance</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Hero Slideshow Manager
          </h1>
          <p className="text-sm text-slate-400">
            Upload images, configure slide headlines, set call-to-action buttons, and reorder active landing slides.
          </p>
        </div>

        <Button
          variant="gradient"
          onClick={openCreateModal}
          className="gap-2 shadow-lg shadow-sky-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Slide</span>
        </Button>
      </div>

      {/* Slides Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-sky-400 animate-spin" />
        </div>
      ) : slides.length === 0 ? (
        <GlassCard className="text-center py-16 space-y-3">
          <Sparkles className="h-10 w-10 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Hero Slides Added Yet</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            Create custom slides to showcase flagship events, technical workshops, and honors on the landing page carousel.
          </p>
          <Button variant="outline" onClick={openCreateModal} className="gap-2 mt-2">
            <Plus className="h-4 w-4" />
            <span>Add First Slide</span>
          </Button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.map((slide: any) => (
            <GlassCard
              key={slide._id}
              className="overflow-hidden space-y-4 p-0 flex flex-col justify-between border-slate-800 hover:border-sky-500/40 transition-all"
            >
              {/* Image Banner Thumbnail */}
              <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                {slide.imageUrl ? (
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-600 text-xs">
                    No Image Provided
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <Badge variant="ieee" className="text-[11px] px-2.5 py-0.5">
                    {slide.tag}
                  </Badge>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-950/80 text-slate-300 font-mono border border-slate-700">
                    Order: {slide.order}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span
                    className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded font-semibold backdrop-blur-md ${
                      slide.isActive
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                    }`}
                  >
                    {slide.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    {slide.isActive ? "Active" : "Hidden"}
                  </span>
                </div>
              </div>

              {/* Content Details */}
              <div className="px-5 pb-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white leading-tight line-clamp-2">
                    {slide.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {slide.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  {slide.linkHref ? (
                    <span className="text-xs text-sky-400 flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      <span>{slide.linkText || "Link Attached"}</span>
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500">No CTA Link</span>
                  )}

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-slate-400 hover:text-sky-400"
                      onClick={() => openEditModal(slide)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-slate-400 hover:text-rose-400"
                      onClick={() => {
                        if (confirm(`Delete slide '${slide.title}'?`)) {
                          deleteMutation.mutate(slide._id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Create / Edit Slide Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <GlassCard className="w-full max-w-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto border-sky-500/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {editingSlide ? "Edit Hero Slide" : "Create Landing Hero Slide"}
                </h2>
                <p className="text-xs text-slate-400">Configure slide visual banner and details.</p>
              </div>
              <Button variant="ghost" size="sm" onClick={closeModal}>
                ✕
              </Button>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Cloudinary Direct Signed Image Upload Component */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Slide Banner Image</label>
                <ImageUploader
                  value={imageUrl}
                  onChange={(url) => setImageUrl(url)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Slide Headline Title</label>
                  <Input
                    placeholder="e.g. IEEE Flagship Annual Hackathon 2025"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Category Tag</label>
                  <Input
                    placeholder="e.g. Flagship Event / Technical Workshop"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Slide Subtitle / Description</label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Brief description highlighting key details..."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Button Link Target (Href)</label>
                  <Input
                    placeholder="/events"
                    value={linkHref}
                    onChange={(e) => setLinkHref(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Button Display Text</label>
                  <Input
                    placeholder="Explore Events"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Display Order</label>
                  <Input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500"
                />
                <label htmlFor="isActive" className="text-xs font-semibold text-slate-300">
                  Publish Slide on Landing Page Carousel
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gradient"
                  disabled={saveMutation.isPending}
                  className="gap-2"
                >
                  {saveMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingSlide ? "Update Slide" : "Create Slide"}</span>
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
