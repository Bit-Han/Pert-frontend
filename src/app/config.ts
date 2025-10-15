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


export interface UpdateMessage {
	type: "calculation_complete" | "task_updated" | "error";
	message: string;
	timestamp: string;
	details: string;
	data: PertResult;
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



export function createWebSocket(
	onMessage: (data: PertResult) => void
): WebSocket {
	const ws = new WebSocket(`${API_BASE_URL}ws/updates`);

	ws.onmessage = (event) => {
		try {
			const parsed = JSON.parse(event.data) as PertResult;
			onMessage(parsed);
		} catch (err) {
			console.error("WebSocket parse error:", err);
		}
	};

	return ws;
}

// export function createWebSocket(
// 	onMessage: (data: UpdateMessage) => void
// ): WebSocket {
// 	const wsUrl = `${API_BASE_URL}/ws/updates`;
// 	const ws = new WebSocket(wsUrl);

// 	ws.onmessage = (event) => {
// 		try {
// 			const parsed = JSON.parse(event.data) as UpdateMessage;
// 			onMessage(parsed);
// 		} catch (err) {
// 			console.error("Failed to parse WebSocket message:", err, event.data);
// 		}
// 	};

// 	return ws;
// }