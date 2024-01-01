import { useEffect, useState } from 'react';

import { useOnlineStatus } from './useOnlineStatus';

export function useSocketConnect(url: string, shouldConnect: boolean) {
  const isOnline = useOnlineStatus();
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!shouldConnect || !isOnline) return;

    const ws = new WebSocket(url);
    ws.onopen = () => {
      setSocket(ws);
      console.log('WebSocket opened');
    };
    ws.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      //to avoid closing a ws that has not been established yet
      if (ws.readyState === ws.CONNECTING) {
        ws.onopen = () => ws?.close();
      } else {
        ws.close();
      }
    };
  }, [url, shouldConnect, isOnline]);

  return socket;
}
