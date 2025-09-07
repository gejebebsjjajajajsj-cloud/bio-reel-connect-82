-- Create admin users table for login credentials
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow reading admin users (needed for login verification)
CREATE POLICY "Allow reading admin users for authentication" 
ON public.admin_users 
FOR SELECT 
USING (true);

-- Insert the admin user with the credentials provided
-- Note: In production, passwords should be properly hashed
INSERT INTO public.admin_users (username, password_hash) 
VALUES ('grife455', 'grife45@@');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();