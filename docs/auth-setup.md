# Auth Setup Guide

Sign-in is Google-only. The `/account/sign-in` page renders a single Google button,
the `signInWithGoogle` action redirects to Google via `beginGoogleSignIn`, and
`/auth/callback` exchanges the code for a session and forwards to `/workspace`.

The one-time Google configuration — Cloud Console client, Supabase provider toggle,
and the redirect URL allow-list — is documented in `docs/google-login-setup.md`.

Keep every other provider disabled in the Supabase dashboard
(**Authentication → Sign In / Providers**): Email and Azure must be off so the auth
API refuses sign-ups the UI no longer offers.

`handle_new_user` creates the profile for every signup. Accounts start with zero
credits — the first credits come from a purchase at `/account/credits` or an admin
grant at `/admin`.
