"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";
import { logActivity } from "@/lib/activity";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Project = {
  id: string;
  name: string;
};

type NewDailyLogDialogProps = {
  defaultProjectId?: string;
  triggerText?: string;
  triggerClassName?: string;
};

export default function NewDailyLogDialog({
  defaultProjectId,
  triggerText = "New Daily Log",
  triggerClassName = "rounded-xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900",
}: NewDailyLogDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState(defaultProjectId ?? "");
  const [weather, setWeather] = useState("Clear");
  const [crewCount, setCrewCount] = useState("0");
  const [workCompleted, setWorkCompleted] = useState("");
  const [delays, setDelays] = useState("");
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);

  useEffect(() => {
    async function loadProjects() {
      const { data } = await supabase
        .from("projects")
        .select("id, name")
        .order("name");

      if (data) {
        setProjects(data);
        setProjectId(defaultProjectId ?? data[0]?.id ?? "");
      }
    }

    loadProjects();
  }, [defaultProjectId]);

  async function handleCreateLog(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const photoUrls: string[] = [];

    for (const photo of photos) {
      const cleanFileName = photo.name
        .toLowerCase()
        .replace(/[^a-z0-9.]/g, "-");

      const filePath = `daily-logs/${Date.now()}-${cleanFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, photo, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        setLoading(false);
        alert(uploadError.message);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("documents").getPublicUrl(filePath);

      photoUrls.push(publicUrl);
    }

    const { error } = await supabase.from("daily_logs").insert({
      project_id: projectId,
      weather,
      crew_count: Number(crewCount),
      work_completed: workCompleted,
      delays,
      photo_urls: photoUrls,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    await logActivity("Daily log submitted", "daily-log");

    setOpen(false);
    setWeather("Clear");
    setCrewCount("0");
    setWorkCompleted("");
    setDelays("");

    router.refresh();
    window.location.reload();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={triggerClassName}>
        {triggerText}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Daily Log</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleCreateLog} className="space-y-4">
          <select
            required
            value={projectId}
            onChange={(event) => setProjectId(event.target.value)}
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          <select
            value={weather}
            onChange={(event) => setWeather(event.target.value)}
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          >
            <option>Clear</option>
            <option>Cloudy</option>
            <option>Rain</option>
            <option>Storms</option>
            <option>Windy</option>
            <option>Hot</option>
          </select>

          <input
            type="number"
            min="0"
            value={crewCount}
            onChange={(event) => setCrewCount(event.target.value)}
            placeholder="Crew count"
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

          <textarea
            required
            value={workCompleted}
            onChange={(event) => setWorkCompleted(event.target.value)}
            placeholder="Work completed today"
            className="min-h-28 w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

          <textarea
            value={delays}
            onChange={(event) => setDelays(event.target.value)}
            placeholder="Delays, issues, safety concerns, or notes"
            className="min-h-28 w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(event) => {
              setPhotos(Array.from(event.target.files ?? []));
            }}
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

          <button
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-700 disabled:opacity-50 dark:bg-white dark:text-slate-900"
          >
            {loading ? "Submitting..." : "Submit Daily Log"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
