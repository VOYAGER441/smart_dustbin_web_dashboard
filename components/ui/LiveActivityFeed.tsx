"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Radio, Wifi, WifiOff } from "lucide-react";
import { LIVE_BIN_ID, formatRelative, useLiveBin } from "@/lib/binLive";

type Severity = "info" | "warning" | "success";

interface ActivityEvent {
  id: number;
  at: number;
  message: string;
  severity: Severity;
}

const MAX_EVENTS = 8;

const ICONS: Record<Severity, React.ComponentType<{ className?: string }>> = {
  info: Wifi,
  warning: AlertTriangle,
  success: CheckCircle2,
};

const COLOR: Record<Severity, string> = {
  info: "text-cyan-300",
  warning: "text-yellow-300",
  success: "text-emerald-300",
};

export default function LiveActivityFeed({ className = "" }: { className?: string }) {
  const { derived, now } = useLiveBin();
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const lastStateRef = useRef<{
    status: string | null;
    online: boolean | null;
    fillLevel: number | null;
  }>({ status: null, online: null, fillLevel: null });
  const seqRef = useRef(0);

  // Detect transitions and append events
  useEffect(() => {
    if (!derived) return;
    const prev = lastStateRef.current;
    const next = {
      status: derived.status,
      online: derived.online,
      fillLevel: derived.fillLevel,
    };

    const push = (severity: Severity, message: string) => {
      setEvents((curr) => {
        const evt: ActivityEvent = {
          id: ++seqRef.current,
          at: Date.now(),
          message,
          severity,
        };
        const next = [evt, ...curr];
        return next.length > MAX_EVENTS ? next.slice(0, MAX_EVENTS) : next;
      });
    };

    if (prev.online === null) {
      push("info", `Connected to ${LIVE_BIN_ID} — ${derived.fillLevel}% fill`);
    } else {
      if (prev.online !== next.online) {
        push(
          next.online ? "info" : "warning",
          next.online
            ? `${LIVE_BIN_ID} reconnected`
            : `${LIVE_BIN_ID} went stale (no recent ping)`
        );
      }
      if (prev.status !== next.status) {
        if (next.status === "Filled") {
          push("warning", `${LIVE_BIN_ID} is now FULL — dispatch a collector`);
        } else if (next.status === "Emptied" && prev.status === "Filled") {
          push("success", `${LIVE_BIN_ID} was emptied`);
        } else {
          push("info", `${LIVE_BIN_ID} status changed to ${next.status}`);
        }
      }
    }

    lastStateRef.current = next;
  }, [derived]);

  return (
    <div className={`rounded-3xl border border-gray-800 bg-gray-900/80 p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-5">
        <Radio
          className={`w-5 h-5 ${
            derived?.online ? "text-emerald-300" : "text-yellow-300"
          }`}
        />
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-gray-400">Live activity</p>
          <p className="mt-1 text-sm text-gray-300">
            Telemetry-driven events from the IoT node
          </p>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="flex items-center gap-3 rounded-2xl bg-gray-950/70 p-4 text-sm text-gray-400">
          <WifiOff className="w-4 h-4 text-gray-500" />
          Listening for state changes from {LIVE_BIN_ID}…
        </div>
      ) : (
        <ul className="space-y-3">
          {events.map((evt) => {
            const Icon = ICONS[evt.severity];
            return (
              <li
                key={evt.id}
                className="flex items-start gap-3 rounded-2xl bg-gray-950/70 p-3 text-sm"
              >
                <Icon className={`mt-0.5 w-4 h-4 ${COLOR[evt.severity]}`} />
                <div className="flex-1">
                  <p className="text-gray-200">{evt.message}</p>
                  <p className="mt-0.5 text-[11px] text-gray-500">
                    {formatRelative(evt.at, now)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
