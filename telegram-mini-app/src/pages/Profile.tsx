import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSignal, initDataUser } from '@telegram-apps/sdk-react';
import {
  calculateKbju,
  ACTIVITY_MULTIPLIERS,
  type ActivityKey,
  type KbjuResult,
} from '../utils/kbju';
import { DatePicker } from '../components/DatePicker';
import { BackButton } from '../components/BackButton';

const STORAGE_KEY = 'umkafit_profile';
const FIELD_BG = 'rgb(17,17,17)';
const FIELD_BORDER = 'rgba(255,255,255,0.4)';
const LABEL_COLOR = 'rgb(121,121,121)';
const GREEN = 'rgb(0,255,47)';
const PURPLE = 'rgb(234,0,255)';
const RESULT_INNER_BG = 'rgb(11,11,11)';

interface SavedProfile {
  firstName: string;
  lastName: string;
  birthDate: string;
}

const defaultSaved: SavedProfile = {
  firstName: '',
  lastName: '',
  birthDate: '',
};

function formatBirthDateDisplay(s: string): string {
  if (!s) return '';
  const parts = s.split('-');
  if (parts.length === 3) return `${parts[2]}.${parts[1]}.${parts[0]}`;
  return s;
}

function loadProfile(): SavedProfile {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return { ...defaultSaved, ...JSON.parse(s) };
  } catch {}
  return { ...defaultSaved };
}

