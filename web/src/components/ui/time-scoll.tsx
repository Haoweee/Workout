import React, { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type TimeScrollProps = {
  value: number; // total seconds
  maxMinutes?: number; // default 5
  maxSeconds?: number; // only when minute === maxMinutes (default 59)
  onChange: (seconds: number) => void;
};

const ROW_H = 36; // px — height of a single visible row (the slit)

export const TimeScroll: React.FC<TimeScrollProps> = ({
  value,
  maxMinutes = 5,
  maxSeconds = 59,
  onChange,
}) => {
  const initialMin = Math.floor(value / 60);
  const initialSec = value % 60;

  const [minSel, setMinSel] = useState(initialMin);
  const [secSel, setSecSel] = useState(initialSec);

  const minRef = useRef<HTMLDivElement>(null);
  const secRef = useRef<HTMLDivElement>(null);

  // Build lists
  const minutes = useMemo(() => Array.from({ length: maxMinutes + 1 }, (_, i) => i), [maxMinutes]);
  const seconds = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);

  // Programmatic alignment with incoming value
  useEffect(() => {
    setMinSel(initialMin);
    setSecSel(initialSec);
    minRef.current?.scrollTo({
      top: initialMin * ROW_H,
      behavior: 'auto',
    });
    secRef.current?.scrollTo({
      top: initialSec * ROW_H,
      behavior: 'auto',
    });
  }, [initialMin, initialSec]);

  const snap = (el: HTMLDivElement, index: number) =>
    el.scrollTo({ top: index * ROW_H, behavior: 'smooth' });

  // Debounced “snap to closest” on scroll end
  const makeOnScroll = (
    ref: React.RefObject<HTMLDivElement | null>,
    setSel: (n: number) => void,
    type: 'min' | 'sec'
  ) => {
    let t: number | undefined;
    return () => {
      if (!ref.current) return;
      if (t) clearTimeout(t);
      t = window.setTimeout(() => {
        const raw = ref.current!.scrollTop / ROW_H;
        let idx = Math.round(raw);

        if (type === 'min') {
          idx = Math.max(0, Math.min(maxMinutes, idx));
          snap(ref.current!, idx);
          setSel(idx);

          // clamp seconds if minute hits max
          const secMax = idx === maxMinutes ? maxSeconds : 59;
          if (secSel > secMax) {
            setSecSel(secMax);
            if (secRef.current) snap(secRef.current, secMax);
            onChange(idx * 60 + secMax);
          } else {
            onChange(idx * 60 + secSel);
          }
        } else {
          const secMax = minSel === maxMinutes ? maxSeconds : 59;
          idx = Math.max(0, Math.min(secMax, idx));
          snap(ref.current!, idx);
          setSel(idx);
          onChange(minSel * 60 + idx);
        }
      }, 80);
    };
  };

  const onMinScroll = makeOnScroll(minRef, setMinSel, 'min');
  const onSecScroll = makeOnScroll(secRef, setSecSel, 'sec');

  const rowCls = (isSelected: boolean, disabled?: boolean) =>
    cn(
      'h-12 flex items-center justify-center text-lg select-none',
      disabled && 'opacity-30 cursor-not-allowed',
      isSelected ? 'font-semibold' : 'font-normal'
    );

  return (
    <div className="relative inline-flex items-stretch">
      {/* Single highlight bar spanning both columns (same height as ROW_H) */}
      <div
        className="pointer-events-none absolute left-0 right-0 z-10 "
        style={{
          // bar vertically centered across the two viewers (they're both exactly ROW_H tall)
          top: 0,
          height: ROW_H,
        }}
      />

      {/* Minutes column */}
      <div className="flex-1 min-w-[72px]">
        <div
          ref={minRef}
          onScroll={onMinScroll}
          className="relative overflow-y-auto rounded-tl-lg rounded-bl-lg border-l border-t border-b snap-y snap-mandatory"
          style={{
            height: ROW_H, // Only one row visible
            scrollbarWidth: 'none',
          }}
        >
          {/* Hide WebKit scrollbar */}
          <style>
            {`
              /* Hide scrollbar for Chrome/Safari */
              .no-scrollbar::-webkit-scrollbar { display: none; }
            `}
          </style>
          <div className="no-scrollbar">
            {minutes.map((m) => (
              <div
                key={`m-${m}`}
                className={rowCls(m === minSel)}
                style={{ height: ROW_H }}
                onPointerDown={(e) => e.preventDefault()} // don't steal focus from parent inputs
              >
                {m} min
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seconds column */}
      <div className="flex-1 min-w-[72px]">
        <div
          ref={secRef}
          onScroll={onSecScroll}
          className="relative overflow-y-auto rounded-tr-lg rounded-br-lg border-r border-t border-b snap-y snap-mandatory"
          style={{
            height: ROW_H, // Only one row visible
            scrollbarWidth: 'none',
          }}
        >
          <div className="no-scrollbar">
            {seconds.map((s) => {
              const secMax = minSel === maxMinutes ? maxSeconds : 59;
              const disabled = s > secMax;
              return (
                <div
                  key={`s-${s}`}
                  className={rowCls(s === secSel, disabled)}
                  style={{ height: ROW_H }}
                  onPointerDown={(e) => (disabled ? e.preventDefault() : undefined)}
                >
                  {String(s).padStart(2, '0')} sec
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
