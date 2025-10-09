
"use client";

import { useState, useEffect } from "react";

const API_BASE_URL = "http://127.0.0.1:8000";

interface Task {
	id: string;
	optimistic: number;
	most_likely: number;
	pessimistic: number;
	dependencies: string[];
}

export default function ResultsPanel({ tasks }: { tasks: Task[] }) {
	const [results, setResults] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const ws = new WebSocket("ws://127.0.0.1:8000/ws/update");
		ws.onopen = () => console.log("✅ WebSocket connected");
		ws.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				console.log("📡 WS Update:", data);
				setResults(data);
			} catch (err) {
				console.error("Error parsing WS data", err);
			}
		};
		ws.onclose = () => console.warn("⚠️ WebSocket closed");
		return () => ws.close();
	}, []);

	const runSimulation = async () => {
		if (!tasks || tasks.length === 0) return alert("Add tasks first!");
		setLoading(true);

		try {
			const res = await fetch(`${API_BASE_URL}/pert`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(tasks),
			});

			if (!res.ok) {
				const msg = await res.text();
				throw new Error(`Simulation failed: ${msg}`);
			}

			const data = await res.json();
			console.log("✅ Simulation result:", data);
			setResults(data);
		} catch (err) {
			console.error("❌ Error running simulation:", err);
			alert("Simulation failed. Check console for details.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-5 bg-white rounded-2xl shadow-md mt-5">
			<h2 className="text-lg font-semibold mb-4">Run Simulation</h2>

			<button
				onClick={runSimulation}
				disabled={loading}
				className={`px-4 py-2 rounded-md text-white ${
					loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
				}`}
			>
				{loading ? "Running..." : "Run PERT Simulation"}
			</button>

			{results && (
				<div className="mt-5 bg-gray-50 p-4 rounded-md border">
					<h3 className="font-semibold mb-2">Results</h3>
					<pre className="text-sm bg-gray-100 p-2 rounded-md overflow-x-auto">
						{JSON.stringify(results, null, 2)}
					</pre>
				</div>
			)}
		</div>
	);
}
