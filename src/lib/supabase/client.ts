import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './database.types';
import { supabasePublishableKey, supabaseUrl } from './env';

/**
 * Browser client for the back-office, signed in through the same session
 * cookies as the server. Only used to upload photos straight to Storage.
 */
export function createClient() {
  return createBrowserClient<Database>(supabaseUrl, supabasePublishableKey);
}
