import { useState } from "preact/hooks";
import Button from "../components/Button.tsx";
import Input from "../components/Input.tsx";
import IconCalendarPlus from "https://deno.land/x/tabler_icons_tsx@0.0.2/tsx/calendar-plus.tsx";
import IconRefresh from "https://deno.land/x/tabler_icons_tsx@0.0.2/tsx/refresh.tsx";
import IconPlus from "https://deno.land/x/tabler_icons_tsx@0.0.2/tsx/plus.tsx";
import IconMinus from "https://deno.land/x/tabler_icons_tsx@0.0.2/tsx/minus.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";

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
            Start: {IS_BROWSER && current ? formatTime(current?.from) : "none"}
          </p>
          <button onClick={reset}>
            <IconRefresh class="w-5 h-5" />
          </button>
          <button onClick={subFromStartTime}>
            <IconMinus class="w-5 h-5" />
          </button>
          <button onClick={addToStartTime}>
            <IconPlus class="w-5 h-5" />
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
                subject: (e?.target as unknown as { value: string })?.value ??
                  "",
              })}
          />
          <Button onClick={addAndReset} disabled={!current?.subject}>
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
          <div class="absolute top-0 left-24 h-full">
            {previous.map((segment) => (
              <SegmentView
                key={segment.id}
                class="border(1 gray-600)) bg-indigo-50 bg-opacity-50"
                segment={segment}
              />
            ))}
            {/* current segment */}
            {current && (
              <SegmentView
                class="border(1 green-500 dashed) opacity-50"
                segment={{ ...current, to: new Date() }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  function SegmentView(
    { segment: { subject, from, to }, class: class_ }: {
      segment: Segment;
      class?: string;
    },
  ) {
    return (
      <div
        key={id}
        class={`absolute top-0 left-0 w-80 h-full px-1 ${class_}`}
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
    );
  }

  function addAndReset() {
    if (current) {
      setPrevious([...previous, { ...current, to: new Date() }]);
    }
    setCurrent({ id: nextId(), from: new Date(), to: new Date(), subject: "" });
  }

  function reset() {
    if (current) {
      setCurrent({ ...current, from: new Date() });
    } else {
      setCurrent({ id: nextId(), from: new Date(), subject: "" });
    }
  }

  function addToStartTime() {
    if (current) {
      setCurrent({
        ...current,
        from: new Date(current.from.getTime() + 60000 * 15),
      });
    }
  }

  function subFromStartTime() {
    if (current) {
      setCurrent({
        ...current,
        from: new Date(current.from.getTime() - 60000 * 15),
      });
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
