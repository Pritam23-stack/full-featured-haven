
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://agmbptbllklzsswazfwm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnbWJwdGJsbGtsenNzd2F6ZndtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNjc2NTAsImV4cCI6MjA1ODY0MzY1MH0.b4HGHwVCyV1OqWxVHsddvzjfj0f_wSJC2p2XEkxiqkw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});
