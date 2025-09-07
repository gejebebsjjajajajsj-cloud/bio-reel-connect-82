import React from 'react';
import { Button } from '@/components/ui/button';
import { Instagram, MessageCircle, MapPin, Phone } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';

const SocialLinks: React.FC = () => {
  const { data } = useStore();
  
  const socialLinks = [
    { icon: Instagram, label: 'Instagram', href: data.socialLinks.instagram },
    { icon: MessageCircle, label: 'TikTok', href: data.socialLinks.tiktok },
    { icon: Phone, label: 'Telefone', href: data.socialLinks.phone },
    { icon: MapPin, label: 'Localização', href: data.socialLinks.location }
  ];

  return (
    <div className="flex justify-center gap-3 mb-8 animate-fade-in">
      {socialLinks.map((social, index) => (
        <Button
          key={social.label}
          variant="social"
          size="icon"
          className="rounded-full"
          style={{ animationDelay: `${index * 0.1}s` }}
          onClick={() => window.open(social.href, '_blank')}
        >
          <social.icon className="w-5 h-5" />
        </Button>
      ))}
    </div>
  );
};

export default SocialLinks;