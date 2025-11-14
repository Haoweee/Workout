import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.ComponentProps<'input'> {
  multiline?: false;
}

export interface TextareaProps extends React.ComponentProps<'textarea'> {
  multiline: true;
}

function Input(props: InputProps | TextareaProps) {
  const { multiline = false, className, ...restProps } = props;

  const baseClasses = cn(
    'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
    className
  );

  if (multiline) {
    return (
      <textarea
        data-slot="textarea"
        className={cn(
          baseClasses,
          'min-h-[60px] resize-y' // Default minimum height and allow vertical resize
        )}
        {...(restProps as React.ComponentProps<'textarea'>)}
      />
    );
  }

  return (
    <input
      data-slot="input"
      className={cn(
        baseClasses,
        'h-9' // Standard height for single-line input
      )}
      {...(restProps as React.ComponentProps<'input'>)}
    />
  );
}

export { Input };
