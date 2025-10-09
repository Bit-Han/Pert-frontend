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
import { Edit, Trash2 } from "lucide-react";
import type { Task } from "../config";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@pages/components/ui/table";

interface TaskListProps {
	tasks: Task[];
	onEdit: (task: Task) => void;
	onDelete: (taskId: string) => void;
}

export function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
	if (tasks.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Task List</CardTitle>
					<CardDescription>No tasks added yet</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground text-center py-8">
						Add your first task to get started with PERT analysis
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Task List</CardTitle>
				<CardDescription>{tasks.length} task(s) configured</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Task ID</TableHead>
								<TableHead>Optimistic</TableHead>
								<TableHead>Most Likely</TableHead>
								<TableHead>Pessimistic</TableHead>
								<TableHead>Dependencies</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{tasks.map((task) => (
								<TableRow key={task.id}>
									<TableCell className="font-medium">{task.id}</TableCell>
									<TableCell>{task.optimistic} days</TableCell>
									<TableCell>{task.most_likely} days</TableCell>
									<TableCell>{task.pessimistic} days</TableCell>
									<TableCell>
										{task.dependencies.length > 0 ? (
											<div className="flex flex-wrap gap-1">
												{task.dependencies.map((dep) => (
													<Badge
														key={dep}
														variant="outline"
														className="text-xs"
													>
														{dep}
													</Badge>
												))}
											</div>
										) : (
											<span className="text-muted-foreground text-sm">
												None
											</span>
										)}
									</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end gap-2">
											<Button
												size="sm"
												variant="ghost"
												onClick={() => onEdit(task)}
											>
												<Edit className="h-4 w-4" />
											</Button>
											<Button
												size="sm"
												variant="ghost"
												onClick={() => onDelete(task.id)}
											>
												<Trash2 className="h-4 w-4 text-destructive" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}
