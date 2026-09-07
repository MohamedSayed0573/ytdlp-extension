import type { SiteUsage } from "@/db";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@components/ui/table";
import { formatBytes } from "@lib/dashboardUtils";

function getOriginDisplayName(origin: string) {
    try {
        return new URL(origin).hostname.replace(/^www\./, "");
    } catch {
        return origin;
    }
}

function getSiteIconUrl(origin: string) {
    try {
        const domain = new URL(origin).hostname;
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
        return null;
    }
}

export default function SiteTable({ usage }: { usage: SiteUsage[] }) {
    const usageByOrigin = new Map<string, number>();

    for (const { usage: originUsage } of usage) {
        for (const [origin, bytes] of Object.entries(originUsage)) {
            usageByOrigin.set(origin, (usageByOrigin.get(origin) ?? 0) + bytes);
        }
    }

    const rows = Array.from(usageByOrigin).toSorted(([, a], [, b]) => b - a);
    const totalUsage = rows.reduce((total, [, bytes]) => total + bytes, 0);

    return (
        <section className="w-full px-4 pb-4">
            <Table className="mx-auto max-w-4xl table-fixed border-collapse border border-neutral-800 font-mono text-sm">
                <TableHeader className="bg-neutral-800 text-xs tracking-wider text-neutral-400 uppercase">
                    <TableRow className="border-neutral-800">
                        <TableHead className="w-14 px-3 py-2.5 text-center">#</TableHead>
                        <TableHead className="px-4 py-2.5">Website</TableHead>
                        <TableHead className="w-40 border-l border-neutral-800 px-4 py-2.5 text-center">
                            Data used
                        </TableHead>
                        <TableHead className="w-24 border-l border-neutral-800 px-4 py-2.5 text-center">
                            Share
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map(([origin, bytes], index) => {
                        const share = totalUsage ? (bytes / totalUsage) * 100 : 0;
                        const iconUrl = getSiteIconUrl(origin);

                        return (
                            <TableRow
                                key={origin}
                                className="border-neutral-800 hover:bg-neutral-800"
                            >
                                <TableCell className="px-3 py-2.5 text-center text-neutral-500 tabular-nums">
                                    {index + 1}
                                </TableCell>
                                <TableCell className="px-4 py-2.5">
                                    <div className="flex min-w-0 items-center gap-2">
                                        {iconUrl && (
                                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-neutral-700 bg-neutral-800 p-1">
                                                <img
                                                    src={iconUrl}
                                                    alt=""
                                                    className="h-full w-full rounded-sm"
                                                />
                                            </span>
                                        )}
                                        <span className="block truncate text-stone-200">
                                            {getOriginDisplayName(origin)}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="border-l border-neutral-800 px-4 py-2.5 text-center font-medium whitespace-nowrap text-stone-200 tabular-nums">
                                    {formatBytes(bytes)}
                                </TableCell>
                                <TableCell className="border-l border-neutral-800 px-4 py-2.5 text-center text-teal-400 tabular-nums">
                                    {share.toFixed(1)}%
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
                <TableFooter className="border-neutral-700 bg-transparent">
                    <TableRow className="border-0">
                        <TableHead colSpan={2} className="px-4 py-2.5 text-left text-stone-200">
                            Total
                        </TableHead>
                        <TableCell className="border-l border-neutral-800 px-4 py-2.5 text-center whitespace-nowrap text-stone-100 tabular-nums">
                            {formatBytes(totalUsage)}
                        </TableCell>
                        <TableCell className="border-l border-neutral-800 px-4 py-2.5 text-center text-teal-400 tabular-nums">
                            100.0%
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </section>
    );
}
