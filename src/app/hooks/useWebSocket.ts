"use client";

import { useEffect, useRef, useState } from "react";
import { createWebSocket } from "../config";

export function useWebSocket() {
	const [isConnected, setIsConnected] = useState(false);
	const [lastMessage, setLastMessage] = useState<unknown>(null);
	const wsRef = useRef<WebSocket | null>(null);
	const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const connect = () => {
		try {
			const ws = createWebSocket((data) => {
				setLastMessage(data);
			});

			ws.onopen = () => {
				setIsConnected(true);
				console.log("[v0] WebSocket connected successfully");
			};

			ws.onclose = () => {
				setIsConnected(false);
				console.log("[v0] WebSocket disconnected, attempting to reconnect...");

				// Attempt to reconnect after 5 seconds
				reconnectTimeoutRef.current = setTimeout(() => {
					connect();
				}, 5000);
			};

			ws.onerror = (error) => {
				console.error("[v0] WebSocket error:", error);
				setIsConnected(false);
			};

			wsRef.current = ws;
		} catch (error) {
			console.error("[v0] Failed to create WebSocket:", error);
			setIsConnected(false);
		}
	};

	useEffect(() => {
		connect();

		return () => {
			if (reconnectTimeoutRef.current) {
				clearTimeout(reconnectTimeoutRef.current);
			}
			if (wsRef.current) {
				wsRef.current.close();
			}
		};
	}, []);

	return { isConnected, lastMessage };
}
