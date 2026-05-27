import { supabase } from "@/lib/supabase";

export async function logActivity(message: string, type = "update") {
  await supabase.from("activity_logs").insert({
    message,
    type,
  });
}