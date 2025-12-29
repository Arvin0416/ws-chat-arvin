'use client';
import clsx from "clsx";
import { Card, CardContent } from "@/components/ui/card";
import { useRef, useLayoutEffect } from "react";

export interface ChatMessage {
    id: number;
    type: string;
    username: string;
    userId: string;
    text: string;
    timestamp: string;
}

interface ChatMessagesProps {
    messages: ChatMessage[];
    userId: string;
}

export function ChatMessages({ messages, userId }: Readonly<ChatMessagesProps>) {
    const chatEndRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <Card className="flex-1 w-full mb-4 border-none overflow-y-auto min-h-80 " >
            <CardContent className="p-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={clsx(
                            "mb-3 flex",
                            msg.userId === userId ? "justify-end" : "justify-start"
                        )}
                    >
                        <div
                            className={clsx(
                                "max-w-xs px-4 py-2 rounded-lg shadow text-sm break-words",
                                msg.type === "system" && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-center mx-auto",
                                msg.type !== "system" && msg.userId === userId && "bg-green-500 text-white dark:bg-green-600",
                                msg.type !== "system" && msg.userId !== userId && "bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100"
                            )}
                        >
                            {msg.type !== "system" && (
                                <div className={clsx("font-semibold text-xs mb-1 opacity-80")}>
                                    {msg.username} <span className={clsx("ml-1 text-[10px] opacity-60")}>({msg.userId})</span>
                                </div>
                            )}
                            <div>{msg.text}</div>
                            <div className={clsx("text-[10px] mt-1 opacity-60 text-right")}>
                                {msg.timestamp}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </CardContent>
        </Card>
    );
}
