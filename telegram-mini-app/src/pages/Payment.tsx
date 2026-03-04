import { Link, useSearchParams } from 'react-router-dom';
import { BackButton } from '../components/BackButton';

export function Payment() {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') ?? '';

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center safe-area-padding px-10 py-12"
      style={{
        backgroundColor: 'rgb(0,0,0)',
        color: 'rgb(255,255,255)',
      }}
    >
      <div className="absolute left-10 top-[20px]">
        <BackButton to="/subscription" />
      </div>
      <p className="font-bold" style={{ fontSize: 29, lineHeight: 1.2 }}>Оплата</p>
      {plan && (
        <p className="mt-2 text-sm opacity-80">
          Тариф: {plan === '3month' ? '3 месяца' : plan === '6month' ? '6 месяцев' : plan}
        </p>
      )}
      <Link
        to="/subscription"
        className="mt-4 cursor-pointer text-sm underline opacity-90 transition-opacity hover:opacity-100"
        style={{ color: 'rgb(255,255,255)' }}
      >
        К подписке
      </Link>
    </div>
  );
}
