import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { Handshake } from 'lucide-react';

export const Logo: FC = () => {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 text-primary font-semibold no-underline hover:opacity-90"
    >
      <Handshake className="h-7 w-7" />
      <span className="text-2xl font-bold">keshra</span>
    </Link>
  );
};
