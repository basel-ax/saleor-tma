import { useEffect, useState, useCallback, useRef } from 'react';

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  initData: string;
  initDataUnsafe: Record<string, unknown>;
  themeParams: Record<string, string>;
  colorScheme: string;
  MainButton: {
    setParams: (params: Record<string, unknown>) => void;
    show: () => void;
    hide: () => void;
    showProgress: () => void;
    hideProgress: () => void;
    onClick: (callback: () => void) => void;
  };
  onEvent: (event: string, callback: () => void) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export function useTMA() {
  const [initialized, setInitialized] = useState(false);
  const [themeParams, setThemeParams] = useState<Record<string, string>>({});
  const mainButtonRef = useRef<TelegramWebApp['MainButton'] | null>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    
    if (tg) {
      tg.ready();
      setInitialized(true);
      mainButtonRef.current = tg.MainButton;

      // Set initial theme params
      if (tg.themeParams) {
        setThemeParams(tg.themeParams);
      }

      // Listen for theme changes
      tg.onEvent('themeChanged', () => {
        if (tg.themeParams) {
          setThemeParams(tg.themeParams);
        }
      });
    }
  }, []);

  const onMainButtonClick = useCallback((callback: () => void) => {
    if (mainButtonRef.current) {
      mainButtonRef.current.onClick(callback);
    }
  }, []);

  return {
    initialized,
    mainButton: mainButtonRef.current,
    themeParams,
    onMainButtonClick,
    expand: () => window.Telegram?.WebApp?.expand?.(),
    close: () => window.Telegram?.WebApp?.close?.(),
  };
}
