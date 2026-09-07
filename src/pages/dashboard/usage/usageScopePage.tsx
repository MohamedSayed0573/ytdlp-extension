import { formatDate } from "@lib/dashboardUtils";
import DashboardHeader from "@pages/dashboard/components/dashboardHeader";
import UsageDetailsSkeleton from "@pages/dashboard/components/usageDetailsSkeleton";
import NoUsageData from "@pages/dashboard/components/noUsageData";
import { useSiteUsage } from "@hooks/useSiteUsage";
import { getLastNDays, getUsageNumber } from "@lib/dashboardUtils";
import { useParams } from "react-router";
import DashboardNotFound from "../dashboardNotFound";
import type { DateKey, UsageRange, UsageScope } from "@app-types/types";
import PlatformCards from "../components/platformCards";
import SiteTable from "../components/siteTable";

function getTitle(range: UsageScope): string {
    if (range.type === "range") {
        switch (range.range) {
            case "today": {
                return formatDate(getLastNDays(1));
            }
            case "week": {
                return formatDate(getLastNDays(7));
            }
            case "month": {
                return formatDate(getLastNDays(30));
            }
            case "lifetime": {
                return "Lifetime";
            }
        }
    } else {
        return formatDate(range.date);
    }
}

function getScope(date: DateKey | undefined): UsageScope | undefined {
    if (!date) return;

    if (["today", "week", "month", "lifetime"].includes(date)) {
        return {
            type: "range" as const,
            range: date as UsageRange,
        };
    }
    if (isValidDate(date)) {
        return {
            type: "date",
            date,
        };
    }
}

function isValidDate(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const date = new Date(`${value}T00:00:00`);
    return !Number.isNaN(date.getTime());
}

export function UsageScopePage() {
    const { date } = useParams();
    const scope = getScope(date as DateKey);

    const { data: usage, isPending, isError, error } = useSiteUsage(scope);

    if (!scope) return <DashboardNotFound />;
    if (isPending) return <UsageDetailsSkeleton />;
    if (isError) throw error;
    if (!usage) return <NoUsageData />;

    return (
        <>
            <DashboardHeader title={getTitle(scope)} totalDataUsage={getUsageNumber(usage)} />
            <div className="flex flex-1 flex-col bg-neutral-900">
                <PlatformCards scope={scope} />
                <SiteTable usage={usage} />
            </div>
        </>
    );
}
