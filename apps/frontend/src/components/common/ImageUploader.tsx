"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { api } from "@/lib/api";
import { Upload, Loader2, Image as ImageIcon, Link as LinkIcon, Info } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ImageUploaderProps {
  folder?: string;
  onUploadSuccess?: (url: string) => void;
  onChange?: (url: string) => void;
  defaultUrl?: string;
  value?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  folder = "mmit-ieee/events",
  onUploadSuccess,
  onChange,
  defaultUrl,
  value,
}) => {
  const [imageUrl, setImageUrl] = useState<string>(value || defaultUrl || "");
  const [activeTab, setActiveTab] = useState<"file" | "url">("file");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (value !== undefined) {
      setImageUrl(value);
    }
  }, [value]);

  const updateUrl = (newUrl: string) => {
    setImageUrl(newUrl);
    if (onUploadSuccess) onUploadSuccess(newUrl);
    if (onChange) onChange(newUrl);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMessage(null);

    try {
      // 1. Get Signed Upload Ticket from Express API
      const sigRes = await api.post("/media/upload-signature", { folder });
      const { signature, timestamp, apiKey, cloudName } = sigRes.data.data;

      // 2. Direct FormData POST to Cloudinary CDN
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", folder);

      const cloudinaryRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );

      const secureUrl = cloudinaryRes.data.secure_url;
      updateUrl(secureUrl);
    } catch (err: any) {
      console.error(err);
      const backendError = err.response?.data?.error?.message;
      const cdnError = err.response?.data?.error?.message || err.message || "";

      if (
        backendError ||
        cdnError.includes("Unknown API key") ||
        cdnError.includes("Cloudinary") ||
        cdnError.includes("Invalid API key")
      ) {
        setErrorMessage(
          "Cloudinary credentials in apps/backend/.env are unconfigured placeholders ('your_cloudinary_api_key'). Please update CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in apps/backend/.env with your real Cloudinary keys, OR click the 'Image URL / Link' tab to paste any image link directly!"
        );
      } else {
        setErrorMessage(
          "Upload error. Switch to the 'Image URL / Link' tab above to input a direct image link!"
        );
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("file")}
          className={`px-3 py-1.5 rounded-md font-medium transition-all ${
            activeTab === "file"
              ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          📁 File Upload (CDN)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("url")}
          className={`px-3 py-1.5 rounded-md font-medium transition-all ${
            activeTab === "url"
              ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          🔗 Image URL / Link
        </button>
      </div>

      {/* Image Preview & Upload Controls */}
      <div className="flex items-start gap-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
        {imageUrl ? (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-sky-500/40 bg-slate-900 shadow-md shadow-sky-500/10">
            <img src={imageUrl} alt="Profile Preview" className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="h-20 w-20 shrink-0 rounded-xl border border-dashed border-slate-800 bg-slate-900 flex items-center justify-center text-slate-600">
            <ImageIcon className="h-8 w-8" />
          </div>
        )}

        <div className="flex-1 space-y-2">
          {activeTab === "file" ? (
            <div className="space-y-1.5">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-colors border border-slate-700">
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-sky-400" />
                    <span>Uploading to CDN...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 text-sky-400" />
                    <span>Choose Image File</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </label>
              <p className="text-[11px] text-slate-500">Requires valid Cloudinary credentials in backend .env</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="relative">
                <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrl}
                  onChange={(e) => updateUrl(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>
              <p className="text-[11px] text-slate-500">Paste any public profile image link directly</p>
            </div>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed flex items-start gap-2">
          <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
