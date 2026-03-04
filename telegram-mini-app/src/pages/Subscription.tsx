import { Link } from 'react-router-dom';
import { BackButton } from '../components/BackButton';

const GREEN = 'rgb(0,255,47)';
const CARD_BG = 'rgb(17,17,17)';
const BUTTON_BG = 'rgb(48,48,48)';
const MAIN_BUTTON_BG = 'rgb(11,11,11)';

export type PlanId = '1month' | '3month' | '6month';

export interface TariffPlan {
  id: PlanId;
  title: string;
  price: string;
}

const PLANS: TariffPlan[] = [
  { id: '1month', title: 'Umka_Fit/ 1 месяц', price: '₽1550' },
  { id: '3month', title: 'Umka_Fit/ 3 месяца', price: '₽3990' },
  { id: '6month', title: 'Umka_Fit/ 6 месяцев', price: '₽6000' },
];

/** Текущий активный тариф пользователя (позже из API/localStorage) */
const ACTIVE_PLAN_ID: PlanId = '1month';

const SUBSCRIPTION_END_DATE = '17.03.2026';

function getPaymentPath(planId: PlanId): string {
  if (planId === '1month') return '/subscription';
  return `/payment?plan=${planId}`;
}

export function Subscription() {
  return (
    <div
      className="min-h-screen safe-area-padding pb-12"
      style={{ backgroundColor: 'rgb(0,0,0)', color: 'rgb(255,255,255)' }}
    >
      <div className="mx-auto flex max-w-[440px] flex-col items-center px-10">
        <div className="w-full pt-[20px]">
          <BackButton to="/profile" />
        </div>
        {/* Плашка Umka_Fit — 40,46  360×60  rounded 12  border white 40% */}
        <div
          className="mt-12 flex h-[60px] w-full max-w-[360px] items-center justify-center self-center rounded-[12px] border border-white/40 px-5 text-center"
        >
          <span className="font-bold" style={{ fontSize: 29, lineHeight: 1.2 }}>Umka_Fit</span>
        </div>

        {/* подписка активна до: + дата — 93,124 */}
        <div className="mt-5 w-full max-w-[360px] self-center">
          <p style={{ fontSize: 29, lineHeight: 1.2 }}>подписка активна до:</p>
          <p className="mt-5" style={{ fontSize: 29, lineHeight: 1.2, color: GREEN }}>
            {SUBSCRIPTION_END_DATE}
          </p>
        </div>

        {/* Тарифы — 40,235 */}
        <h2 className="mt-8 w-full max-w-[360px] self-center text-left" style={{ fontSize: 29, lineHeight: 1.2 }}>
          Тарифы
        </h2>

        {/* Карточки тарифов */}
        <div className="mt-8 flex w-full max-w-[360px] flex-col items-center gap-8 self-center">
          {PLANS.map((plan) => {
            const isActive = plan.id === ACTIVE_PLAN_ID;
            const paymentPath = getPaymentPath(plan.id);

            return (
              <div
                key={plan.id}
                className="w-full max-w-[280px] rounded-[18px] px-4 py-4"
                style={{
                  backgroundColor: CARD_BG,
                  minHeight: 180,
                }}
              >
                <p
                  className="text-[16px] leading-tight"
                  style={{ color: GREEN }}
                >
                  {plan.title}
                </p>
                <p
                  className="mt-[32px] font-normal"
                  style={{ fontSize: 43, lineHeight: 1.2 }}
                >
                  {plan.price}
                </p>
                <div className="mt-[32px] flex justify-center">
                  {isActive ? (
                    <div
                      className="flex h-10 min-w-[140px] cursor-default items-center justify-center rounded-[10px] text-[14px]"
                      style={{ backgroundColor: BUTTON_BG }}
                    >
                      ваш тариф
                    </div>
                  ) : (
                    <Link
                      to={paymentPath}
                      className="flex h-10 min-w-[140px] cursor-pointer items-center justify-center rounded-[10px] text-[14px] text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: BUTTON_BG }}
                    >
                      улучшить
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Кнопка главная — 155,973 */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/"
            className="flex h-10 min-w-[130px] cursor-pointer items-center justify-center rounded-[10px] text-[16px] font-normal text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: MAIN_BUTTON_BG }}
          >
            главная
          </Link>
        </div>
      </div>
    </div>
  );
}
