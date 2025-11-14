import { useMemo } from 'react';

/**
 * GitHub‑style contribution calendar (SVG)
 * ----------------------------------------------------
 * Props:
 *  - data: Array<{ date: string | Date; count: number }>
 *  - startDate?: Date  (defaults to 52 weeks before endDate)
 *  - endDate?: Date    (defaults to today)
 *  - weekStart?: 0 | 1 (0=Sunday, 1=Monday; default 0)
 *  - colorScale?: string[] (5 swatches from low→high; index 0 is for zero)
 *  - thresholds?: number[] (length 4; upper bounds for levels 1..4)
 *  - onCellClick?: (info: CellInfo) => void
 *  - tooltip?: (info: CellInfo) => string (fallback uses native title)
 *
 * Usage:
 *  <ContributionCalendar data={myData} />
 * ----------------------------------------------------
 */

export type CellInfo = {
  date: Date;
  iso: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type ContributionCalendarProps = {
  data: Array<{ date: string | Date; count: number }>; // duplicate dates allowed; we'll sum
  startDate?: Date;
  endDate?: Date;
  weekStart?: 0 | 1;
  colorScale?: [string, string, string, string, string];
  thresholds?: [number, number, number, number];
  onCellClick?: (info: CellInfo) => void;
  tooltip?: (info: CellInfo) => string;
  className?: string;
  showLegend?: boolean;
  showWeekdayLabels?: boolean;
};

const DEFAULT_COLORS: [string, string, string, string, string] = [
  '#ebedf0',
  '#c6e48b',
  '#7bc96f',
  '#239a3b',
  '#196127',
];

const DEFAULT_THRESHOLDS: [number, number, number, number] = [1, 3, 6, 10];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function startOfWeek(d: Date, weekStart: 0 | 1) {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = date.getUTCDay(); // 0-6 Sun-Sat
  const diff = (day - weekStart + 7) % 7;
  date.setUTCDate(date.getUTCDate() - diff);
  return date;
}

function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + n);
  return x;
}

