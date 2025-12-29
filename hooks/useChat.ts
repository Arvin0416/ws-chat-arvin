
'use client';
import { useState, useCallback } from "react";
import { v4 as uuidv4 } from 'uuid';
import { showToast } from "@/components/ToastProvider";
import { useWebSocket } from "./useWebSocket";


type ChatMessage = {
    type: string;
    username: string;
    user_id: string;
    content: string;
    timestamp?: string;
    channel?: string;
};

export function useChat() {
    const [connected, setConnected] = useState(false);
    const [userId, setUserId] = useState("");
    const [username, setUsername] = useState("");
    const [channel, setChannel] = useState("general");
    const [showModal, setShowModal] = useState(true);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");

    // WebSocket URL (local development)
    // Only connect when modal is closed (after clicking Connect)
    const wsUrl = !showModal && channel && username ? `ws://localhost:8080/ws?channel=${channel}&username=${encodeURIComponent(username)}` : "";

    // Handlers for WebSocket events
    const handleWsOpen = useCallback(() => {
        setConnected(true);
        showToast.success("Connected to chat server.");
    }, []);

    const handleWsMessage = useCallback((event: MessageEvent) => {
        try {
            const data = JSON.parse(event.data);
            console.log('[FRONTEND-MESSAGE]', data);
            // If the backend assigns a user_id to this client, update it
            if (data.type === 'user_connected' && data.username === username && data.user_id && !userId) {
                setUserId(data.user_id);
            }
            // Only add the message if it's not an echo of the last own message
            setMessages(prev => {
                // Only suppress if the last message is truly an echo (same user, username, type, and content)
                if (
                    prev.length > 0 &&
                    data.user_id === userId &&
                    prev.at(-1)?.user_id === userId &&
                    prev.at(-1)?.username === username &&
                    prev.at(-1)?.type === data.type &&
                    prev.at(-1)?.content === data.content
                ) {
                    return prev;
                }
                // Ensure timestamp is always a string
                const safeData = {
                    ...data,
                    timestamp: typeof data.timestamp === 'string' ? data.timestamp : new Date().toISOString(),
                };
                return [...prev, safeData];
            });
        } catch (err) {
            console.warn('[FRONTEND-MESSAGE][PARSE-ERROR]', event.data, err);
        }
    }, [userId, username]);

    const handleWsClose = useCallback(() => {
        setConnected(false);
        showToast.error("Disconnected from chat server.");
    }, []);

    const handleWsError = useCallback((event: Event) => {
        showToast.error("WebSocket error occurred.");
    }, []);

    const { ws, send } = useWebSocket({
        url: wsUrl,
        onOpen: handleWsOpen,
        onMessage: handleWsMessage,
        onClose: handleWsClose,
        onError: handleWsError,
        enabled: !!(username && channel && !showModal),
    });

    function handleConnect(e: React.FormEvent) {
        e.preventDefault();
        if (username.trim()) {

            if (!userId) {
                setUserId(uuidv4());
            }
            setShowModal(false);

        }
    }

    function handleSend(e: React.FormEvent) {
        e.preventDefault();
        if (!input.trim() || !connected) return;
        const msg = {
            type: "message",
            username,
            user_id: userId,
            content: input,
            timestamp: new Date().toISOString(),
            channel,
        };
        console.log('[FRONTEND-SEND]', msg);
        if (send) {
            send(JSON.stringify(msg));
        }
        setInput("");
    }

    function handleDisconnect() {
        if (ws) {
            ws.close();
        }
        setConnected(false);
        setShowModal(true);
        showToast.info("Disconnected from chat server.");
    }

    return {
        connected,
        userId,
        username,
        setUsername,
        channel,
        setChannel,
        showModal,
        setShowModal: setShowModal as React.Dispatch<React.SetStateAction<boolean>>,
        messages,
        input,
        setInput,
        handleConnect,
        handleSend,
        handleDisconnect,
    };
}
