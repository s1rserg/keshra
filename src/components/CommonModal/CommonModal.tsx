import { type FC, type ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui';

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string | ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const CommonModal: FC<Props> = ({
  isOpen,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'md',
}) => {
  const sizeClass =
    size === 'sm' ? 'sm:max-w-[300px]' : size === 'lg' ? 'sm:max-w-[700px]' : 'sm:max-w-[425px]';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={`${sizeClass}`}>
        {title || description ? (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            <DialogDescription className="sr-only">{title}</DialogDescription>
          </DialogHeader>
        ) : null}

        <div>{children}</div>

        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};
