# Auth Setup Guide

The code supports Google, Microsoft, and email + password with verification. Each provider
needs one-time configuration in the Supabase dashboard before it works.

## Email verification

1. In Supabase: **Authentication → Sign In / Up → Email** — enable **Confirm email**.
2. In **Authentication → URL Configuration**, set the Site URL to the production domain and
   add redirect URLs for every environment:
   - `http://localhost:5173/auth/callback`
   - `https://<production-domain>/auth/callback`
3. Welcome credits are granted by a database trigger only when the email is confirmed, so
   unverified signups cost nothing.

The default Supabase email sender is fine for testing but rate-limited (a few emails per
hour). Point **Authentication → Emails → SMTP** at a real sender before launch.

## Google

1. In [Google Cloud Console](https://console.cloud.google.com), create a project, then
   **APIs & Services → Credentials → Create OAuth client ID** (type: Web application).
2. Add the authorised redirect URI shown in Supabase under
   **Authentication → Sign In / Up → Google** — it looks like
   `https://<project-ref>.supabase.co/auth/v1/callback`.
3. Copy the client ID and secret into that same Supabase screen and enable the provider.
4. Configure the OAuth consent screen (app name, support email) — external, published.

## Microsoft

Supabase calls this provider **Azure**.

1. In [Azure Portal](https://portal.azure.com), **Microsoft Entra ID → App registrations →
   New registration**. Supported account types: **personal + work and school** (multitenant)
   so any Microsoft account can sign in.
2. Add a Web redirect URI: the same `https://<project-ref>.supabase.co/auth/v1/callback`.
3. Under **Certificates & secrets**, create a client secret.
4. In Supabase, **Authentication → Sign In / Up → Azure**: paste the application (client) id
   and secret, set the tenant URL to `https://login.microsoftonline.com/common`, and enable.

## How the pieces connect

- The sign-in page posts to `signInWithGoogle` / `signInWithMicrosoft`, which redirect to
  the provider via `beginOAuthSignIn`.
- Every flow — OAuth and email verification links — lands on `/auth/callback`, which
  exchanges the code for a session and forwards to `/workspace`.
- `handle_new_user` creates the profile for every signup; welcome credits arrive via
  `grant_welcome_credits` only once `email_confirmed_at` is set (immediately for OAuth,
  on link-click for email).
