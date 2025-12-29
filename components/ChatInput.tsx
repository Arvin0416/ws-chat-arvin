import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { FormEvent } from "react";

interface ChatInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSend: (e: FormEvent) => void;
    disabled?: boolean;
}

export function ChatInput({ value, onChange, onSend, disabled }: ChatInputProps) {
    return (
        <form className={clsx("flex w-full gap-2")} onSubmit={onSend}>
            <Input
                type="text"
                placeholder="Type your message..."
                value={value}
                onChange={onChange}
                disabled={disabled}
            />
            <Button type="submit" disabled={disabled || !value.trim()}>
                Send
            </Button>
        </form>
    );
}
