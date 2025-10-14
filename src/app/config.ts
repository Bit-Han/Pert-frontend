const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL 

export interface Task {
	id: string;
	optimistic: number;
	most_likely: number;
	pessimistic: number;
	dependencies: string[];
}

export interface TaskTiming {
	id: string;
	duration: number;
	ES: number;
	EF: number;
	LS: number;
	LF: number;
	slack: number;
}

export interface MonteCarloResult {
	mean: number;
	p50: number;
	p80: number;
	p95: number;
	durations: number[];
}

export interface PertResult {
	project_duration: number;
	task_timings: TaskTiming[];
	critical_paths: string[][];
	monte_carlo: MonteCarloResult;
}

export interface ComparisonResult {
	classical: {
		project_duration: number;
		critical_path: string[];
	};
	monte_carlo: {
		mean_duration: number;
		std_dev: number;
		percentiles: {
			50: number;
			90: number;
		};
	};
		comparison?: {
		difference: number;
		percentage_diff: number;
	};
}

export async function setTasks(tasks: Task[]): Promise<{ message: string }> {
	const response = await fetch(`${API_BASE_URL}/set-tasks`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(tasks),
	});
	if (!response.ok) throw new Error("Failed to set tasks");
	return response.json();
}

export async function runPertAnalysis(tasks: Task[]): Promise<PertResult> {
	const response = await fetch(`${API_BASE_URL}/pert`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(tasks),
	});
	if (!response.ok) throw new Error("Failed to run PERT analysis");
	return response.json();
}

export async function updateTask(task: Task): Promise<{ message: string }> {
	const response = await fetch(`${API_BASE_URL}/update-task`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(task),
	});
	if (!response.ok) throw new Error("Failed to update task");
	return response.json();
}

export async function comparePert(tasks: Task[]): Promise<ComparisonResult> {
	const response = await fetch(`${API_BASE_URL}/compare-pert`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(tasks),
	});
	if (!response.ok) throw new Error("Failed to compare PERT methods");

	const data = await response.json();

	const normalized: ComparisonResult = {
		classical: {
			project_duration: data.classical_pert?.expected_duration ?? 0,
			critical_path: [], // backend doesn’t send this
		},
		monte_carlo: {
			mean_duration: data.enhanced_pert?.mean_duration ?? 0,
			std_dev:
				(data.enhanced_pert?.p90 ?? 0) - (data.enhanced_pert?.p10 ?? 0) / 2, // rough approximation
			percentiles: {
				50: data.enhanced_pert?.mean_duration ?? 0,
				90: data.enhanced_pert?.p90 ?? 0,
			},
		},
		comparison: {
			difference: data.comparison?.difference_in_days ?? 0,
			percentage_diff:
				data.comparison?.difference_in_days &&
				data.classical_pert?.expected_duration
					? (data.comparison.difference_in_days /
							data.classical_pert.expected_duration) *
					  100
					: 0,
		},
	};

	return normalized;
}

export function createWebSocket(onMessage: (data: unknown) => void): WebSocket {
	const ws = new WebSocket("ws://127.0.0.1:8000/ws/updates");

	ws.onopen = () => {
		console.log("[v0] WebSocket connected");
	};

	ws.onmessage = (event) => {
		const data = JSON.parse(event.data);
		onMessage(data);
	};

	ws.onerror = (error) => {
		console.error("[v0] WebSocket error:", error);
	};

	ws.onclose = () => {
		console.log("[v0] WebSocket disconnected");
	};

	return ws;
}
