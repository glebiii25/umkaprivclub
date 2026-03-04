import { Link } from 'react-router-dom';
import { useFavorites } from '../utils/favorites';
import { BackButton } from '../components/BackButton';

const BORDER_WHITE = 'rgba(255,255,255,0.4)';
const CARD_DARK = 'rgb(17,17,17)';

export function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen safe-area-padding pb-12" style={{ backgroundColor: 'rgb(0,0,0)' }}>
      <div className="mx-auto max-w-[440px] px-10 pt-10 pb-10">
        <div className="mb-8 flex items-center gap-4 pt-[20px]">
          <BackButton to="/" />
        </div>
        <h1 className="mb-2 font-bold" style={{ fontSize: 29, lineHeight: 1.2, color: 'rgb(255,255,255)' }}>
          Избранное
        </h1>
        <p className="mb-6 font-normal" style={{ fontSize: 16, color: 'rgb(121,121,121)' }}>
          {favorites.length === 0
            ? 'Здесь будут сохранённые уроки. Добавляй их кнопкой «Добавить в избранное» на странице урока.'
            : `Сохранено уроков: ${favorites.length}`}
        </p>

        <div className="flex flex-col items-center gap-4">
          {favorites.map((item) => (
            <Link
              key={item.id}
              to={item.href}
              className="flex h-[70px] w-full max-w-[350px] cursor-pointer items-center justify-center rounded-[12px] border px-4 text-center transition-opacity hover:opacity-80"
              style={{
                borderColor: BORDER_WHITE,
                backgroundColor: CARD_DARK,
                color: 'rgb(255,255,255)',
                fontSize: 17,
              }}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
