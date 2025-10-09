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
} from "recharts";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@pages/components/ui/chart";
import type { TaskTiming } from "../config";

interface TaskTimingChartProps {
	taskTimings: TaskTiming[];
}

export function TaskTimingChart({ taskTimings }: TaskTimingChartProps) {
	const chartData = taskTimings.map((task) => ({
		task: task.id,
		ES: task.ES,
		EF: task.EF,
		LS: task.LS,
		LF: task.LF,
		slack: task.slack,
	}));

	return (
		<Card>
			<CardHeader>
				<CardTitle>Task Timing Visualization</CardTitle>
				<CardDescription>
					Visual representation of task schedules and slack time
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={{
						ES: {
							label: "Early Start",
							color: "hsl(var(--chart-1))",
						},
						EF: {
							label: "Early Finish",
							color: "hsl(var(--chart-2))",
						},
						LS: {
							label: "Late Start",
							color: "hsl(var(--chart-3))",
						},
						LF: {
							label: "Late Finish",
							color: "hsl(var(--chart-4))",
						},
					}}
					className="h-[400px]"
				>
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={chartData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="task" />
							<YAxis
								label={{ value: "Days", angle: -90, position: "insideLeft" }}
							/>
							<ChartTooltip content={<ChartTooltipContent />} />
							<Legend />
							<Bar dataKey="ES" fill="var(--color-ES)" name="Early Start" />
							<Bar dataKey="EF" fill="var(--color-EF)" name="Early Finish" />
							<Bar dataKey="LS" fill="var(--color-LS)" name="Late Start" />
							<Bar dataKey="LF" fill="var(--color-LF)" name="Late Finish" />
						</BarChart>
					</ResponsiveContainer>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
