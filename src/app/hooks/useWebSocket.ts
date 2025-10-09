"use client";
import { useEffect, useRef } from "react";

export default function useWebSocket(onMessage: (msg: string | object) => void, p0: boolean) {
	const wsRef = useRef<WebSocket | null>(null);

	useEffect(() => {
		let ping: unknown; 
		function connect() {
			const ws = new WebSocket("ws://127.0.0.1:8000/ws/updates");
			wsRef.current = ws;

			ws.onopen = () => {
				console.log("✅ WebSocket connected");
				ping = setInterval(() => {
					if (ws.readyState === 1) ws.send("ping");
				}, 15000);
			};

			ws.onmessage = (ev) => {
				try {
					const data = JSON.parse(ev.data);
					onMessage(data);
				} catch {
					console.warn("Invalid WS message:", ev.data);
				}
			};

			ws.onclose = () => {
				console.warn("⚠️ WebSocket closed. Reconnecting...");
				clearInterval(ping);
				setTimeout(connect, 3000);
			};
		}

		connect();
		return () => {
			clearInterval(ping);
			wsRef.current?.close();
		};
	}, [onMessage]);
}
