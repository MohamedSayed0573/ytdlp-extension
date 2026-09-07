import { Link } from "react-router";
import { formatBytes } from "@lib/dashboardUtils";
import { PlatformLogo } from "@pages/analytics/components/platformLogos";
import { buildPlatformSearch, parseVideoKey } from "@pages/analytics/components/platformUtils";
import { capitalize, cn } from "@lib/utils";
import { useWatchHistory } from "@hooks/useWatchHistory";
import type { PlatformId, UsageScope } from "@app-types/types";

const PLATFORM_STYLES = {
    youtube:
        "bg-linear-to-br from-red-800 via-red-950 to-red-950 hover:from-red-700 hover:via-red-900",
    twitch: "bg-linear-to-br from-blue-800 via-blue-950 to-blue-950 hover:from-blue-700 hover:via-blue-900",
    kick: "bg-linear-to-br from-lime-800 via-lime-950 to-lime-950 hover:from-lime-700 hover:via-lime-900",
} as const;

export default function PlatformCards({ scope }: { scope: UsageScope }) {
    const { data, isError, error, isPending } = useWatchHistory(scope);
    if (isError) throw error;
    if (isPending) return;

    const { history } = data;
    if (!history) return;

    const platformToBytes: Map<PlatformId, number> = new Map();
    for (const dayOfWatchHistory of history) {
        for (const [videoKey, bytes] of Object.entries(dayOfWatchHistory.videos)) {
            const { platform } = parseVideoKey(videoKey);
            platformToBytes.set(platform, (platformToBytes.get(platform) ?? 0) + bytes);
        }
    }

    const search = buildPlatformSearch(scope);

    return (
        <div className="flex justify-center gap-4 p-4">
            {[...platformToBytes].map(([platform, bytes]) => {
                return (
                    <Link
                        key={platform}
                        to={`/analytics/platform/${platform}${search}`}
                        className={cn(
                            "flex h-28 w-full max-w-sm items-center gap-4 rounded-2xl px-4 transition-colors",
                            PLATFORM_STYLES[platform],
                        )}
                    >
                        <PlatformLogo platform={platform} />
                        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                            <span className="truncate font-mono text-2xl font-bold text-stone-100">
                                {capitalize(platform)}
                            </span>
                            <span className="font-mono text-base text-stone-300">
                                {formatBytes(bytes)} used
                            </span>
                            <span className="font-mono text-xs text-teal-600 underline">
                                View videos →
                            </span>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
