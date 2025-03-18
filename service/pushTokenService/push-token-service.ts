import { supabase } from "@/supabase/supabase";
export default async function pushTokenService(token: string, userId: string) {
    try {
        const { data, error } = await supabase.from('pushTokens').insert({
            userId: userId,
            pushToken: token
        });
        if (error) {
            console.error(error);
            throw error;
        }
    } catch (error) {
        console.error(error);
        throw error
    }
}