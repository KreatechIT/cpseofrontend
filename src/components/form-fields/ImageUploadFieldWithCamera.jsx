"use client";

import {
  AlertCircleIcon,
  CameraIcon,
  ImageIcon,
  PaperclipIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { Button } from "@/components/ui/button";

export default function ImageUploadFieldWithCamera({
  onFileChange,
  initialFiles,
}) {
  const maxSizeMB = 4;
  const maxSize = maxSizeMB * 1024 * 1024;

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
      addFiles,
    },
  ] = useFileUpload({
    accept: "image/png,image/jpeg,image/jpg",
    maxSize,
    initialFiles,
  });

  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (files[0]?.file && onFileChange) {
      onFileChange(files[0].file);
    }
  }, [files, onFileChange]);

  const previewUrl = files[0]?.preview || null;
  const fileName = files[0]?.file.name || null;

  const handleOpenCamera = async () => {
    setCameraError(null);
    setShowCamera(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (error) {
      console.error("Camera access error:", error);
      setCameraError("Unable to access the camera.");
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setShowCamera(false);
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "camera-image.jpg", {
          type: "image/jpeg",
        });

        addFiles([file]); // ✅ Adds to useFileUpload state
        onFileChange?.(file); // ✅ Updates parent/form state
      }
      stopCamera();
    }, "image/jpeg");
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Drop area */}
      <div className="relative">
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-44 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-2 py-0 transition-colors has-[input:focus]:ring-[3px] bg-white dark:bg-white/5"
        >
          <input
            {...getInputProps()}
            className="sr-only"
            aria-label="Upload image file"
          />

          {previewUrl ? (
            <div className="absolute inset-0 flex items-center justify-center p-4 bg-white dark:bg-white/5">
              <img
                src={previewUrl}
                alt={fileName || "Uploaded image"}
                className="mx-auto max-h-full rounded object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 text-center">
              <div
                className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                aria-hidden="true"
              >
                <ImageIcon className="size-4 opacity-60" />
              </div>
              <p className="mb-1.5 text-sm font-medium">Drop your image here</p>
              <p className="text-muted-foreground text-xs">
                PNG, JPG or JPEG (max. {maxSizeMB}MB)
              </p>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  onClick={openFileDialog}
                  type="button"
                >
                  <UploadIcon className="-ms-1 size-4 opacity-60" />
                  Select image
                </Button>
                <Button
                  variant="outline"
                  onClick={handleOpenCamera}
                  type="button"
                >
                  <CameraIcon className="-ms-1 size-4 opacity-60" />
                  Take picture
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Remove image button */}
        {previewUrl && (
          <div className="absolute top-4 right-4">
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
              onClick={() => removeFile(files[0]?.id)}
              aria-label="Remove image"
            >
              <XIcon className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {/* Error message */}
      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}

      {/* File name */}
      {fileName && (
        <div className="flex items-center gap-1 text-xs">
          <PaperclipIcon className="size-3 shrink-0" />
          <span>{fileName}</span>
        </div>
      )}

      {/* Camera error */}
      {cameraError && <p className="text-red-500 text-sm">{cameraError}</p>}

      {/* Camera UI overlay */}
      {showCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative flex flex-col items-center">
            <video
              ref={videoRef}
              className="rounded-md max-w-full max-h-[80vh]"
              autoPlay
              playsInline
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="mt-4 flex gap-3">
              <Button type="button" onClick={handleCapture}>
                Capture
              </Button>
              <Button type="button" variant="destructive" onClick={stopCamera}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
