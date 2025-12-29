import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ConnectModalProps {
    open: boolean;
    username: string;
    channel: string;
    onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onChannelChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onConnect: (e: React.FormEvent) => void;
}

export function ConnectModal({ open, username, channel, onUsernameChange, onChannelChange, onConnect }: ConnectModalProps) {
    return (
        <Dialog open={open}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Connect to Chat</DialogTitle>
                </DialogHeader>
                <form onSubmit={onConnect} className="flex flex-col gap-4">
                    <Input
                        id="username"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={onUsernameChange}
                        required
                        autoFocus
                    />
                    <Input
                        id="channel"
                        type="text"
                        placeholder="Channel"
                        value={channel}
                        onChange={onChannelChange}
                        required
                    />
                    <Button type="submit" className="w-full">Connect</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
