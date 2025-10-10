"use client";

import { useMemo } from "react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ReferenceLine,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@pages/components/ui/chart";
import type { MonteCarloResult } from "../config";

interface MonteCarloChartProps {
	durations: number[];
	percentiles: MonteCarloResult;
}

export function MonteCarloChart({
	durations,
	percentiles,
}: MonteCarloChartProps) {
	const histogramData = useMemo(() => {
		const min = Math.min(...durations);
		const max = Math.max(...durations);
		const binCount = 30;
		const binSize = (max - min) / binCount;

		const bins = Array.from({ length: binCount }, (_, i) => ({
			duration: min + i * binSize + binSize / 2,
			frequency: 0,
		}));

		durations.forEach((duration) => {
			const binIndex = Math.min(
				Math.floor((duration - min) / binSize),
				binCount - 1
			);
			bins[binIndex].frequency++;
		});

		return bins;
	}, [durations]);

	return (
		<ChartContainer
			config={{
				frequency: {
					label: "Frequency",
					color: "hsl(var(--chart-1))",
				},
			}}
			className="h-[400px]"
		>
			<ResponsiveContainer width="100%" height="100%">
				<AreaChart data={histogramData}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis
						dataKey="duration"
						label={{
							value: "Project Duration (days)",
							position: "insideBottom",
							offset: -5,
						}}
					/>
					<YAxis
						label={{ value: "Frequency", angle: -90, position: "insideLeft" }}
					/>
					<ChartTooltip content={<ChartTooltipContent />} />
					<Area
						type="monotone"
						dataKey="frequency"
						stroke="var(--color-frequency)"
						fill="var(--color-frequency)"
						fillOpacity={0.6}
					/>
					<ReferenceLine
						x={percentiles.p50}
						stroke="hsl(var(--chart-2))"
						strokeDasharray="3 3"
						label="P50"
					/>
					<ReferenceLine
						x={percentiles.p80}
						stroke="hsl(var(--chart-3))"
						strokeDasharray="3 3"
						label="P80"
					/>
					<ReferenceLine
						x={percentiles.p95}
						stroke="hsl(var(--chart-4))"
						strokeDasharray="3 3"
						label="P95"
					/>
				</AreaChart>
			</ResponsiveContainer>
		</ChartContainer>
	);
}
