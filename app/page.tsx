'use client';

import clsx from "clsx";
import { Badge } from "@/components/ui/badge";
import { CircleX, RotateCw, User, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage, ChatMessages } from "@/components/ChatMessages";
import { ChatInput } from "@/components/ChatInput";
import { ConnectModal } from "@/components/ConnectModal";
import { useChat } from "@/hooks/useChat";
import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { ChatSkeleton } from "@/components/ChatSkeleton";




export default function Home() {
  useTheme("dark");
  const {
    connected,
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
    handleDisconnect,
  } = useChat();
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <ChatSkeleton />;
  }

  return (
    <div className={clsx("flex min-h-screen items-center justify-center bg-background")}>
      <ConnectModal
        open={!connected && showModal}
        username={username}
        channel={channel}
        onUsernameChange={e => setUsername(e.target.value)}
        onChannelChange={e => setChannel(e.target.value)}
        onConnect={handleConnect}
      />
      <main className={clsx("flex min-h-screen w-full max-w-3xl flex-col   items-center justify-center gap-10 px-8 py-12")}>
        <h1 className={clsx("text-3xl font-bold text-zinc-900 dark:text-white mb-4 text-center")}>
          Arvin Berina Web Chat Interface
        </h1>
        <div className="w-full flex flex-col gap-2">
          {/* Status & User Info */}
          <div className={clsx("flex flex-wrap w-full justify-between items-center mb-2 gap-2")}>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={connected ? "default" : "destructive"} className="p-2 px-4 flex items-center gap-2 bg-primary/20">
                <span className={clsx(
                  "inline-block w-2 h-2 rounded-full",
                  connected ? "bg-green-500" : "bg-red-500"
                )} />
                {connected ? "Connected" : "Not Connected"}
              </Badge>
              {!connected && (
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    className="w-fit px-4 rounded-full"
                    aria-label="Reconnect"
                    onClick={() => setShowModal(true)}
                  >
                    <RotateCw className="w-4 h-4" /> Reconnect
                  </Button>

                </div>
              )}
              {connected && (
                <Button
                  size="icon"
                  className="w-fit px-4 rounded-full bg-destructive/20"
                  aria-label="Disconnect"
                  variant="destructive"
                  onClick={handleDisconnect}
                >
                  <CircleX className="w-4 h-4" />
                  Disconnect
                </Button>
              )}
            </div>
            <div className="flex gap-2 items-center">
              <Badge variant="default" className="py-2 px-4 bg-primary/20 font-bold flex items-center gap-2 justify-center">
                <User className="w-4 h-4" />
                {username || "N/A"}
              </Badge>
              <Badge variant="default" className="py-2 px-4 font-bold bg-primary/20 flex items-center gap-2 justify-center">
                <Hash className="w-4 h-4" />
                {channel || "N/A"}
              </Badge>
            </div>
          </div>
          {/* Chat Area */}
          <ChatMessages messages={messages as ChatMessage[]} username={username} />
          {/* Message Input */}
          <ChatInput
            value={input}
            onChange={e => setInput(e.target.value)}
            onSend={handleSend}
            disabled={!connected}
          />
        </div>

      </main>
    </div>
  );
}
