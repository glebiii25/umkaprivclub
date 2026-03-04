import type { FavoriteItem } from '../utils/favorites';
import { useFavorites } from '../utils/favorites';

const BORDER_WHITE = 'rgba(255,255,255,0.4)';
const CARD_DARK = 'rgb(17,17,17)';

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

interface FavoriteButtonProps {
  item: FavoriteItem;
  className?: string;
}

export function FavoriteButton({ item, className = '' }: FavoriteButtonProps) {
  const { isFavoriteId, toggle } = useFavorites();
  const isFav = isFavoriteId(item.id);

  return (
    <button
      type="button"
      onClick={() => toggle(item)}
      className={`flex h-[44px] w-[44px] shrink-0 cursor-pointer items-center justify-center rounded-[12px] border transition-opacity hover:opacity-90 active:scale-[0.99] ${className}`}
      style={{
        backgroundColor: CARD_DARK,
        borderColor: BORDER_WHITE,
        borderWidth: 1,
        color: isFav ? 'rgb(255,100,100)' : 'rgb(255,255,255)',
      }}
      aria-label={isFav ? 'Удалить из избранного' : 'Добавить в избранное'}
    >
      <HeartIcon filled={isFav} />
    </button>
  );
}
