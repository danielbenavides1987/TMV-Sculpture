import { createClient } from '@supabase/supabase-js';

// Configuration from prompt
const supabaseUrl = 'https://mdxkdkslrhmdwrddlwww.supabase.co';
const supabaseKey = 'sb_publishable_EO8hjvNpmJnzH4UoqQpnUA_DxT22j8A';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper for image URLs if needed
export const getStorageUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${supabaseUrl}/storage/v1/object/public/tmv-assets/${path}`;
};
