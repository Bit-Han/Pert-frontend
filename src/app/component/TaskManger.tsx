"use client";

import { useState } from "react";
import { Button } from "@pages/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@pages/components/ui/card";
import { TaskForm } from "@pages/app/component/TaskForm";
import { TaskList } from "@pages/app/component/TaskList";
import {
	setTasks,
	runPertAnalysis,
	type Task,
	type PertResult,
} from "../config";
import { toast } from "sonner";
import { Loader2, Play, Save } from "lucide-react";

interface TaskManagerProps {
	tasks: Task[];
	onTasksChange: (tasks: Task[]) => void;
	onPertResult: (result: PertResult) => void;
}

export function TaskManager({
	tasks,
	onTasksChange,
	onPertResult,
}: TaskManagerProps) {
	const [isAddingTask, setIsAddingTask] = useState(false);
	const [editingTask, setEditingTask] = useState<Task | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [isRunning, setIsRunning] = useState(false);

	const handleAddTask = (task: Task) => {
		onTasksChange([...tasks, task]);
		setIsAddingTask(false);
		toast.success(`Task "${task.id}" has been added successfully.`);
	};

	const handleUpdateTask = (updatedTask: Task) => {
		onTasksChange(
			tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
		);
		setEditingTask(null);
		toast.success(`Task "${updatedTask.id}" has been updated successfully.`);
	};

	const handleDeleteTask = (taskId: string) => {
		onTasksChange(tasks.filter((t) => t.id !== taskId));
		toast.error(`Task "${taskId}" has been deleted.`);
	};

	const handleSaveTasks = async () => {
		if (tasks.length === 0) {
			toast.error("Please add at least one task before saving.");
			return;
		}

		setIsSaving(true);
		try {
			await setTasks(tasks);
			toast.success("All tasks have been saved to the backend.");
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "An error occurred while saving tasks"
			);
		} finally {
			setIsSaving(false);
		}
	};

	const handleRunAnalysis = async () => {
		if (tasks.length === 0) {
			toast.error("Please add at least one task before running analysis.");
			return;
		}

		setIsRunning(true);
		try {
			const result = await runPertAnalysis(tasks);
			onPertResult(result);
			toast.success("PERT analysis has been completed successfully.");
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "An error occurred while running analysis"
			);
		} finally {
			setIsRunning(false);
		}
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Task Management</CardTitle>
					<CardDescription>
						Add and manage tasks with time estimates and dependencies
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex gap-2">
						<Button
							onClick={() => setIsAddingTask(true)}
							disabled={isAddingTask}
						>
							Add New Task
						</Button>
						<Button
							onClick={handleSaveTasks}
							disabled={isSaving || tasks.length === 0}
							variant="secondary"
						>
							{isSaving ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Saving...
								</>
							) : (
								<>
									<Save className="mr-2 h-4 w-4" />
									Save Tasks
								</>
							)}
						</Button>
						<Button
							onClick={handleRunAnalysis}
							disabled={isRunning || tasks.length === 0}
							variant="default"
						>
							{isRunning ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Running...
								</>
							) : (
								<>
									<Play className="mr-2 h-4 w-4" />
									Run PERT Analysis
								</>
							)}
						</Button>
					</div>

					{isAddingTask && (
						<TaskForm
							onSubmit={handleAddTask}
							onCancel={() => setIsAddingTask(false)}
							existingTaskIds={tasks.map((t) => t.id)}
						/>
					)}

					{editingTask && (
						<TaskForm
							task={editingTask}
							onSubmit={handleUpdateTask}
							onCancel={() => setEditingTask(null)}
							existingTaskIds={tasks
								.filter((t) => t.id !== editingTask.id)
								.map((t) => t.id)}
						/>
					)}
				</CardContent>
			</Card>

			<TaskList
				tasks={tasks}
				onEdit={setEditingTask}
				onDelete={handleDeleteTask}
			/>
		</div>
	);
}
