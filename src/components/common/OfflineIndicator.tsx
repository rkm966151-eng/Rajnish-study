import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { t } = useLanguage();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-xs font-medium text-white shadow-lg animate-bounce">
      <WifiOff className="w-4 h-4" />
      <span>{t.common.offlineMessage}</span>
    </div>
  );
};
