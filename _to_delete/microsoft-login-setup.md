# Microsoft (Entra ID) login — one-time setup

The code side is done: the sign-in page now has a "Continue with Microsoft" button that
starts a Supabase OAuth flow with the `azure` provider and lands on the existing
`/auth/callback` handler. For it to work, Supabase needs an Azure app registration.

## 1. Create the Azure app registration

1. Go to https://portal.azure.com → **Microsoft Entra ID** → **App registrations** → **New registration**.
2. Name: `Your Business Today`.
3. **Supported account types**: choose **"Accounts in any organizational directory (Any Microsoft Entra ID tenant – Multitenant)"**.
   This is what allows any corporate email to sign in while rejecting personal
   @outlook.com / @hotmail accounts.
4. **Redirect URI**: platform **Web**, value:

   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```

   (Copy the exact URL from the Supabase dashboard in step 2 below — it shows it under
   the Azure provider settings.)
5. Register, then note the **Application (client) ID** from the Overview page.
6. Go to **Certificates & secrets** → **New client secret**. Copy the secret **Value**
   immediately (it is only shown once). Note the expiry — Azure secrets max out at
   ~2 years, so put a renewal reminder in the calendar.

## 2. Enable the provider in Supabase

1. Supabase dashboard → your project → **Authentication** → **Sign In / Providers** → **Azure**.
2. Toggle it on and fill in:
   - **Client ID**: the Application (client) ID from step 1.
   - **Secret**: the client secret value from step 1.
   - **Azure Tenant URL**: `https://login.microsoftonline.com/organizations`
     (`organizations` = any work/school tenant; matches the multitenant registration).
3. Save.

## 3. Optional but recommended

- In the Azure app registration under **Token configuration**, add the optional claim
  `email` to ID tokens, so accounts whose UPN differs from their mail address still
  report a proper email to Supabase.
- **Account linking**: Supabase links OAuth identities by verified email. Someone who
  signed up with Google using their corporate address and later uses Microsoft with the
  same address ends up in the same account, as long as the email is verified by the
  provider. No action needed, just worth knowing.

## 4. Test

1. `npm run dev`, open `/account/sign-in`.
2. Click **Continue with Microsoft**, sign in with a work/school account.
3. You should land on `/workspace` with a session, and the user appears in
   Supabase → Authentication → Users with provider `azure`.
4. Also confirm a personal Microsoft account is rejected at the Microsoft login screen
   ("You can't sign in here with a personal account").
