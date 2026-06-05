"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// ===== Types =====
type Notification = {
  id: string;
  title: string;
  message: string;
  category: string | null;
  read: boolean;
  created_at: string;
  link: string | null;
};

// ===== Component =====
export default function NotificationBell() {
  const router = useRouter();

  // ===== State =====
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // ===== Derived values =====
  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  // ===== Load notifications =====
  async function loadNotifications() {
    const { data, error } = await supabase
      .from("notifications")
      .select("id, title, message, category, read, created_at, link")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Notification load error:", error.message);
      return;
    }

    setNotifications((data ?? []) as Notification[]);
  }

  // ===== Mark all notifications read =====
  async function markAllRead() {
    const unreadIds = notifications
      .filter((notification) => !notification.read)
      .map((notification) => notification.id);

    if (unreadIds.length === 0) return;

    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .in("id", unreadIds);

    if (error) {
      console.error("Notification update error:", error.message);
      return;
    }

    await loadNotifications();
    router.refresh();
  }

  // ===== Initial load + realtime listener =====
  useEffect(() => {
    loadNotifications();

    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
        },
        () => {
          loadNotifications();
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  // ===== UI =====
  return (
    <div className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen((current) => !current)}
        className="relative rounded-xl border p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
        aria-label="Notifications"
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
            <div>
              <h3 className="font-semibold">Notifications</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Recent project updates
              </p>
            </div>

            <button
              onClick={markAllRead}
              className="text-xs font-medium text-slate-500 transition hover:text-slate-900 dark:hover:text-white"
            >
              Mark read
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-sm text-slate-500 dark:text-slate-400">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={notification.link || "#"}
                  onClick={() => setOpen(false)}
                  className={`block border-b border-slate-100 p-4 text-sm transition hover:bg-slate-50 last:border-b-0 dark:border-slate-800 dark:hover:bg-slate-800 ${
                    notification.read
                      ? "opacity-70"
                      : "bg-slate-50 dark:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{notification.title}</p>

                      <p className="mt-1 text-slate-500 dark:text-slate-400">
                        {notification.message}
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>

                    {!notification.read && (
                      <span className="mt-1 h-2 w-2 rounded-full bg-red-500" />
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
