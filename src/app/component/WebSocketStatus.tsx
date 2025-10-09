import { Badge } from "@pages/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

interface WebSocketStatusProps {
	isConnected: boolean;
}

export function WebSocketStatus({ isConnected }: WebSocketStatusProps) {
	return (
		<div className="flex items-center gap-2">
			<span className="text-sm text-muted-foreground">Real-time Updates</span>
			<Badge
				variant={isConnected ? "default" : "secondary"}
				className="gap-1.5"
			>
				{isConnected ? (
					<>
						<Wifi className="h-3 w-3" />
						Connected
					</>
				) : (
					<>
						<WifiOff className="h-3 w-3" />
						Disconnected
					</>
				)}
			</Badge>
		</div>
	);
}
