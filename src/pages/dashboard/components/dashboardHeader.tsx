import { formatBytes } from "@lib/dashboardUtils";
import BackToDashBoardBtn from "./backToDashboardBtn";

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

interface DashboardHeaderProps {
    title: string;
    totalDataUsage: number;
}

export default function DashboardHeader({ title, totalDataUsage }: DashboardHeaderProps) {
    const formattedDataUsage = formatBytes(totalDataUsage);

    return (
        <div className="flex items-center justify-between gap-5 border-b border-neutral-700 bg-neutral-800 p-2.5 text-lg font-bold">
            <BackToDashBoardBtn />
            <div className="w-1/2 font-mono text-lg text-teal-400">{title}</div>
            <div className="flex flex-1 items-center justify-evenly">
                <HeaderStat label="Total Data Used" value={formattedDataUsage} />
            </div>
        </div>
    );
}
