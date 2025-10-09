"use client";

import { useState } from "react";
import TaskForm from "./components/TaskForm";
import ResultsPanel from "./components/ResultsPanel";
import ComparisonPanel from "./components/ComparisonPanel";

export default function Home() {
	const [tasks, setTasks] = useState<any[]>([]);

	return (
		<main className="max-w-3xl mx-auto p-6 space-y-6">
			<TaskForm onTasksUpdated={setTasks} />
			<ResultsPanel tasks={tasks} />
			<ComparisonPanel tasks={tasks} />
		</main>
	);
}
