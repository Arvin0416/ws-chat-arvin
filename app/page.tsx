'use client';

import clsx from "clsx";
import { Badge } from "@/components/ui/badge";
import { ChatMessages } from "@/components/ChatMessages";
import { ChatInput } from "@/components/ChatInput";
import { ConnectModal } from "@/components/ConnectModal";
import { useChat } from "@/hooks/useChat";
import { useTheme } from "@/hooks/useTheme";




export default function Home() {
  useTheme("dark");
  const {
    connected,
    userId,
    username,
    setUsername,
    channel,
    setChannel,
    showModal,
    messages,
    input,
    setInput,
    handleConnect,
    handleSend,
  } = useChat();

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
      <main className={clsx("flex min-h-screen w-full max-w-3xl flex-col  py-24 items-center justify-between py-12 px-2 sm:px-8")}>
        <h1 className={clsx("text-3xl font-bold text-zinc-900 dark:text-white mb-4 text-center")}>
          Arvin Berina Web Chat Interface
        </h1>
        {/* Status & User Info */}
        <div className={clsx("flex w-full justify-between items-center mb-2")}>
          <Badge variant={connected ? "default" : "destructive"}>
            Status: {connected ? "Connected" : "Not Connected"}
          </Badge>
          <Badge variant="outline">
            Username: {username || "N/A"}
          </Badge>
        </div>
        {/* Chat Area */}
        <ChatMessages messages={messages} username={username} />
        {/* Message Input */}
        <ChatInput
          value={input}
          onChange={e => setInput(e.target.value)}
          onSend={handleSend}
          disabled={!connected}
        />

      </main>
    </div>
  );
}