function ActivitySelect({ value, onChange }: { value: ActivityKey | ''; onChange: (v: ActivityKey | '') => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const selected = value ? ACTIVITY_MULTIPLIERS[value] : null;
  const triggerLabel = selected ? selected.label : 'выберите подходящую';

  return (
    <div ref={ref} className="relative mt-[34px]">
      <label className="block text-[14px] leading-tight" style={{ color: LABEL_COLOR }}>
        Ваша активность
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="mt-2 flex w-full min-h-[50px] cursor-pointer items-center justify-between gap-2 rounded-[12px] border px-3 py-3 text-left text-white focus:outline-none"
        style={{
          backgroundColor: FIELD_BG,
          borderColor: FIELD_BORDER,
          whiteSpace: 'normal',
          wordBreak: 'break-word',
        }}
      >
        <span
          className="flex-1 text-[15px] leading-snug"
          style={{ color: selected ? 'rgb(255,255,255)' : LABEL_COLOR, opacity: selected ? 1 : 0.7 }}
        >
          {triggerLabel}
        </span>
        <span className="shrink-0 self-start pt-0.5">▼</span>
      </button>
      {open && (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[60vh] overflow-y-auto rounded-[12px] border"
          style={{
            backgroundColor: FIELD_BG,
            borderColor: FIELD_BORDER,
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          {Object.entries(ACTIVITY_MULTIPLIERS).map(([key, { label }]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                onChange(key as ActivityKey);
                setOpen(false);
              }}
              className="block w-full px-4 py-3 text-left text-[15px] leading-snug text-white transition-opacity hover:opacity-90 first:rounded-t-[11px] last:rounded-b-[11px]"
              style={{
                borderBottom: key !== 'veryHigh' ? `1px solid ${FIELD_BORDER}` : undefined,
                whiteSpace: 'normal',
                wordBreak: 'break-word',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Profile() {
  const tgUser = useSignal(initDataUser);

  const [displayName, setDisplayName] = useState('');
  const [displayLastName, setDisplayLastName] = useState('');
  const [displayUsername, setDisplayUsername] = useState('');
  const [displayBirthDate, setDisplayBirthDate] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [activity, setActivity] = useState<ActivityKey | ''>('');
  const [kbjuResult, setKbjuResult] = useState<KbjuResult | null>(null);

  useEffect(() => {
    const saved = loadProfile();
    const first = saved.firstName || (tgUser?.first_name ?? '');
    const last = saved.lastName || (tgUser?.last_name ?? '');
    const birth = saved.birthDate ?? '';
    setFirstName(first);
    setLastName(last);
    setBirthDate(birth);
    setDisplayName(first || (tgUser?.first_name ?? ''));
    setDisplayLastName(last || (tgUser?.last_name ?? ''));
    setDisplayUsername(tgUser?.username ? `@${tgUser.username}` : '');
    setDisplayBirthDate(birth || '');
  }, [tgUser?.first_name, tgUser?.last_name, tgUser?.username]);

  const handleSave = () => {
    const payload: SavedProfile = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      birthDate: birthDate.trim(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setDisplayName(payload.firstName || (tgUser?.first_name ?? ''));
    setDisplayLastName(payload.lastName || (tgUser?.last_name ?? ''));
    setDisplayBirthDate(payload.birthDate);
  };

  const handleCalculate = () => {
    const w = parseFloat(weight.replace(',', '.'));
    const h = parseFloat(height.replace(',', '.'));
    const a = parseFloat(age.replace(',', '.'));
    if (Number.isNaN(w) || Number.isNaN(h) || Number.isNaN(a) || w <= 0 || h <= 0 || a <= 0 || gender === null) {
      return;
    }
    if (!activity || !(activity in ACTIVITY_MULTIPLIERS)) return;
    const result = calculateKbju({
      weight: w,
      height: h,
      age: a,
      isMale: gender === 'male',
      activityKey: activity as ActivityKey,
    });
    setKbjuResult(result);
  };

  const avatarUrl = tgUser?.photo_url ?? null;

  return (
    <div
      className="min-h-screen safe-area-padding pb-12"
      style={{ backgroundColor: 'rgb(0,0,0)', color: 'rgb(255,255,255)' }}
    >
      <div className="mx-auto max-w-[440px] px-10">
        <div className="pt-[20px]">
          <BackButton to="/" />
        </div>
        {/* Заголовок "Профиль" — 131,39 177×48 */}
        <h1
          className="pt-[39px] font-normal"
          style={{ fontSize: 48, lineHeight: 1.2 }}
        >
          Профиль
        </h1>

        {/* инфа из тг — 40,121: аватар 120×120, текст справа */}
        <div className="mt-[34px] flex gap-5">
          <div
            className="h-[120px] w-[120px] shrink-0 overflow-hidden rounded-full border"
            style={{ borderColor: FIELD_BORDER }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gray-700" />
            )}
          </div>
          <div className="flex flex-col justify-center gap-1">
            <span style={{ fontSize: 19, lineHeight: 1.2 }}>
              {[displayName, displayLastName].filter(Boolean).join(' ') || 'Имя Фамилия'}
            </span>
            <span style={{ fontSize: 19, lineHeight: 1.2, opacity: 1 }}>
              {displayUsername || '@тг айди'}
            </span>
            <span style={{ fontSize: 19, lineHeight: 1.2 }}>
              {formatBirthDateDisplay(displayBirthDate) || 'дата рождения'}
            </span>
          </div>
        </div>

        {/* Имя — 40,264 */}
        <div className="mt-[23px]">
          <label className="block text-[14px] leading-tight" style={{ color: LABEL_COLOR }}>
            Имя
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="имя"
            className="mt-2 w-full rounded-[12px] border px-3 py-3 text-white placeholder:opacity-20 focus:outline-none"
            style={{
              height: 50,
              backgroundColor: FIELD_BG,
              borderColor: FIELD_BORDER,
            }}
          />
          <p className="mt-2 text-[14px]" style={{ color: LABEL_COLOR }}>
            По умолчанию загружается из Telegram
          </p>
        </div>

        {/* Фамилия — 40,396 */}
        <div className="mt-[34px]">
          <label className="block text-[14px] leading-tight" style={{ color: LABEL_COLOR }}>
            Фамилия
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="фамилия"
            className="mt-2 w-full rounded-[12px] border px-3 py-3 text-white placeholder:opacity-20 focus:outline-none"
            style={{
              height: 50,
              backgroundColor: FIELD_BG,
              borderColor: FIELD_BORDER,
            }}
          />
          <p className="mt-2 text-[14px]" style={{ color: LABEL_COLOR }}>
            По умолчанию загружается из Telegram
          </p>
        </div>

        {/* Дата рождения — 40,528 */}
        <div className="mt-[34px]">
          <label className="block text-[14px] leading-tight" style={{ color: LABEL_COLOR }}>
            Дата рождения
          </label>
          <div className="mt-2">
            <DatePicker
              value={birthDate}
              onChange={setBirthDate}
              placeholder="дд.мм.гггг"
            />
          </div>
        </div>

        {/* Кнопка Сохранить — 140,636 */}
        <div className="mt-[34px] flex justify-center">
          <button
            type="button"
            onClick={handleSave}
            className="cursor-pointer rounded-[10px] px-6 py-2 font-normal text-white transition-all hover:opacity-90 active:scale-[0.99]"
            style={{ height: 40, minWidth: 140, backgroundColor: FIELD_BG }}
          >
            Сохранить
          </button>
        </div>

        {/* Калькулятор КБЖУ — 40,732 */}
        <div className="mt-[56px]">
          <h2 style={{ fontSize: 29, lineHeight: 1.2 }}>Калькулятор КБЖУ</h2>
          <p className="mt-1 text-[19px]" style={{ opacity: 0.4 }}>
            Внесите свои данные в поля
          </p>

          {/* Ваш пол — 40,834 */}
          <p className="mt-[48px] text-[14px] leading-tight" style={{ color: LABEL_COLOR }}>
            Ваш пол
          </p>
          <div className="mt-2 flex gap-5">
            <button
              type="button"
              onClick={() => setGender('male')}
              className="h-10 flex-1 cursor-pointer rounded-[12px] px-4 py-2 text-[14px] text-white transition-opacity hover:opacity-90"
              style={{
                backgroundColor: FIELD_BG,
                border: `1px solid ${gender === 'male' ? GREEN : 'transparent'}`,
              }}
            >
              Мужской
            </button>
            <button
              type="button"
              onClick={() => setGender('female')}
              className="h-10 flex-1 cursor-pointer rounded-[12px] px-4 py-2 text-[14px] text-white transition-opacity hover:opacity-90"
              style={{
                backgroundColor: FIELD_BG,
                border: `1px solid ${gender === 'female' ? PURPLE : 'transparent'}`,
              }}
            >
              Женский
            </button>
          </div>

          {/* Вес */}
          <div className="mt-[39px]">
            <label className="block text-[14px] leading-tight" style={{ color: LABEL_COLOR }}>
              Ваш вес
            </label>
            <input
              type="number"
              inputMode="decimal"
              min={1}
              max={300}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="mt-2 w-full rounded-[12px] border px-3 py-3 text-white focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              style={{
                height: 50,
                backgroundColor: FIELD_BG,
                borderColor: FIELD_BORDER,
              }}
              placeholder="кг"
            />
          </div>

          {/* Рост */}
          <div className="mt-[34px]">
            <label className="block text-[14px] leading-tight" style={{ color: LABEL_COLOR }}>
              Ваш рост
            </label>
            <input
              type="number"
              inputMode="decimal"
              min={1}
              max={250}
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="mt-2 w-full rounded-[12px] border px-3 py-3 text-white focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              style={{
                height: 50,
                backgroundColor: FIELD_BG,
                borderColor: FIELD_BORDER,
              }}
              placeholder="см"
            />
          </div>

          {/* Возраст */}
          <div className="mt-[34px]">
            <label className="block text-[14px] leading-tight" style={{ color: LABEL_COLOR }}>
              Ваш возраст
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={120}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="mt-2 w-full rounded-[12px] border px-3 py-3 text-white focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              style={{
                height: 50,
                backgroundColor: FIELD_BG,
                borderColor: FIELD_BORDER,
              }}
              placeholder="лет"
            />
          </div>

          {/* Активность */}
          <ActivitySelect value={activity} onChange={setActivity} />

          {/* Кнопка Рассчитать */}
          <div className="mt-[32px] flex justify-center">
            <button
              type="button"
              onClick={handleCalculate}
              className="cursor-pointer rounded-[10px] px-6 py-2 font-normal text-white transition-all hover:opacity-90 active:scale-[0.99]"
              style={{ height: 40, minWidth: 140, backgroundColor: FIELD_BG }}
            >
              Рассчитать
            </button>
          </div>

          {/* Результат — 40,1380 */}
          {kbjuResult && (
            <div
              className="mt-[28px] overflow-hidden rounded-[15px] p-5"
              style={{ backgroundColor: FIELD_BG }}
            >
              <p className="mb-3 text-[18px] font-bold leading-tight">Результат:</p>
              <div
                className="rounded-[15px] p-4"
                style={{ backgroundColor: RESULT_INNER_BG }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1 text-center">
                    <p className="text-[24px] font-normal leading-tight">{kbjuResult.mifflin}</p>
                    <p className="mt-2 text-[13px] leading-tight opacity-90">
                      по формуле Миффлина-Сан Жеора
                    </p>
                  </div>
                  <div className="min-w-0 flex-1 text-center">
                    <p className="text-[24px] font-normal leading-tight">{kbjuResult.harris}</p>
                    <p className="mt-2 text-[13px] leading-tight opacity-90">
                      по формуле
                      <br />
                      Харриса-Бенедикта
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Подписка — плашка */}
        <Link
          to="/subscription"
          className="mt-[56px] flex h-[88px] w-full cursor-pointer items-center justify-between rounded-[16px] px-5 transition-opacity hover:opacity-90"
          style={{ backgroundColor: FIELD_BG }}
        >
          <span className="text-[20px] leading-tight text-white">
            подписка до
          </span>
          <span className="text-[20px] font-medium leading-tight" style={{ color: GREEN }}>
            15.03.2026
          </span>
        </Link>

        {/* Кнопка главная */}
        <div className="mt-[32px] mb-12 flex justify-center">
          <Link
            to="/"
            className="flex h-10 min-w-[130px] cursor-pointer items-center justify-center rounded-[10px] font-normal text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: RESULT_INNER_BG }}
          >
            главная
          </Link>
        </div>
      </div>
    </div>
  );
}
