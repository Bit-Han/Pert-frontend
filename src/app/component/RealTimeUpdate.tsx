"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@pages/components/ui/card";
import { Button } from "@pages/components/ui/button";
import { Badge } from "@pages/components/ui/badge";
import { ScrollArea } from "@pages/components/ui/scroll-area";
import {
	Trash2,
	Activity,
	CheckCircle,
	AlertCircle,
	Info,
	Clock,
} from "lucide-react";

import type { UpdateMessage } from "../page";


interface RealtimeUpdatesProps {
	updates: UpdateMessage[];
	isConnected: boolean;
	onClearUpdates: () => void;
}

export function RealtimeUpdates({
	updates,
	isConnected,
	onClearUpdates,
}: RealtimeUpdatesProps) {
	const getUpdateIcon = (type: string) => {
		switch (type) {
			case "calculation_complete":
				return <CheckCircle className="h-4 w-4 text-green-500" />;
			case "task_updated":
				return <Activity className="h-4 w-4 text-blue-500" />;
			case "error":
				return <AlertCircle className="h-4 w-4 text-red-500" />;
			case "progress":
				return <Clock className="h-4 w-4 text-yellow-500" />;
			default:
				return <Info className="h-4 w-4 text-gray-500" />;
		}
	};

	const getUpdateBadge = (type: string) => {
		switch (type) {
			case "calculation_complete":
				return <Badge variant="default">Complete</Badge>;
			case "task_updated":
				return <Badge variant="secondary">Updated</Badge>;
			case "error":
				return <Badge variant="destructive">Error</Badge>;
			case "progress":
				return <Badge variant="outline">Progress</Badge>;
			default:
				return <Badge variant="outline">Info</Badge>;
		}
	};

	const formatTimestamp = (timestamp: string | number) => {
		const date = new Date(timestamp);
		return date.toLocaleTimeString();
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>Real-time Updates</CardTitle>
						<CardDescription>
							Live notifications from the backend via WebSocket
							{!isConnected && (
								<span className="text-destructive ml-2">
									(Disconnected - updates paused)
								</span>
							)}
						</CardDescription>
					</div>
					{updates.length > 0 && (
						<Button variant="outline" size="sm" onClick={onClearUpdates}>
							<Trash2 className="h-4 w-4 mr-2" />
							Clear All
						</Button>
					)}
				</div>
			</CardHeader>
			<CardContent>
				{updates.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-12 text-center">
						<Activity className="h-12 w-12 text-muted-foreground mb-4" />
						<p className="text-sm text-muted-foreground">
							{isConnected
								? "No updates yet. Updates will appear here in real-time as they occur."
								: "WebSocket is disconnected. Reconnect to receive real-time updates."}
						</p>
					</div>
				) : (
					<ScrollArea className="h-[600px] pr-4">
						<div className="space-y-3">
							{updates.map((update, index) => (
								<div
									key={index}
									className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
								>
									<div className="mt-1">{getUpdateIcon(update.type)}</div>
									<div className="flex-1 space-y-1">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												{getUpdateBadge(update.type)}
												{update.timestamp && (
													<span className="text-xs text-muted-foreground">
														{formatTimestamp(update.timestamp)}
													</span>
												)}
											</div>
										</div>
										<p className="text-sm font-medium">
											{update.message || "Update received"}
										</p>
										{update.details && (
											<p className="text-xs text-muted-foreground">
												{JSON.stringify(update.details, null, 2)}
											</p>
										)}
										{update.data && (
											<details className="text-xs">
												<summary className="cursor-pointer text-muted-foreground hover:text-foreground">
													View data
												</summary>
												<pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
													{JSON.stringify(update.data, null, 2)}
												</pre>
											</details>
										)}
									</div>
								</div>
							))}
						</div>
					</ScrollArea>
				)}
			</CardContent>
		</Card>
	);
}
