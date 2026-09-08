import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useNavigate } from "react-router";

import "@styles/chart.css";

import { Card, CardContent } from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@components/ui/chart";
import type { SiteUsage } from "@/db";
import { getUsageNumber } from "@lib/dashboardUtils";

const chartConfig = {
    usage: {
        label: "Usage (MB)",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig;

export function Chart({ usage }: { usage: SiteUsage[] }) {
    const navigate = useNavigate();
    const usageData = usage.map(({ day, usage }) => {
        return {
            date: day,
            usage: getUsageNumber([{ day, usage }]) / (1024 * 1024),
        };
    });

    return (
        <Card className="my-2 flex min-h-0 flex-1 flex-col bg-[#1d1d1d] py-0 ring-0">
            <CardContent className="flex min-h-0 flex-1 flex-col px-2 sm:p-3">
                <ChartContainer config={chartConfig} className="aspect-auto min-h-0 w-full flex-1">
                    <BarChart
                        accessibilityLayer
                        data={usageData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value: string) => {
                                return new Date(`${value}T00:00:00`).toLocaleDateString("en-CA", {
                                    month: "short",
                                    day: "numeric",
                                });
                            }}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            width={60}
                            tickFormatter={(value: number) => `${value} MB`}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-37.5"
                                    labelFormatter={(value) => {
                                        return new Date(
                                            `${value as string}T00:00:00`,
                                        ).toLocaleDateString("en-CA", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        });
                                    }}
                                />
                            }
                        />
                        <Bar
                            dataKey="usage"
                            fill="var(--color-usage)"
                            cursor="pointer"
                            radius={10}
                            maxBarSize={38}
                            onClick={(data) => {
                                const date = (data.payload as { date: string }).date;
                                void navigate(`/dashboard/${date}`);
                            }}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
