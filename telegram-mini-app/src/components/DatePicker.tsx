import { useState, useRef, useEffect } from 'react';

const PICKER_BG = 'rgb(28,28,30)';
const TEXT_WHITE = 'rgb(255,255,255)';
const ACCENT_BLUE = 'rgb(0,145,255)';
const DAY_LABEL_OPACITY = 0.3;

const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];
const WEEKDAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** Парсит строку dd.mm.yyyy или dd/mm/yyyy в yyyy-mm-dd или null */
function parseDateInput(input: string): string | null {
  const s = input.trim().replace(/\//g, '.');
  const parts = s.split('.');
  if (parts.length !== 3) return null;
  const [d, m, y] = parts.map((p) => parseInt(p, 10));
  if (Number.isNaN(d) || Number.isNaN(m) || Number.isNaN(y)) return null;
  if (d < 1 || d > 31 || m < 1 || m > 12 || y < 1900 || y > 2100) return null;
  const date = new Date(y, m - 1, d);
  if (date.getDate() !== d || date.getMonth() !== m - 1 || date.getFullYear() !== y) return null;
  const yy = String(y);
  const mm = String(m).padStart(2, '0');
  const dd = String(d).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

export function DatePicker({ value, onChange, placeholder = 'дд.мм.гггг', className = '', style = {} }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState(() => (value ? formatDisplay(value) : ''));
  const [viewDate, setViewDate] = useState(() => {
    if (value) {
      const [y, m] = value.split('-').map(Number);
      return new Date(y, m - 1, 1);
    }
    return new Date();
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value) : null;

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const formatDisplay = (s: string) => {
    if (!s) return '';
    const [y, m, d] = s.split('-');
    return `${d}.${m}.${y}`;
  };

  // Синхронизация inputText с value при изменении извне
  useEffect(() => {
    setInputText(value ? formatDisplay(value) : '');
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digits = raw.replace(/\D/g, '').slice(0, 8);
    if (digits.length === 0) {
      setInputText('');
      return;
    }
    const d = digits.slice(0, 2);
    const m = digits.slice(2, 4);
    const y = digits.slice(4, 8);
    const parts: string[] = [];
    if (d) parts.push(d);
    if (m) parts.push(m);
    if (y) parts.push(y);
    setInputText(parts.join('.'));
  };

  const handleInputBlur = () => {
    const parsed = parseDateInput(inputText);
    if (parsed) {
      onChange(parsed);
      setInputText(formatDisplay(parsed));
    } else if (inputText.trim() === '') {
      onChange('');
    } else {
      // Невалидный ввод — восстанавливаем предыдущее значение
      setInputText(value ? formatDisplay(value) : '');
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startPad = first.getDay();
    const days: (Date | null)[] = [];
    for (let i = 0; i < startPad; i++) days.push(null);
    for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d));
    return days;
  };

  const isSameDay = (a: Date | null, b: Date | null) => {
    if (!a || !b) return false;
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  };

  const handleSelect = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const next = `${y}-${m}-${day}`;
    onChange(next);
    setInputText(formatDisplay(next));
    setOpen(false);
  };

  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const days = getDaysInMonth(viewDate);

  return (
    <div ref={containerRef} className="relative flex">
      <input
        type="text"
        value={inputText}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        inputMode="numeric"
        className={`flex-1 rounded-[12px] border px-3 py-3 text-white placeholder:opacity-40 focus:outline-none ${className}`}
        style={{
          height: 50,
          backgroundColor: 'rgb(17,17,17)',
          borderColor: 'rgba(255,255,255,0.4)',
          ...style,
        }}
      />

      {open && (
        <div
          className="absolute left-0 top-full z-50 mt-2 overflow-hidden rounded-[13px]"
          style={{
            width: 'min(370px, 100%)',
            backgroundColor: PICKER_BG,
            boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
          }}
        >
          {/* Header: Month Year + Prev/Next */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-1">
              <span style={{ fontSize: 17, color: TEXT_WHITE }}>
                {MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}
              </span>
              <span style={{ color: ACCENT_BLUE, fontSize: 12 }}>▼</span>
            </div>
            <div className="flex items-center gap-7">
              <button
                type="button"
                onClick={prevMonth}
                className="cursor-pointer text-[17px] leading-none transition-opacity hover:opacity-80"
                style={{ color: ACCENT_BLUE }}
              >
                ‹
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="cursor-pointer text-[17px] leading-none transition-opacity hover:opacity-80"
                style={{ color: ACCENT_BLUE }}
              >
                ›
              </button>
            </div>
          </div>

          {/* Weekday headers + Calendar grid — единая сетка 7 колонок */}
          <div
            className="px-4 pb-4"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 0,
            }}
          >
            {WEEKDAYS.map((w) => (
              <div
                key={w}
                className="flex items-center justify-center"
                style={{ fontSize: 13, color: TEXT_WHITE, opacity: DAY_LABEL_OPACITY, height: 20 }}
              >
                {w}
              </div>
            ))}
            {days.map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-center"
                style={{ width: '100%', aspectRatio: '1', maxHeight: 44 }}
              >
                {d ? (
                  <button
                    type="button"
                    onClick={() => handleSelect(d)}
                    className="flex h-10 w-10 min-w-10 cursor-pointer items-center justify-center rounded-full text-[17px] transition-opacity hover:opacity-90"
                    style={{
                      color: isSameDay(d, selectedDate) ? '#fff' : TEXT_WHITE,
                      backgroundColor: isSameDay(d, selectedDate) ? ACCENT_BLUE : 'transparent',
                    }}
                  >
                    {d.getDate()}
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
