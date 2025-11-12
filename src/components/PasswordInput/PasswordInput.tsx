import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import {
  type Control,
  type FieldValues,
  type Path,
  type UseFormClearErrors,
  useController,
} from 'react-hook-form';
import { cn } from 'lib/utils';
import { Button, Input, Label } from 'components/ui';

interface Props<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  clearErrors: UseFormClearErrors<T>;
  errorMsg?: string;
  className?: string;
}

export const PasswordInput = <T extends FieldValues>({
  name,
  label,
  control,
  clearErrors,
  errorMsg,
  className,
}: Props<T>) => {
  const { field, fieldState } = useController({ name, control });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={cn('space-y-1', className)}>
      <Label htmlFor={name}>{label}</Label>
      <div className="relative">
        <Input
          id={name}
          type={showPassword ? 'text' : 'password'}
          {...field}
          onClick={() => clearErrors(name)}
          onChange={(e) => {
            field.onChange(e);
            clearErrors(name);
          }}
          className={cn('pr-10', fieldState.error && 'border-destructive')}
          autoFocus={false}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
      {errorMsg && (
        <p className="text-sm text-destructive">{errorMsg || String(fieldState.error?.message)}</p>
      )}
    </div>
  );
};
