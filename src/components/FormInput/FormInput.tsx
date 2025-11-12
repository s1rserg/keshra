import { Input, Label } from 'components/ui';
import { cn } from 'lib/utils';
import {
  type Control,
  type FieldValues,
  type Path,
  type UseFormClearErrors,
  useController,
} from 'react-hook-form';

interface Props<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  autoComplete?: string;
  control: Control<T>;
  clearErrors: UseFormClearErrors<T>;
  placeholder?: string;
  errorMsg?: string;
  className?: string;
}

export const FormInput = <T extends FieldValues>({
  name,
  label,
  control,
  clearErrors,
  placeholder,
  errorMsg,
  className,
  autoComplete,
}: Props<T>) => {
  const { field, fieldState } = useController({ name, control });

  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
        </Label>
      )}
      <Input
        id={name}
        {...field}
        placeholder={placeholder}
        value={field.value || ''}
        onClick={() => clearErrors(name)}
        onChange={(e) => {
          field.onChange(e);
          clearErrors(name);
        }}
        className={cn(fieldState.error && 'border-destructive')}
        autoComplete={autoComplete}
      />
      {errorMsg && (
        <p className="text-sm text-destructive">{errorMsg || String(fieldState.error?.message)}</p>
      )}
    </div>
  );
};
