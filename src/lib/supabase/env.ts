/**
 * Both values are public by design (the publishable key only grants what RLS
 * allows), so they are NEXT_PUBLIC_ and safe in the browser bundle.
 */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '';

/** False until the Supabase project is connected — the site then renders no projects. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);
