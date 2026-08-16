"use server";

import { createClient } from "@/lib/supabase/server";

export interface UserProfileData {
  id?: string;
  display_name?: string;
  username?: string;
  avatar_url?: string;
  country?: string;
  grade?: string;
  interface_language?: string;
  content_language?: string;
  theme?: string;
  learning_track?: string;
  sub_goals?: string[];
  daily_target?: string;
  elo_rating?: number;
  streak_count?: number;
  total_questions_solved?: number;
}

/**
 * Server Action: Fetch current user profile from Supabase
 */
export async function getProfileServerAction(): Promise<{ success: boolean; data?: UserProfileData; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Oturum bulunamadı" };
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Server Action: Update user profile and learning goals in Supabase
 */
export async function updateProfileServerAction(profile: UserProfileData): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Oturum bulunamadı" };
    }

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        ...profile,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
