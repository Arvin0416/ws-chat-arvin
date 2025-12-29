import { useEffect, useRef, useCallback } from 'react';
import type { UseWebSocketProps as UseWebSocketParams } from '@/types/websocket';

export function useWebSocket({
    url,
    onOpen,
    onMessage,
    onClose,
    onError,
    enabled = true,
}: UseWebSocketParams) {
    const wsRef = useRef<WebSocket | null>(null);

    const handlersRef = useRef({
        onOpen,
        onMessage,
        onClose,
        onError,
    });

    useEffect(() => {
        handlersRef.current = { onOpen, onMessage, onClose, onError };
    }, [onOpen, onMessage, onClose, onError]);

    useEffect(() => {
        if (!enabled) return;

        const ws = new WebSocket(url);
        wsRef.current = ws;

        const { onOpen, onMessage, onClose, onError } = handlersRef.current;

        if (onOpen) ws.addEventListener('open', onOpen);
        if (onMessage) ws.addEventListener('message', onMessage);
        if (onClose) ws.addEventListener('close', onClose);
        if (onError) ws.addEventListener('error', onError);

        return () => {
            ws.close();
            wsRef.current = null;
        };
    }, [url, enabled]);

    const send = useCallback((data: string) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(data);
        }
    }, []);

    return { ws: wsRef, send };
}
