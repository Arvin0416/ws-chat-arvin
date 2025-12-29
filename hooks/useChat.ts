
'use client';
import { useState, useCallback } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useWebSocket } from "./useWebSocket";


export function useChat() {
    const [connected, setConnected] = useState(false);
    const [userId, setUserId] = useState("");
    const [username, setUsername] = useState("");
    const [channel, setChannel] = useState("general");
    const [showModal, setShowModal] = useState(true);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    // WebSocket URL (local development)
    // Only connect when modal is closed (after clicking Connect)
    const wsUrl = !showModal && channel && username ? `ws://localhost:8080/ws?channel=${channel}&username=${encodeURIComponent(username)}` : "";

    // Handlers for WebSocket events
    const handleWsOpen = useCallback(() => {
        setConnected(true);
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
                    data.userId === userId &&
                    prev.at(-1)?.userId === userId &&
                    prev.at(-1)?.username === username &&
                    prev.at(-1)?.type === data.type &&
                    prev.at(-1)?.text === data.content
                ) {
                    return prev;
                }
                return [...prev, data];
            });
        } catch (err) {
            console.warn('[FRONTEND-MESSAGE][PARSE-ERROR]', event.data, err);
        }
    }, [userId, username]);

    const handleWsClose = useCallback(() => {
        setConnected(false);
    }, []);

    const { ws, send } = useWebSocket({
        url: wsUrl,
        onOpen: handleWsOpen,
        onMessage: handleWsMessage,
        onClose: handleWsClose,
        enabled: !!(username && channel && !showModal),
    });

    function handleConnect(e: React.FormEvent) {
        e.preventDefault();
        if (username.trim()) {
            // Generate a UUID for the user if not already set
            if (!userId) {
                setUserId(uuidv4());
            }
            setShowModal(false);
            // WebSocket will connect via useWebSocket
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

    return {
        connected,
        userId,
        username,
        setUsername,
        channel,
        setChannel,
        showModal,
        setShowModal,
        messages,
        input,
        setInput,
        handleConnect,
        handleSend,
    };
}
