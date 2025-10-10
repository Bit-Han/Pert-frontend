"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@pages/components/ui/card";
import { Badge } from "@pages/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@pages/components/ui/table";
import { MonteCarloChart } from "./MonteCarloCharts";
import { TaskTimingChart } from "./TaskTime";
import type { PertResult } from "../config";
import { AlertCircle } from "lucide-react";

interface PertResultsProps {
	result: PertResult | null;
}

export function PertResults({ result }: PertResultsProps) {
	if (!result) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>PERT Analysis Results</CardTitle>
					<CardDescription>No analysis results yet</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col items-center justify-center py-12 text-center">
						<AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
						<p className="text-sm text-muted-foreground">
							Run PERT analysis from the Task Management tab to see results here
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	const criticalTasks = result.task_timings.filter((t) => t.slack === 0);

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium">
							Project Duration
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">
							{result.project_duration.toFixed(2)}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							days (Classical PERT)
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium">
							Monte Carlo Mean
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">
							{result.monte_carlo.mean.toFixed(2)}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							days (simulated average)
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium">
							Critical Tasks
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">{criticalTasks.length}</div>
						<p className="text-xs text-muted-foreground mt-1">
							tasks with zero slack
						</p>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Critical Path(s)</CardTitle>
					<CardDescription>
						Tasks that determine the minimum project duration
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						{result.critical_paths.map((path, index) => (
							<div key={index} className="flex items-center gap-2">
								<Badge variant="default">Path {index + 1}</Badge>
								<div className="flex flex-wrap gap-1">
									{path.map((taskId, i) => (
										<span key={i} className="flex items-center">
											<Badge variant="secondary">{taskId}</Badge>
											{i < path.length - 1 && (
												<span className="mx-1 text-muted-foreground">→</span>
											)}
										</span>
									))}
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Task Timing Details</CardTitle>
					<CardDescription>
						Early Start (ES), Early Finish (EF), Late Start (LS), Late Finish
						(LF), and Slack
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Task ID</TableHead>
									<TableHead>Duration</TableHead>
									<TableHead>ES</TableHead>
									<TableHead>EF</TableHead>
									<TableHead>LS</TableHead>
									<TableHead>LF</TableHead>
									<TableHead>Slack</TableHead>
									<TableHead>Critical</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{result.task_timings.map((task) => (
									<TableRow key={task.id}>
										<TableCell className="font-medium">{task.id}</TableCell>
										<TableCell>{task.duration.toFixed(2)}</TableCell>
										<TableCell>{task.ES.toFixed(2)}</TableCell>
										<TableCell>{task.EF.toFixed(2)}</TableCell>
										<TableCell>{task.LS.toFixed(2)}</TableCell>
										<TableCell>{task.LF.toFixed(2)}</TableCell>
										<TableCell>{task.slack.toFixed(2)}</TableCell>
										<TableCell>
											{task.slack === 0 ? (
												<Badge variant="destructive">Yes</Badge>
											) : (
												<Badge variant="outline">No</Badge>
											)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>

			<TaskTimingChart taskTimings={result.task_timings} />

			<Card>
				<CardHeader>
					<CardTitle>Monte Carlo Simulation Results</CardTitle>
					<CardDescription>
						Probability distribution of project completion times
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
						<div className="space-y-1">
							<p className="text-sm text-muted-foreground">
								50th Percentile (P50)
							</p>
							<p className="text-2xl font-bold">
								{result.monte_carlo.p50.toFixed(2)} days
							</p>
						</div>
						<div className="space-y-1">
							<p className="text-sm text-muted-foreground">
								80th Percentile (P80)
							</p>
							<p className="text-2xl font-bold">
								{result.monte_carlo.p80.toFixed(2)} days
							</p>
						</div>
						<div className="space-y-1">
							<p className="text-sm text-muted-foreground">
								95th Percentile (P95)
							</p>
							<p className="text-2xl font-bold">
								{result.monte_carlo.p95.toFixed(2)} days
							</p>
						</div>
						<div className="space-y-1">
							<p className="text-sm text-muted-foreground">Mean Duration</p>
							<p className="text-2xl font-bold">
								{result.monte_carlo.mean.toFixed(2)} days
							</p>
						</div>
					</div>
					<MonteCarloChart
						durations={result.monte_carlo.durations}
						percentiles={result.monte_carlo}
					/>
				</CardContent>
			</Card>
		</div>
	);
}

// "use client";

// import { useState, useEffect } from "react";

// const API_BASE_URL = "http://127.0.0.1:8000";

// interface Task {
// 	id: string;
// 	optimistic: number;
// 	most_likely: number;
// 	pessimistic: number;
// 	dependencies: string[];
// }

// export default function ResultsPanel({ tasks }: { tasks: Task[] }) {
// 	const [results, setResults] = useState<any>(null);
// 	const [loading, setLoading] = useState(false);

// 	useEffect(() => {
// 		const ws = new WebSocket("ws://127.0.0.1:8000/ws/update");
// 		ws.onopen = () => console.log("✅ WebSocket connected");
// 		ws.onmessage = (event) => {
// 			try {
// 				const data = JSON.parse(event.data);
// 				console.log("📡 WS Update:", data);
// 				setResults(data);
// 			} catch (err) {
// 				console.error("Error parsing WS data", err);
// 			}
// 		};
// 		ws.onclose = () => console.warn("⚠️ WebSocket closed");
// 		return () => ws.close();
// 	}, []);

// 	const runSimulation = async () => {
// 		if (!tasks || tasks.length === 0) return alert("Add tasks first!");
// 		setLoading(true);

// 		try {
// 			const res = await fetch(`${API_BASE_URL}/pert`, {
// 				method: "POST",
// 				headers: { "Content-Type": "application/json" },
// 				body: JSON.stringify(tasks),
// 			});

// 			if (!res.ok) {
// 				const msg = await res.text();
// 				throw new Error(`Simulation failed: ${msg}`);
// 			}

// 			const data = await res.json();
// 			console.log("✅ Simulation result:", data);
// 			setResults(data);
// 		} catch (err) {
// 			console.error("❌ Error running simulation:", err);
// 			alert("Simulation failed. Check console for details.");
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	return (
// 		<div className="p-5 bg-white rounded-2xl shadow-md mt-5">
// 			<h2 className="text-lg font-semibold mb-4">Run Simulation</h2>

// 			<button
// 				onClick={runSimulation}
// 				disabled={loading}
// 				className={`px-4 py-2 rounded-md text-white ${
// 					loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
// 				}`}
// 			>
// 				{loading ? "Running..." : "Run PERT Simulation"}
// 			</button>

// 			{results && (
// 				<div className="mt-5 bg-gray-50 p-4 rounded-md border">
// 					<h3 className="font-semibold mb-2">Results</h3>
// 					<pre className="text-sm bg-gray-100 p-2 rounded-md overflow-x-auto">
// 						{JSON.stringify(results, null, 2)}
// 					</pre>
// 				</div>
// 			)}
// 		</div>
// 	);
// }
