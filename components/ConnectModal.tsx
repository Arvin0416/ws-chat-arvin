import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Value } from "@radix-ui/react-select";

interface ConnectModalProps {
    open: boolean;
    username: string;
    channel: string;
    onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onChannelChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onConnect: (e: React.FormEvent) => void;
}

export function ConnectModal({ open, username, channel, onUsernameChange, onChannelChange, onConnect }: Readonly<ConnectModalProps>) {
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
                    <Select
                        value={channel}
                        onValueChange={value => {
                            const event = {
                                target: { value: value }
                            } as React.ChangeEvent<HTMLInputElement>;
                            onChannelChange(event);
                        }}
                    >
                        <SelectTrigger id="channel" className="w-full">
                            <SelectValue placeholder="Select channel" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="general">#general</SelectItem>
                            <SelectItem value="random">#random</SelectItem>
                            <SelectItem value="help">#help</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button type="submit" className="w-full">Connect</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
