import { useState } from "preact/hooks";
import { Button } from "../components/Button.tsx";
import Input from "../components/Input.tsx";
import IconCalendarPlus from "https://deno.land/x/tabler_icons_tsx@0.0.2/tsx/calendar-plus.tsx";
import IconRefresh from "https://deno.land/x/tabler_icons_tsx@0.0.2/tsx/refresh.tsx";

let id = 0;
function nextId() {
  return id++;
}

interface WipSegment {
  id: number;
  from: Date;
  to?: Date;
  subject: string;
}

type Segment = WipSegment & {
  to: Date;
};

function formatTime(date: Date) {
  return date.toLocaleTimeString("de", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const hourStrings = Array.from(
  Array(24),
  (_, i) => formatTime(new Date(2000, 0, 1, i, 0, 0, 0)),
);

const firstHour = 8;
const lastHour = 19;

export default function TimeTable() {
  const [previous, setPrevious] = useState<Segment[]>([]);
  // const [previous, setPrevious] = useState<Segment[]>(testSegments);
  const [current, setCurrent] = useState<WipSegment | null>({
    id: nextId(),
    from: new Date(),
    subject: "",
  });

  const cellHeight = 3;

  return (
    <div class="flex flex-col gap-4 w-full">
      {/* controls */}
      <div class="flex flex-col gap-1 w-full">
        <div class="flex justify-center gap-2">
          <p class="text-gray-600 text-sm">
            Start: {current ? formatTime(current?.from) : "none"}
          </p>
          <button onClick={restartTimer}>
            <IconRefresh class="w-5 h-5" />
          </button>
        </div>
        <div class="flex gap-2 w-full items-center">
          <Input
            class="flex-1 min-w-0"
            type="text"
            placeholder="Subject"
            value={current?.subject ?? ""}
            disabled={!current}
            onChange={(e) =>
              current && setCurrent({
                ...current,
                // deno-lint-ignore no-explicit-any
                subject: (e?.target as unknown as any)?.value ?? "",
              })}
          />
          <Button onClick={start} disabled={!current?.subject}>
            <IconCalendarPlus />Add
          </Button>
        </div>
      </div>

      {/* time table */}
      <div>
        <div class="relative w-full">
          {/* hour rectangles */}
          <div class="top-0 left-0 w-full h-full bg-blue-50 border-t-1 border-blue-200">
            {fromTo(firstHour, lastHour + 1).map((hour) => (
              <div
                key={hour}
                class="w-full border-1 border-t-0 border-blue-200 px-1"
                style={{ height: `${cellHeight}rem` }}
              >
                {hourStrings[hour]}
              </div>
            ))}
          </div>
          {/* segments (position based on start/end time) */}
          <div class="absolute top-0 left-24 w-full h-full">
            {previous.map(({ id, from, to, subject }) => (
              <div
                key={id}
                class="absolute top-0 left-0 w-80 h-full border(1 gray-600)) bg-indigo-50 px-1"
                style={{
                  top: `${
                    (from.getHours() + from.getMinutes() / 60 - firstHour) *
                    cellHeight
                  }rem`,
                  height: `${
                    Math.max(
                      (to.getTime() - from.getTime()) / 1000 / 60 / 60 *
                        cellHeight,
                      cellHeight / 4,
                    )
                  }rem`,
                }}
              >
                {subject}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  function start() {
    if (current) {
      setPrevious([...previous, { ...current, to: new Date() }]);
    }
    setCurrent({ id: nextId(), from: new Date(), to: new Date(), subject: "" });
  }

  function restart() {
    if (current) {
      setPrevious([...previous, { ...current, to: new Date() }]);
    }
    setCurrent(null);
  }

  function restartTimer() {
    if (current) {
      setCurrent({ ...current, from: new Date() });
    } else {
      setCurrent({ id: nextId(), from: new Date(), subject: "" });
    }
  }
}

const testSegments = [
  {
    id: 10000,
    from: new Date(2021, 0, 1, 8, 0, 0, 0),
    to: new Date(2021, 0, 1, 9, 0, 0, 0),
    subject: "test",
  },
  {
    id: 10001,
    from: new Date(2021, 0, 1, 9, 0, 0, 0),
    to: new Date(2021, 0, 1, 10, 0, 0, 0),
    subject: "test",
  },
  {
    id: 10002,
    from: new Date(2021, 0, 1, 10, 0, 0, 0),
    to: new Date(2021, 0, 1, 12, 0, 0, 0),
    subject: "test",
  },
];

function fromTo(from: number, to: number) {
  return Array.from(Array(to - from), (_, i) => i + from);
}
