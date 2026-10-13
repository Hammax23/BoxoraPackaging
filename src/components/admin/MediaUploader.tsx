"use client";

import { Loader2, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

/** Drag-and-drop / click uploader for the media library. Uploads one file at a time and refreshes the grid. */
export default function MediaUploader() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const uploadAll = async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (list.length === 0) return;
    setBusy(true);
    setMessage(null);
    let ok = 0;
    let failure: string | null = null;
    for (const file of list) {
      try {
        const fd = new FormData();
        fd.set("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
        if (res.ok && data?.ok) ok++;
        else failure = data?.error ?? `Could not upload ${file.name}.`;
      } catch {
        failure = "Could not reach the server.";
      }
    }
    setBusy(false);
    setMessage(failure ? `${ok} uploaded. ${failure}` : `${ok} image${ok === 1 ? "" : "s"} uploaded.`);
    router.refresh();
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          void uploadAll(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={`flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
          over ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        }`}
      >
        {busy ? <Loader2 className="h-7 w-7 animate-spin text-primary" /> : <UploadCloud className="h-7 w-7 text-primary" />}
        <p className="font-semibold text-dark">{busy ? "Uploading…" : "Drop images here or click to browse"}</p>
        <p className="text-xs text-lighter">PNG, JPG, WEBP or GIF · up to 8 MB each</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files) void uploadAll(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
      {message && (
        <p role="status" className="mt-3 text-sm font-semibold text-text">
          {message}
        </p>
      )}
    </div>
  );
}
