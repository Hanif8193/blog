"use client";

import { useState } from "react";
import { UploadButton } from "@/lib/uploadthing";
import { X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  onChange: (url?: string) => void;
  value: string;
}

export const ImageUpload = ({
  onChange,
  value
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  if (value) {
    return (
      <div className="relative h-60 w-full max-w-xl">
        <Image
          fill
          src={value}
          alt="Upload"
          className="rounded-xl object-cover border border-gray-200"
        />
        <button
          onClick={() => onChange("")}
          className="absolute -right-3 -top-3 rounded-full bg-red-500 p-2 text-white shadow-lg hover:bg-red-600 transition-colors"
          type="button"
          title="Remove image"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl">
      <UploadButton
        endpoint="imageUploader"
        onUploadBegin={() => setIsUploading(true)}
        onClientUploadComplete={(res) => {
          setIsUploading(false);
          if (res?.[0]) onChange(res[0].url);
        }}
        onUploadError={(error: Error) => {
          setIsUploading(false);
          alert(`Upload failed: ${error.message}`);
        }}
      />
      {isUploading && (
        <p className="mt-2 text-sm text-center text-gray-500 animate-pulse">
          Uploading image, please wait...
        </p>
      )}
    </div>
  );
};
