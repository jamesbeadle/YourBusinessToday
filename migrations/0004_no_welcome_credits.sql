-- New accounts start with zero credits.
-- Drops the welcome-credit function and, via cascade, the auth.users trigger
-- that granted 300 credits once an email was confirmed. handle_new_user still
-- creates the profile for every signup; an account's first credits now come
-- only from a purchase or an admin grant.

begin;

drop function if exists public.grant_welcome_credits() cascade;

commit;
