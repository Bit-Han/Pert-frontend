


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

export default function ComparisonPanel({ tasks }: { tasks: Task[] }) {
	const [comparison, setComparison] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	const handleCompare = async () => {
		if (!tasks || tasks.length === 0) return alert("Add tasks first!");
		setLoading(true);

		try {
			const res = await fetch(`${API_BASE_URL}/compare-pert`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(tasks),
			});

			if (!res.ok) {
				const msg = await res.text();
				throw new Error(`Compare failed: ${msg}`);
			}

			const data = await res.json();
			console.log("✅ Comparison result:", data);
			setComparison(data);
		} catch (err) {
			console.error("❌ Error comparing:", err);
			alert("Failed to compare simulations. Check console for details.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-5 bg-white rounded-2xl shadow-md mt-5">
			<h2 className="text-lg font-semibold mb-4">
				Compare Classical vs Monte Carlo
			</h2>

			<button
				onClick={handleCompare}
				disabled={loading}
				className={`px-4 py-2 rounded-md text-white ${
					loading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
				}`}
			>
				{loading ? "Comparing..." : "Compare Simulations"}
			</button>

			{comparison && (
				<div className="mt-5 bg-gray-50 p-4 rounded-md border">
					<h3 className="font-semibold mb-2">Comparison Results</h3>

					<div className="text-sm space-y-2">
						<p>
							<b>Classical Duration:</b>{" "}
							{comparison.classical?.project_duration?.toFixed(2) ?? "N/A"} days
						</p>
						<p>
							<b>Monte Carlo Mean Duration:</b>{" "}
							{comparison.monte_carlo?.mean_duration?.toFixed(2) ?? "N/A"} days
						</p>
						<p>
							<b>Monte Carlo Std Dev:</b>{" "}
							{comparison.monte_carlo?.std_dev?.toFixed(2) ?? "N/A"} days
						</p>
						<p>
							<b>Difference:</b>{" "}
							{(
								(comparison.monte_carlo?.mean_duration ?? 0) -
								(comparison.classical?.project_duration ?? 0)
							).toFixed(2)}{" "}
							days
						</p>
					</div>

					<pre className="bg-gray-100 text-xs mt-3 p-3 rounded-md overflow-x-auto">
						{JSON.stringify(comparison, null, 2)}
					</pre>
				</div>
			)}
		</div>
	);
}
