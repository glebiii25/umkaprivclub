import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  /** Fallback route when history is empty (e.g. opened directly) */
  to?: string;
  className?: string;
}

export function BackButton({ to, className = '' }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`text-[16px] text-white/80 transition-colors hover:text-white focus:outline-none ${className}`}
    >
      ← Назад
    </button>
  );
}
