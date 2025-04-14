
-- Create table for storing email subscriptions
CREATE TABLE IF NOT EXISTS public.email_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add comment to the table
COMMENT ON TABLE public.email_subscriptions IS 'Stores email addresses of users interested in the app launch';

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_email ON public.email_subscriptions(email);

-- Make the table accessible to anon users via the edge function only
ALTER TABLE public.email_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy that allows service role to insert
CREATE POLICY "Service can manage email subscriptions"
ON public.email_subscriptions
FOR ALL
TO service_role
USING (true);
