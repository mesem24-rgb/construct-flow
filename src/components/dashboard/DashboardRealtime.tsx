"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DashboardRealtime() {
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel("dashboard-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
        },
        (payload) => {
          console.log("Dashboard task realtime:", payload);
          router.refresh();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "projects",
        },
        (payload) => {
          console.log("Dashboard project realtime:", payload);
          router.refresh();
        },
      )
      .subscribe((status) => {
        console.log("Dashboard realtime status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}