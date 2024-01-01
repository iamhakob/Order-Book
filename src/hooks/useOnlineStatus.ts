import { useEffect, useState } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    const setOnline = () => {
      console.log('Internet connection is back');
      setIsOnline(true);
    };
    const setOffline = () => {
      console.log('Internet connection is lost');
      setIsOnline(false);
    };

    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOffline);
    return () => {
      window.removeEventListener('online', setOnline);
      window.removeEventListener('offline', setOffline);
    };
  }, []);

  return isOnline;
}