function toISO(d: Date) {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

export default function ContributionCalendar({
  data,
  startDate,
  endDate,
  weekStart = 0,
  colorScale = DEFAULT_COLORS,
  thresholds = DEFAULT_THRESHOLDS,
  onCellClick,
  tooltip,
  className,
  showLegend = true,
  showWeekdayLabels = true,
}: ContributionCalendarProps) {
  // Normalize input data: sum counts per ISO date
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const row of data ?? []) {
      const d = row.date instanceof Date ? row.date : new Date(row.date);
      // use UTC to avoid TZ drift
      const iso = toISO(new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())));
      map.set(iso, (map.get(iso) ?? 0) + (row.count ?? 0));
    }
    return map;
  }, [data]);

  // Determine date window (53 weeks like GitHub)
  const todayUTC = useMemo(() => {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  }, []);

  const end = useMemo(
    () =>
      endDate
        ? new Date(
            Date.UTC(
              endDate.getUTCFullYear?.() ?? endDate.getFullYear(),
              endDate.getUTCMonth?.() ?? endDate.getMonth(),
              endDate.getUTCDate?.() ?? endDate.getDate()
            )
          )
        : todayUTC,
    [endDate, todayUTC]
  );
  const firstWeekStart = useMemo(() => {
    if (startDate) {
      return startOfWeek(
        new Date(
          Date.UTC(
            startDate.getUTCFullYear?.() ?? startDate.getFullYear(),
            startDate.getUTCMonth?.() ?? startDate.getMonth(),
            startDate.getUTCDate?.() ?? startDate.getDate()
          )
        ),
        weekStart
      );
    }
    // default: 52 full weeks before end, aligned to weekStart
    const defaultStart = addDays(end, -7 * 52 + 1); // ~52 weeks window
    return startOfWeek(defaultStart, weekStart);
  }, [startDate, end, weekStart]);

  // Build cells day-by-day
  const days: CellInfo[] = useMemo(() => {
    const result: CellInfo[] = [];
    let cursor = new Date(firstWeekStart);
    const last = new Date(end);
    while (cursor <= last) {
      const iso = toISO(cursor);
      const count = counts.get(iso) ?? 0;
      const level = levelFor(count, thresholds);
      result.push({ date: new Date(cursor), iso, count, level });
      cursor = addDays(cursor, 1);
    }
    return result;
  }, [counts, firstWeekStart, end, thresholds]);

  // Group into weeks (columns), and compute month labels
  const weeks = useMemo(() => {
    const cols: CellInfo[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      cols.push(days.slice(i, i + 7));
    }
    return cols;
  }, [days]);

  const monthLabels = useMemo(() => {
    const labels: { x: number; text: string }[] = [];
    let prevMonth = -1;
    weeks.forEach((col, x) => {
      if (!col.length) return;
      const firstDay = col[0].date; // top cell of the week column
      const m = firstDay.getUTCMonth();
      if (m !== prevMonth) {
        labels.push({ x, text: MONTHS[m] });
        prevMonth = m;
      }
    });
    return labels;
  }, [weeks]);

  // Layout constants (SVG units in px)
  const CELL = 12; // square size
  const GAP = 2; // gap between squares
  const TOP = 20; // room for month labels
  const LEFT = showWeekdayLabels ? 22 : 0; // room for weekday labels
  const width = weeks.length * (CELL + GAP) + LEFT;
  const height = 7 * (CELL + GAP) + TOP;

  return (
    <div className={'w-full overflow-x-auto ' + (className ?? '')}>
      <div className="min-w-max w-full">
        <svg
          role="img"
          aria-label="Contribution calendar"
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="[&_.cell]:cursor-pointer select-none w-full"
          preserveAspectRatio="xMinYMin meet"
        >
          {/* Month labels */}
          <g transform={`translate(${LEFT}, 0)`}>
            {monthLabels.map((m, i) => (
              <text key={i} x={m.x * (CELL + GAP)} y={12} className="fill-gray-500 text-[10px]">
                {m.text}
              </text>
            ))}
          </g>

          {/* Weekday labels (Mon/Wed/Fri to reduce clutter) */}
          {showWeekdayLabels && (
            <g>
              {[1, 3, 5].map((dow) => (
                <text
                  key={dow}
                  x={0}
                  y={TOP + dow * (CELL + GAP) + 8}
                  className="fill-gray-500 text-[10px]"
                >
                  {WEEKDAY_LABELS[dow].slice(0, 1)}
                </text>
              ))}
            </g>
          )}

          {/* Cells */}
          <g transform={`translate(${LEFT}, ${TOP})`}>
            {weeks.map((col, x) => (
              <g key={x} transform={`translate(${x * (CELL + GAP)}, 0)`}>
                {col.map((cell, y) => (
                  <rect
                    key={cell.iso}
                    className="cell"
                    width={CELL}
                    height={CELL}
                    rx={2}
                    x={0}
                    y={y * (CELL + GAP)}
                    fill={colorScale[cell.level]}
                    aria-label={`${cell.count} contributions on ${cell.iso}`}
                    onClick={() => onCellClick?.(cell)}
                  >
                    <title>{tooltip ? tooltip(cell) : defaultTitle(cell)}</title>
                  </rect>
                ))}
              </g>
            ))}
          </g>
        </svg>

        {showLegend && (
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
            <span>Less</span>
            <div className="flex items-center gap-1">
              {colorScale.map((c, i) => (
                <div key={i} className="h-3 w-3 rounded" style={{ background: c }} />
              ))}
            </div>
            <span>More</span>
          </div>
        )}
      </div>
    </div>
  );
}

function defaultTitle(cell: CellInfo) {
  const { count, date } = cell;
  const d = `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
  return `${count} contribution${count === 1 ? '' : 's'} on ${d}`;
}

function levelFor(count: number, thresholds: [number, number, number, number]): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  if (count <= thresholds[0]) return 1;
  if (count <= thresholds[1]) return 2;
  if (count <= thresholds[2]) return 3;
  return 4; // > highest threshold
}

// /* ----------------------------- Demo Component ----------------------------- */
// // You can delete the demo below in production.
// export function DemoContributionCalendar() {
//   // Generate 52 weeks of fake data ending today
//   const today = new Date();
//   const end = new Date(
//     Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
//   );
//   const start = new Date(end);
//   start.setUTCDate(end.getUTCDate() - 7 * 52 + 1);
//   const rows: Array<{ date: string; count: number }> = [];
//   const cur = new Date(start);
//   while (cur <= end) {
//     const iso = cur.toISOString().slice(0, 10);
//     const weekend = cur.getUTCDay() === 0 || cur.getUTCDay() === 6;
//     const count = weekend ? rand(0, 2) : rand(0, 8);
//     rows.push({ date: iso, count });
//     cur.setUTCDate(cur.getUTCDate() + 1);
//   }

//   return (
//     <div className="p-4">
//       <h2 className="mb-3 text-lg font-semibold">
//         Demo – GitHub‑style Contribution Calendar
//       </h2>
//       <ContributionCalendar
//         data={rows}
//         onCellClick={cell => alert(`${cell.count} on ${cell.iso}`)}
//         tooltip={cell => `${cell.count} workouts on ${cell.iso}`}
//       />
//     </div>
//   );
// }

// function rand(min: number, max: number) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }
