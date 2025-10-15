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
import { UpdateMessage } from "./config";



export default function PertDashboard() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [pertResult, setPertResult] = useState<PertResult | null>(null);
	const [comparisonResult, setComparisonResult] =
		useState<ComparisonResult | null>(null);
	const [updates, setUpdates] = useState<UpdateMessage[]>([]);
	const { isConnected, lastMessage } = useWebSocket();

	
	useEffect(() => {
		if (!lastMessage) return;

		// Wrap incoming PertResult into a frontend-friendly message object
		const wrapped: UpdateMessage = {
			type: "calculation_complete",
			message: "PERT analysis updated successfully",
			details: "PertResult",
			timestamp: new Date().toISOString(),
			data: lastMessage,
		};

		setUpdates((prev) => [wrapped, ...prev].slice(0, 50));
		toast.success(wrapped.message);
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
