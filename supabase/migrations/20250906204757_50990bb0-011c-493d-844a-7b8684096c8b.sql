-- Create table for store settings
CREATE TABLE public.store_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  name TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  logo TEXT NOT NULL DEFAULT '',
  logo_image TEXT NOT NULL DEFAULT '',
  background_video TEXT NOT NULL DEFAULT '',
  background_image TEXT NOT NULL DEFAULT '',
  whatsapp_message TEXT NOT NULL DEFAULT '',
  social_links JSONB NOT NULL DEFAULT '{}',
  main_actions JSONB NOT NULL DEFAULT '[]',
  secondary_actions JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a single-user store configuration)
CREATE POLICY "Store settings are publicly viewable" 
ON public.store_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Store settings can be updated by anyone" 
ON public.store_settings 
FOR UPDATE 
USING (true);

CREATE POLICY "Store settings can be inserted by anyone" 
ON public.store_settings 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_store_settings_updated_at
BEFORE UPDATE ON public.store_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default data
INSERT INTO public.store_settings (
  name, 
  description, 
  logo, 
  logo_image, 
  whatsapp_message,
  social_links,
  main_actions,
  secondary_actions
) VALUES (
  'GRIFFES MIL GRAU',
  'AUMENTE SUA AUTOESTIMA MONTANDO UM KIT NOVO',
  '👔',
  '/lovable-uploads/cf93430e-b1b6-417e-ad5d-9896eff54b2f.png',
  'Olá! Vi seu perfil e tenho interesse nos produtos da GRIFFES MIL GRAU. Pode me ajudar?',
  '{"instagram": "https://instagram.com", "tiktok": "https://tiktok.com", "phone": "tel:+5511999999999", "location": "https://maps.google.com"}',
  '[{"title": "CATÁLOGO", "subtitle": "Veja nossa coleção completa", "href": "https://catalogo.com", "icon": "Grid3X3"}, {"title": "LOCALIZAÇÃO", "subtitle": "Encontre nossa loja", "href": "https://maps.google.com", "icon": "MapPin"}, {"title": "ATENDIMENTO WHATSAPP", "subtitle": "Fale conosco agora", "href": "https://wa.me/5511999999999", "icon": "MessageCircle"}]',
  '[{"title": "DELIVERY", "subtitle": "Entrega rápida", "href": "#delivery", "icon": "Package"}, {"title": "FRETE", "subtitle": "Consulte valores", "href": "#frete", "icon": "Truck"}, {"title": "AVALIAÇÕES", "subtitle": "Veja opiniões", "href": "#avaliacoes", "icon": "Star"}]'
);