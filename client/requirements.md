## Packages
@supabase/supabase-js | Supabase client for potential auth/realtime
framer-motion | For smooth page transitions and premium UI animations
lucide-react | Iconography (already in base but explicit check)
recharts | For Admin and Doctor dashboard statistics
clsx | Utility for conditional classes
tailwind-merge | Utility for merging tailwind classes

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  display: ["'Playfair Display'", "serif"],
  sans: ["'DM Sans'", "sans-serif"],
}

Integration:
- Supabase credentials provided in prompt will be used in client/src/lib/supabase.ts
- Auth flow will mock roles via simple selection if Supabase Auth is not fully configured backend-side, but UI will support full role-based access.
