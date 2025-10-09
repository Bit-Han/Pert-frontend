"use client";

import { useState } from "react";

const API_BASE_URL = "http://127.0.0.1:8000";

interface Task {
	id: string;
	optimistic: number;
	most_likely: number;
	pessimistic: number;
	dependencies: string[];
}

export default function TaskForm({
	onTasksUpdated,
}: {
	onTasksUpdated: (tasks: Task[]) => void;
}) {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [newTask, setNewTask] = useState<Task>({
		id: "",
		optimistic: 0,
		most_likely: 0,
		pessimistic: 0,
		dependencies: [],
	});

	const handleAddTask = () => {
		if (!newTask.id.trim()) return alert("Task name cannot be empty.");
		const updated = [...tasks, { ...newTask }];
		setTasks(updated);
		onTasksUpdated(updated);
		setNewTask({
			id: "",
			optimistic: 0,
			most_likely: 0,
			pessimistic: 0,
			dependencies: [],
		});
	};

	const handleSubmitAll = async () => {
		try {
			const res = await fetch(`${API_BASE_URL}/set-tasks`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(tasks),
			});

			if (!res.ok) throw new Error("Failed to set tasks");

			const data = await res.json();
			console.log("✅ Tasks saved:", data);
			alert("Tasks saved successfully!");
		} catch (err) {
			console.error("Error submitting tasks:", err);
			alert("Failed to save tasks. Check the console for details.");
		}
	};

	const toggleDependency = (dep: string) => {
		setNewTask((prev) => ({
			...prev,
			dependencies: prev.dependencies.includes(dep)
				? prev.dependencies.filter((d) => d !== dep)
				: [...prev.dependencies, dep],
		}));
	};

	return (
		<div className="p-5 bg-white rounded-2xl shadow-md">
			<h2 className="text-lg font-semibold mb-4">Task Manager</h2>

			<div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
				<input
					type="text"
					placeholder="Task ID"
					value={newTask.id}
					onChange={(e) => setNewTask({ ...newTask, id: e.target.value })}
					className="border p-2 rounded-md"
				/>
				<input
					type="number"
					placeholder="Optimistic"
					value={newTask.optimistic}
					onChange={(e) =>
						setNewTask({ ...newTask, optimistic: Number(e.target.value) })
					}
					className="border p-2 rounded-md"
				/>
				<input
					type="number"
					placeholder="Most Likely"
					value={newTask.most_likely}
					onChange={(e) =>
						setNewTask({ ...newTask, most_likely: Number(e.target.value) })
					}
					className="border p-2 rounded-md"
				/>
				<input
					type="number"
					placeholder="Pessimistic"
					value={newTask.pessimistic}
					onChange={(e) =>
						setNewTask({ ...newTask, pessimistic: Number(e.target.value) })
					}
					className="border p-2 rounded-md"
				/>

				{/* Dependencies */}
				<div className="border p-2 rounded-md">
					<p className="text-sm mb-1">Dependencies:</p>
					<div className="flex flex-wrap gap-1">
						{tasks.map((t) => (
							<button
								key={t.id}
								type="button"
								onClick={() => toggleDependency(t.id)}
								className={`px-2 py-1 text-xs rounded-md ${
									newTask.dependencies.includes(t.id)
										? "bg-blue-500 text-white"
										: "bg-gray-100 text-gray-700"
								}`}
							>
								{t.id}
							</button>
						))}
					</div>
				</div>
			</div>

			<button
				onClick={handleAddTask}
				className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
			>
				Add Task
			</button>

			<button
				onClick={handleSubmitAll}
				className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 ml-3"
			>
				Save Tasks
			</button>

			{/* Preview */}
			{tasks.length > 0 && (
				<div className="mt-4 border-t pt-3">
					<h3 className="text-sm font-semibold mb-2">Current Tasks:</h3>
					<pre className="bg-gray-100 text-xs p-3 rounded-md overflow-x-auto">
						{JSON.stringify(tasks, null, 2)}
					</pre>
				</div>
			)}
		</div>
	);
}
