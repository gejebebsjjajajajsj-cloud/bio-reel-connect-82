-- Create analytics table to track site visits and button clicks
CREATE TABLE public.analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL, -- 'page_view' or 'button_click'
  event_data JSONB, -- stores button name, url, etc
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all access (since this is public analytics data)
CREATE POLICY "Allow all access to analytics" 
ON public.analytics 
FOR ALL 
USING (true) 
WITH CHECK (true);