import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const createPublicClient = () => {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// Add alias for backward compatibility:
export const createClient = createPublicClient;
