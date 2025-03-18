import { supabase } from "@/supabase/supabase";

export async function getCurrentUser() {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
        console.error('Error getting session:', error);
        return null;
    }

    if (data && data.session) {
        return data.session.user;
    }

    return null;
}