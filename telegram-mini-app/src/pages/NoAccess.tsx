const BG = 'rgb(0,0,0)';
const TEXT = 'rgb(255,255,255)';
const MUTED = 'rgb(121,121,121)';

export function NoAccess() {
  return (
    <div
      className="min-h-screen safe-area-padding flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: BG, color: TEXT }}
    >
      <h1 className="text-xl font-semibold text-center">
        Нет доступа
      </h1>
      <p className="mt-4 text-center" style={{ color: MUTED, fontSize: 16 }}>
        Ваш аккаунт не в списке допущенных пользователей. Обратитесь к администратору.
      </p>
    </div>
  );
}
