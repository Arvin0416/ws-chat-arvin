import { Skeleton } from "@/components/ui/skeleton";

export function ChatSkeleton() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-10 px-8 py-12">
                <Skeleton className="h-10 w-2/3 mb-4 rounded-lg" />
                <div className="w-full flex flex-col gap-2">
                    <div className="flex w-full justify-between items-center mb-2 gap-2">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-32 rounded-full" />
                            <Skeleton className="h-8 w-24 rounded-full" />
                        </div>
                        <Skeleton className="h-8 w-40 rounded-full" />
                    </div>
                    <div className="flex flex-col gap-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-8 w-full rounded-md" />
                        ))}
                    </div>
                    <div className="flex gap-2 mt-4">
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Skeleton className="h-10 w-20 rounded-md" />
                    </div>
                </div>
            </main>
        </div>
    );
}
