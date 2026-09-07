import { formatBytes } from "@lib/dashboardUtils";
import { useNavigate } from "react-router";

function HeaderStat({ label, value }: { label: string; value: number | string }) {
    return (
        <div className="flex flex-col gap-2.5">
            <div className="font-mono text-xs text-teal-400 uppercase">{label}</div>
            <div className="flex items-center justify-center font-mono text-lg font-bold">
                {value}
            </div>
        </div>
    );
}

interface AnalyticsHeaderProps {
    title: string;
    totalDataUsage: number;
}

export default function AnalyticsHeader({ title, totalDataUsage }: AnalyticsHeaderProps) {
    const navigate = useNavigate();
    const formattedDataUsage = formatBytes(totalDataUsage);

    return (
        <div className="flex items-center justify-between gap-5 border-b border-neutral-700 bg-neutral-800 p-2.5 text-lg font-bold">
            <button
                className="flex cursor-pointer items-center justify-center rounded-lg border border-teal-700 bg-teal-900 p-2.5 font-mono text-sm font-bold text-teal-300 hover:border-teal-600 hover:bg-teal-800"
                onClick={() => {
                    void navigate("/analytics");
                }}
            >
                ← Back to Analytics
            </button>
            <div className="w-1/2 font-mono text-lg text-teal-400">{title}</div>
            <div className="flex flex-1 items-center justify-evenly">
                <HeaderStat label="Total Data Used" value={formattedDataUsage} />
            </div>
        </div>
    );
}
