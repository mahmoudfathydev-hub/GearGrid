"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Upload, Image as ImageIcon, Trash2 } from "lucide-react";
import { uploadMultipleImages } from "@/lib/cloudinary";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [cloudinaryConfigured, setCloudinaryConfigured] = useState(true);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});

  // Check Cloudinary configuration on mount
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      setCloudinaryConfigured(false);
      console.warn("Cloudinary not configured. Using placeholder images.");
    }
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (disabled) return;

      if (acceptedFiles.length === 0) {
        toast.error("Please select at least one image");
        return;
      }

      if (value.length + acceptedFiles.length > 4) {
        toast.error("Maximum 4 images allowed");
        return;
      }

      setUploading(true);
      setUploadProgress({});

      try {
        toast.info(
          `Uploading ${acceptedFiles.length} image${acceptedFiles.length > 1 ? "s" : ""}...`,
        );

        const urls = await uploadMultipleImages(acceptedFiles);
        onChange([...value, ...urls]);

        // Show success message
        toast.success(
          `${acceptedFiles.length} image${acceptedFiles.length > 1 ? "s" : ""} uploaded successfully!`,
        );

        if (!cloudinaryConfigured) {
          console.log(
            "Using placeholder images until Cloudinary is configured",
          );
        }
      } catch (error) {
        console.error("Upload failed:", error);
        // Show specific error message
        if (error instanceof Error) {
          toast.error(`Upload failed: ${error.message}`);
        } else {
          toast.error("Upload failed. Please try again.");
        }
      } finally {
        setUploading(false);
        setUploadProgress({});
      }
    },
    [value, onChange, disabled, cloudinaryConfigured],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: true,
    disabled,
  });

  const removeImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
    toast.success("Image removed");
  };

  return (
    <div className="space-y-6">
      {/* Configuration Status */}
      {!cloudinaryConfigured && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ Cloudinary is not configured. Using placeholder images for
            testing. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME to enable real
            uploads.
          </p>
        </div>
      )}

      {cloudinaryConfigured && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            💡 Upload 1-4 images. Maximum file size: 10MB each.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Area */}
        <div>
          <Card
            {...getRootProps()}
            className={`border-2 border-dashed transition-colors cursor-pointer h-64 ${
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            } ${disabled || !cloudinaryConfigured ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input {...getInputProps()} />
            <div className="p-8 text-center h-full flex flex-col justify-center">
              <div className="mx-auto w-12 h-12 mb-4 text-gray-400">
                {uploading ? (
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
                ) : (
                  <Upload className="w-full h-full" />
                )}
              </div>
              <p className="text-lg font-medium text-gray-900 mb-2">
                {uploading
                  ? "Processing images..."
                  : cloudinaryConfigured
                    ? "Drop images here"
                    : "Drop images for placeholder"}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {cloudinaryConfigured
                  ? "or click to select files"
                  : "Images will be replaced with placeholders until Cloudinary is configured"}
              </p>
              <Button type="button" variant="outline" disabled={disabled}>
                <ImageIcon className="w-4 h-4 mr-2" />
                Choose Images
              </Button>
            </div>
          </Card>
        </div>

        {/* Preview Area */}
        {value.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Uploaded Images ({value.length}/4)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {value.map((url, index) => (
                <Card key={index} className="relative group overflow-hidden">
                  <div className="w-full h-[100px] overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <img
                      src={url}
                      alt={`Upload ${index + 1}`}
                      className="max-w-full max-h-[100px] object-cover transition-transform group-hover:scale-105"
                      onLoad={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "block";
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                  <div className="p-2 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                      Image {index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeImage(index)}
                      disabled={disabled}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
