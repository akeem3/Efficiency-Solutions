"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { LuUpload, LuX, LuLoader } from "react-icons/lu";
import Image from "next/image";

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  label?: string;
  currentImage?: string;
}

export default function ImageUpload({
  onUploadSuccess,
  label = "Upload Image",
  currentImage,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    currentImage || null,
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!e.target.files || e.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Upload failed");
      }

      setPreview(result.url);
      onUploadSuccess(result.url);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      alert("Error uploading image: " + errorMessage);
      console.error("Upload error details:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUploadSuccess("");
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {label}
      </label>

      <div className="flex items-center gap-4">
        {preview ? (
          <div className="relative w-24 h-24 border rounded-[10px] overflow-hidden group shrink-0">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
            />
            <button
              onClick={handleRemove}
              type="button"
              className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <LuX className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 border-2 border-dashed border-border rounded-[10px] flex items-center justify-center bg-muted shrink-0">
            <LuUpload className="w-8 h-8 text-muted-foreground" />
          </div>
        )}

        <div className="flex-1">
          <input
            type="file"
            id={`file-${label}`}
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
          />
          <label
            htmlFor={`file-${label}`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "cursor-pointer inline-flex items-center gap-2",
            )}
          >
            {uploading ? (
              <>
                <LuLoader className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Choose File"
            )}
          </label>
          <p className="mt-1 text-xs text-muted-foreground">
            PNG, JPG or WEBP. Max 5MB.
          </p>
        </div>
      </div>
    </div>
  );
}
