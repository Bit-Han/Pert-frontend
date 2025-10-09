"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@pages/components/ui/card";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	XAxis,
	YAxis,
	Cell,
} from "recharts";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@pages/components/ui/chart";
import type { ComparisonResult } from "../config";

interface ComparisonChartProps {
	result: ComparisonResult;
}

export function ComparisonChart({ result }: ComparisonChartProps) {
	const chartData = [
		{
			method: "Classical PERT",
			duration: result.classical.project_duration,
			fill: "hsl(var(--chart-1))",
		},
		{
			method: "Monte Carlo (Mean)",
			duration: result.monte_carlo.mean_duration,
			fill: "hsl(var(--chart-2))",
		},
		{
			method: "Monte Carlo (P50)",
			duration: result.monte_carlo.percentiles[50],
			fill: "hsl(var(--chart-3))",
		},
		{
			method: "Monte Carlo (P90)",
			duration: result.monte_carlo.percentiles[90],
			fill: "hsl(var(--chart-4))",
		},
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle>Visual Comparison</CardTitle>
				<CardDescription>
					Side-by-side comparison of estimation methods
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={{
						duration: {
							label: "Duration (days)",
							color: "hsl(var(--chart-1))",
						},
					}}
					className="h-[400px]"
				>
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={chartData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis
								dataKey="method"
								angle={-15}
								textAnchor="end"
								height={80}
							/>
							<YAxis
								label={{
									value: "Duration (days)",
									angle: -90,
									position: "insideLeft",
								}}
							/>
							<ChartTooltip content={<ChartTooltipContent />} />
							<Legend />
							<Bar dataKey="duration" name="Project Duration">
								{chartData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.fill} />
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
