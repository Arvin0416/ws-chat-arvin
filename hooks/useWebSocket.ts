import { useEffect, useRef, useCallback } from "react";

export function useWebSocket({
    url,
    onOpen,
    onMessage,
    onClose,
    onError,
    enabled = true,
}: {
    url: string;
    onOpen?: (event: Event) => void;
    onMessage?: (event: MessageEvent) => void;
    onClose?: (event: CloseEvent) => void;
    onError?: (event: Event) => void;
    enabled?: boolean;
}) {
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!enabled) return;
        const ws = new WebSocket(url);
        wsRef.current = ws;
        if (onOpen) ws.addEventListener("open", onOpen);
        if (onMessage) ws.addEventListener("message", onMessage);
        if (onClose) ws.addEventListener("close", onClose);
        if (onError) ws.addEventListener("error", onError);
        return () => {
            ws.close();
            wsRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url, enabled]);

    const send = useCallback((data: string) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(data);
        }
    }, []);

    return { ws: wsRef.current, send };
}
