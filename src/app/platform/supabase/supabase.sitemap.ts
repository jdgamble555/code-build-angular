import { environment } from "@env/environment";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    environment.supabase_url,
    environment.supabase_key
);

