"use client";
import { Toaster, toast } from "sonner";

export function ToastProvider() {
    return <Toaster richColors position="top-center" />;
}

export const showToast = {
    success: (msg: string) => toast.success(msg),
    error: (msg: string) => toast.error(msg),
    info: (msg: string) => toast(msg),
};
