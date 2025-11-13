import { Button, Tooltip, TooltipContent, TooltipTrigger } from 'components/ui';
import type { FC, ReactNode } from 'react';

interface Props {
  onClick?: () => void;
  label: string;
  icon: ReactNode;
  variant?: 'default' | 'ghost' | 'outline' | 'secondary' | 'destructive';
  size?: 'default' | 'icon' | 'sm' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const IconButton: FC<Props> = ({
  onClick,
  label,
  icon,
  variant = 'ghost',
  size = 'icon',
  type = 'button',
  disabled = false,
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={onClick}
          type={type}
          variant={variant}
          size={size}
          disabled={disabled}
          className="cursor-pointer"
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};
