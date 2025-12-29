export function formatChatTimestamp(timestamp: string): string {
    try {
        const d = new Date(timestamp);
        if (!Number.isNaN(d.getTime())) {
            return d.toLocaleString('default', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        }
    } catch { }
    return timestamp;
}