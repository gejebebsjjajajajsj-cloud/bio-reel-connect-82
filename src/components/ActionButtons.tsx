import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid3X3, MapPin, MessageCircle, Package, Truck, Star } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { useAnalytics } from '@/hooks/useAnalytics';

const iconMap = {
  Grid3X3,
  MapPin,
  MessageCircle,
  Package,
  Truck,
  Star
};

const ActionButtons: React.FC = () => {
  const { data } = useStore();
  const { trackButtonClick } = useAnalytics();

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Main Action Buttons */}
      <div className="space-y-4">
        {data.mainActions.map((action, index) => {
          const IconComponent = iconMap[action.icon as keyof typeof iconMap] || Grid3X3;
          return (
            <Button
              key={action.title}
              variant="link-action"
              className="w-full h-16 justify-start text-left p-6 animate-fade-in"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              onClick={() => {
                // Track button click
                trackButtonClick(action.title, action.href);
                
                if (action.icon === 'MessageCircle' && action.href.includes('wa.me')) {
                  const phoneNumber = action.href.replace('https://wa.me/', '');
                  const encodedMessage = encodeURIComponent(data.whatsappMessage);
                  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
                  window.open(whatsappUrl, '_blank');
                } else {
                  window.open(action.href, '_blank');
                }
              }}
            >
              <IconComponent className="w-6 h-6 mr-4 text-white" />
              <div className="flex-1">
                <div className="font-semibold text-base">{action.title}</div>
                <div className="text-sm text-muted-foreground">{action.subtitle}</div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default ActionButtons;