
'use client';
import { initialMessages } from "@/constants/chat";
import { useState, useCallback } from "react";
import { useWebSocket } from "./useWebSocket";


export function useChat() {
    const [connected, setConnected] = useState(false);
    const [userId, setUserId] = useState("");
    const [username, setUsername] = useState("");
    const [channel, setChannel] = useState("general");
    const [showModal, setShowModal] = useState(true);
    const [messages, setMessages] = useState(initialMessages);
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
            setMessages(prev => [...prev, data]);
        } catch (err) {
            console.warn('[FRONTEND-MESSAGE][PARSE-ERROR]', event.data, err);
        }
    }, []);

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
            const newUserId = "u" + Math.floor(Math.random() * 1000);
            setUserId(newUserId);
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
        setMessages((prev) => [
            ...prev,
            {
                id: prev.length > 0 ? prev.at(-1)!.id + 1 : 1,
                type: msg.type,
                username: msg.username,
                userId: msg.user_id,
                text: msg.content,
                timestamp: msg.timestamp,
            }
        ]);
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
