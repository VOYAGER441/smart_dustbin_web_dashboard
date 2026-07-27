"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  Bug,
  Camera,
  CheckCircle2,
  Droplets,
  Hammer,
  HelpCircle,
  Leaf,
  MapPin,
  Send,
  Trash2,
  X,
} from "lucide-react";
import type { BinData } from "./data/binStatusData";

const CATEGORIES = [
  { value: "Overflow", label: "Overflow", icon: AlertTriangle },
  { value: "Hygiene", label: "Smell / Hygiene", icon: Droplets },
  { value: "Pest", label: "Pests / Animals", icon: Bug },
  { value: "Damage", label: "Damaged bin", icon: Hammer },
  { value: "Maintenance", label: "Maintenance", icon: Trash2 },
  { value: "Other", label: "Something else", icon: HelpCircle },
] as const;

type Category = (typeof CATEGORIES)[number]["value"];

const MAX_PHOTO_BYTES = 3_000_000;

interface CitizenReportFormProps {
  bin: BinData;
}

export default function CitizenReportForm({ bin }: CitizenReportFormProps) {
  const [category, setCategory] = useState<Category | "">("");
  const [description, setDescription] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [reporterContact, setReporterContact] = useState("");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => category !== "" && description.trim().length >= 10 && submitState !== "submitting",
    [category, description, submitState]
  );

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_PHOTO_BYTES) {
      setErrorMsg("Photo is too large (max ~3 MB). Please take a smaller picture.");
      return;
    }
    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhotoDataUrl(reader.result);
        setPhotoName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitState("submitting");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/v1/citizen-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          binId: bin.id,
          category,
          description: description.trim(),
          reporterName: reporterName.trim() || undefined,
          reporterContact: reporterContact.trim() || undefined,
          photoDataUrl: photoDataUrl ?? undefined,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        report?: { id: string };
        error?: string;
      };

      if (!res.ok) {
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }

      setReportId(data.report?.id ?? null);
      setSubmitState("success");
    } catch (err) {
      setSubmitState("error");
      setErrorMsg(err instanceof Error ? err.message : "Submission failed");
    }
  };

  if (submitState === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-gray-950 to-gray-950 text-gray-100 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md rounded-3xl border border-emerald-500/30 bg-gray-900/85 backdrop-blur p-8 text-center space-y-5">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
            <CheckCircle2 className="w-8 h-8 text-emerald-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Thank you!</h1>
            <p className="mt-2 text-gray-400">
              Your report for <span className="font-mono text-cyan-300">{bin.id}</span> has been received.
              The municipal team will review it shortly.
            </p>
            {reportId && (
              <p className="mt-3 text-xs text-gray-500">
                Reference id: <span className="font-mono">{reportId}</span>
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setSubmitState("idle");
                setCategory("");
                setDescription("");
                setReporterName("");
                setReporterContact("");
                setPhotoDataUrl(null);
                setPhotoName("");
                setReportId(null);
              }}
              className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-5 py-2.5 text-sm font-semibold text-emerald-200 hover:bg-emerald-500/20"
            >
              Submit another report
            </button>
            <Link
              href="/"
              className="rounded-full border border-gray-700 px-5 py-2.5 text-sm text-gray-300 hover:bg-gray-800"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-950/85 backdrop-blur px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-500">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-300">Smart Dustbin</p>
            <h1 className="text-lg font-bold text-white">Citizen report</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-8 space-y-6">
        <section className="rounded-3xl border border-gray-800 bg-gray-900/80 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-gray-500">Reporting bin</p>
          <p className="mt-2 text-2xl font-bold text-white">{bin.id}</p>
          <div className="mt-2 flex items-start gap-2 text-sm text-gray-400">
            <MapPin className="mt-0.5 w-4 h-4 text-cyan-300 shrink-0" />
            <span>{bin.address}</span>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-3xl border border-gray-800 bg-gray-900/80 p-5">
            <p className="text-sm font-semibold text-white">What&apos;s wrong?</p>
            <p className="mt-1 text-xs text-gray-500">Pick the closest match.</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {CATEGORIES.map((c) => {
                const Icon = c.icon;
                const active = category === c.value;
                return (
                  <button
                    type="button"
                    key={c.value}
                    onClick={() => setCategory(c.value)}
                    className={`flex flex-col items-start gap-2 rounded-2xl border p-3 text-left text-sm transition ${
                      active
                        ? "border-cyan-400/60 bg-cyan-500/10 text-cyan-100"
                        : "border-gray-800 bg-gray-950/60 text-gray-300 hover:border-gray-700"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${active ? "text-cyan-300" : "text-gray-400"}`} />
                    <span className="font-medium">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-3xl border border-gray-800 bg-gray-900/80 p-5 space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-white">Describe the issue</span>
              <span className="block text-xs text-gray-500 mt-0.5">
                A short note helps us prioritize. Minimum 10 characters.
              </span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="e.g. The bin is overflowing and there's loose trash on the footpath."
                className="mt-3 w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
                minLength={10}
                maxLength={500}
              />
              <span className="mt-1 block text-right text-[10px] text-gray-600">
                {description.length}/500
              </span>
            </label>

            <div>
              <p className="text-sm font-semibold text-white">Photo (optional)</p>
              <p className="text-xs text-gray-500 mt-0.5">
                A picture helps the field team see the situation.
              </p>
              {photoDataUrl ? (
                <div className="mt-3 relative">
                  <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-gray-800">
                    <Image
                      src={photoDataUrl}
                      alt={photoName || "Citizen photo"}
                      fill
                      unoptimized
                      sizes="100vw"
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoDataUrl(null);
                      setPhotoName("");
                    }}
                    className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/90"
                    aria-label="Remove photo"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <p className="mt-2 text-xs text-gray-500 truncate">{photoName}</p>
                </div>
              ) : (
                <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-gray-700 bg-gray-950/60 px-4 py-5 text-sm text-gray-300 hover:border-cyan-500/50 hover:bg-cyan-500/5">
                  <Camera className="h-5 w-5 text-cyan-300" />
                  <span>Take or upload a photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-gray-800 bg-gray-900/80 p-5 space-y-4">
            <p className="text-sm font-semibold text-white">Your details (optional)</p>
            <p className="text-xs text-gray-500 -mt-2">
              Share these only if you&apos;d like a follow-up.
            </p>
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-gray-500">Name</span>
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="Your name"
                maxLength={80}
                className="mt-1 w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-gray-500">Phone or email</span>
              <input
                type="text"
                value={reporterContact}
                onChange={(e) => setReporterContact(e.target.value)}
                placeholder="Optional contact"
                maxLength={80}
                className="mt-1 w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </label>
          </section>

          {errorMsg && (
            <div className="rounded-2xl border border-red-700/60 bg-red-900/20 p-3 text-sm text-red-200">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitState === "submitting" ? (
              "Sending…"
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit report
              </>
            )}
          </button>

          <p className="pb-6 text-center text-[11px] text-gray-600">
            By submitting, you agree to share this information with the municipal waste team.
          </p>
        </form>
      </main>
    </div>
  );
}
