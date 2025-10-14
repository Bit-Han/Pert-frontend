"use client";

import { useState, useEffect } from "react";
import { TaskManager } from "@pages/app/component/TaskManger";
import { PertResults } from "@pages/app/component/ResultsPanel";
import { ComparisonView } from "@pages/app/component/ComparisonView";
import { WebSocketStatus } from "@pages/app/component/WebSocketStatus";
import { RealtimeUpdates } from "@pages/app/component/RealTimeUpdate";
import { useWebSocket } from "@pages/app/hooks/useWebSocket";
import type { Task, PertResult, ComparisonResult } from "./config";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@pages/components/ui/tabs";
import { toast } from "sonner";



type PertUpdate = {	
	message: string;
	type: string;
	project_duration: number;
	task_timings: {
		id: string;
		duration: number;
		ES: number;
		EF: number;
		LS: number;
		LF: number;
		slack: number;
	}[];
	critical_paths: string[][];
	monte_carlo?: {
		mean: number;
		p50: number;
		p80: number;
		p95: number;
	};
};

export type UpdateMessage = PertUpdate;

export default function PertDashboard() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [pertResult, setPertResult] = useState<PertResult | null>(null);
	const [comparisonResult, setComparisonResult] =
		useState<ComparisonResult | null>(null);
	const [updates, setUpdates] = useState<UpdateMessage[]>([]);
	const { isConnected, lastMessage } = useWebSocket();

	useEffect(() => {
		if (lastMessage) {
			// setUpdates((prev) => [lastMessage, ...prev].slice(0, 50));

			if (lastMessage.type === "calculation_complete") {
				toast.success(lastMessage.message || "PERT analysis has been updated");
			} else if (lastMessage.type === "task_updated") {
				toast.info(lastMessage.message || "A task has been modified");
			} else if (lastMessage.type === "error") {
				toast.error(lastMessage.message || "An error occurred");
			}
		}
	}, [lastMessage]);

	return (
		<div className="min-h-screen bg-background">
			<header className="border-b border-border bg-card">
				<div className="container mx-auto px-4 py-4 flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-foreground">
							PERT Analysis Dashboard
						</h1>
						<p className="text-sm text-muted-foreground">
							Program Evaluation and Review Technique
						</p>
					</div>
					<WebSocketStatus isConnected={isConnected} />
				</div>
			</header>

			<main className="container mx-auto px-4 py-6">
				<Tabs defaultValue="tasks" className="w-full">
					<TabsList className="grid w-full grid-cols-4 mb-6">
						<TabsTrigger value="tasks">Task Management</TabsTrigger>
						<TabsTrigger value="results">PERT Results</TabsTrigger>
						<TabsTrigger value="comparison">Comparison</TabsTrigger>
						<TabsTrigger value="updates">
							Real-time Updates
							{updates.length > 0 && (
								<span className="ml-2 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
									{updates.length}
								</span>
							)}
						</TabsTrigger>
					</TabsList>

					<TabsContent value="tasks" className="space-y-4">
						<TaskManager
							tasks={tasks}
							onTasksChange={setTasks}
							onPertResult={setPertResult}
						/>
					</TabsContent>

					<TabsContent value="results" className="space-y-4">
						<PertResults result={pertResult} />
					</TabsContent>

					<TabsContent value="comparison" className="space-y-4">
						<ComparisonView
							tasks={tasks}
							onComparisonResult={setComparisonResult}
							result={comparisonResult}
						/>
					</TabsContent>

					<TabsContent value="updates" className="space-y-4">
						<RealtimeUpdates
							updates={updates}
							isConnected={isConnected}
							onClearUpdates={() => setUpdates([])}
						/>
					</TabsContent>
				</Tabs>
			</main>
		</div>
	);
}
