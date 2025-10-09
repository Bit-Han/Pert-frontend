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
import { comparePert, type Task, type ComparisonResult } from "../config";
import { toast } from "sonner";
import {
	Loader2,
	GitCompare,
	AlertCircle,
	TrendingUp,
	TrendingDown,
} from "lucide-react";
import { Badge } from "@pages/components/ui/badge";
import { ComparisonChart } from "@pages/app/component/ComparisonChart";

interface ComparisonViewProps {
	tasks: Task[];
	onComparisonResult: (result: ComparisonResult) => void;
	result: ComparisonResult | null;
}

export function ComparisonView({
	tasks,
	onComparisonResult,
	result,
}: ComparisonViewProps) {
	const [isComparing, setIsComparing] = useState(false);

	const handleCompare = async () => {
		if (tasks.length === 0) {
			toast.error("Please add tasks in the Task Management tab first.");
			return;
		}

		setIsComparing(true);
		try {
			const comparisonResult = await comparePert(tasks);
			onComparisonResult(comparisonResult);
			toast.success(
				"Classical PERT and Monte Carlo methods have been compared."
			);
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "An error occurred while comparing methods"
			);
		} finally {
			setIsComparing(false);
		}
	};

	if (!result) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Method Comparison</CardTitle>
					<CardDescription>
						Compare Classical PERT vs Monte Carlo Simulation
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
						<GitCompare className="h-12 w-12 text-muted-foreground" />
						<div>
							<p className="text-sm text-muted-foreground mb-4">
								Run a comparison to see the differences between Classical PERT
								and Monte Carlo simulation methods
							</p>
							<Button
								onClick={handleCompare}
								disabled={isComparing || tasks.length === 0}
							>
								{isComparing ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Comparing...
									</>
								) : (
									<>
										<GitCompare className="mr-2 h-4 w-4" />
										Run Comparison
									</>
								)}
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	const difference =
		result.monte_carlo.mean_duration - result.classical.project_duration;
	const percentageDiff = (difference / result.classical.project_duration) * 100;

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h2 className="text-2xl font-bold">Method Comparison Results</h2>
					<p className="text-sm text-muted-foreground">
						Classical PERT vs Monte Carlo Simulation
					</p>
				</div>
				<Button
					onClick={handleCompare}
					disabled={isComparing}
					variant="outline"
				>
					{isComparing ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Comparing...
						</>
					) : (
						<>
							<GitCompare className="mr-2 h-4 w-4" />
							Rerun Comparison
						</>
					)}
				</Button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Card className="border-2 border-primary">
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle>Classical PERT</CardTitle>
							<Badge variant="outline">Deterministic</Badge>
						</div>
						<CardDescription>
							Traditional three-point estimation method
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<p className="text-sm text-muted-foreground mb-1">
								Project Duration
							</p>
							<p className="text-4xl font-bold">
								{result.classical?.project_duration?.toFixed(2) ?? "0.00"}
							</p>
							<p className="text-sm text-muted-foreground">days</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground mb-2">
								Critical Path
							</p>
							<div className="flex flex-wrap gap-1">
								{result.classical.critical_path.map((task, i) => (
									<span key={i} className="flex items-center">
										<Badge variant="secondary">{task}</Badge>
										{i < result.classical.critical_path.length - 1 && (
											<span className="mx-1 text-muted-foreground">→</span>
										)}
									</span>
								))}
							</div>
						</div>
						<div className="pt-4 border-t">
							<p className="text-xs text-muted-foreground">
								Uses weighted average: (Optimistic + 4×Most Likely +
								Pessimistic) / 6
							</p>
						</div>
					</CardContent>
				</Card>

				<Card className="border-2 border-chart-2">
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle>Monte Carlo Simulation</CardTitle>
							<Badge variant="outline">Probabilistic</Badge>
						</div>
						<CardDescription>
							Statistical simulation with multiple iterations
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<p className="text-sm text-muted-foreground mb-1">
								Mean Duration
							</p>
							<p className="text-4xl font-bold">
								{result.monte_carlo?.mean_duration?.toFixed(2) ?? "0.00"}
							</p>
							<p className="text-sm text-muted-foreground">days</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground mb-1">
								Standard Deviation
							</p>
							<p className="text-2xl font-semibold">
								{result.monte_carlo?.std_dev?.toFixed(2)?? "0.00"}
							</p>
							<p className="text-sm text-muted-foreground">days</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground mb-2">Percentiles</p>
							<div className="grid grid-cols-2 gap-2">
								<div className="bg-muted p-2 rounded">
									<p className="text-xs text-muted-foreground">50th (P50)</p>
									<p className="font-semibold">
										{result.monte_carlo?.percentiles[50]?.toFixed(2)?? "0.00"} days
									</p>
								</div>
								<div className="bg-muted p-2 rounded">
									<p className="text-xs text-muted-foreground">90th (P90)</p>
									<p className="font-semibold">
										{result.monte_carlo?.percentiles[90]?.toFixed(2)?? "0.00"} days
									</p>
								</div>
							</div>
						</div>
						<div className="pt-4 border-t">
							<p className="text-xs text-muted-foreground">
								Runs thousands of simulations with random sampling from task
								distributions
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Difference Analysis</CardTitle>
					<CardDescription>
						Comparing the two estimation methods
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="flex items-center gap-4">
							<div
								className={`p-3 rounded-full ${
									difference > 0
										? "bg-orange-100 dark:bg-orange-900"
										: "bg-green-100 dark:bg-green-900"
								}`}
							>
								{difference > 0 ? (
									<TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
								) : (
									<TrendingDown className="h-6 w-6 text-green-600 dark:text-green-400" />
								)}
							</div>
							<div>
								<p className="text-sm text-muted-foreground">
									Duration Difference
								</p>
								<p className="text-2xl font-bold">
									{difference > 0 ? "+" : ""}
									{difference.toFixed(2)} days
								</p>
							</div>
						</div>

						<div className="flex items-center gap-4">
							<div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
								<AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">
									Percentage Difference
								</p>
								<p className="text-2xl font-bold">
									{percentageDiff > 0 ? "+" : ""}
									{percentageDiff.toFixed(2)}%
								</p>
							</div>
						</div>

						<div className="flex items-center gap-4">
							<div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
								<GitCompare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">
									Uncertainty Range
								</p>
								<p className="text-2xl font-bold">
									±{result.monte_carlo?.std_dev?.toFixed(2)?? "0.00"} days
								</p>
							</div>
						</div>
					</div>

					<div className="mt-6 p-4 bg-muted rounded-lg">
						<h4 className="font-semibold mb-2">Interpretation</h4>
						<p className="text-sm text-muted-foreground">
							{difference > 0 ? (
								<>
									The Monte Carlo simulation suggests the project may take{" "}
									<span className="font-semibold text-foreground">
										{Math.abs(difference).toFixed(2)} days longer
									</span>{" "}
									than the Classical PERT estimate. This indicates potential
									optimism in the deterministic approach. Consider using the P90
									value ({result.monte_carlo.percentiles[90].toFixed(2)} days)
									for more conservative planning.
								</>
							) : (
								<>
									The Monte Carlo simulation suggests the project may complete{" "}
									<span className="font-semibold text-foreground">
										{Math.abs(difference).toFixed(2)} days earlier
									</span>{" "}
									than the Classical PERT estimate. Both methods show relatively
									close alignment, indicating consistent task estimates.
								</>
							)}
						</p>
					</div>
				</CardContent>
			</Card>

			<ComparisonChart result={result} />
		</div>
	);
}
