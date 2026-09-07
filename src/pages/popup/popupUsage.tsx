import { totalSizeVideoDisplay } from "@lib/formatting";

export default function PopupUsage({
    text,
    usage,
    onClick,
}: {
    text: string;
    usage: number | undefined;
    onClick?: () => void;
}) {
    if (usage === undefined) return null;

    return (
        <div>
            <button
                className="flex w-full items-center justify-between rounded-lg border border-white/12 bg-white/3 px-3 py-2 text-xs font-medium text-zinc-300 hover:cursor-pointer hover:bg-white/6"
                onClick={onClick}
            >
                <span className="truncate">{text}</span>
                <span>{totalSizeVideoDisplay(usage)}</span>
            </button>
        </div>
    );
}
