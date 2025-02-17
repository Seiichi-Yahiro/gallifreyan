import cn from '@/utils/cn';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import React from 'react';

const Checkbox: React.FC<
    React.ComponentProps<typeof CheckboxPrimitive.Root>
> = ({ ref, className, ...props }) => (
    <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
            'peer border-border data-[state=checked]:bg-hover-accent-strong data-[state=checked]:text-text outline-accent h-4 w-4 shrink-0 rounded-sm border focus-visible:outline-2 disabled:cursor-not-allowed disabled:opacity-50',
            className,
        )}
        {...props}
    >
        <CheckboxPrimitive.Indicator
            className={cn('flex items-center justify-center text-current')}
        >
            <Check className="h-4 w-4" />
        </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
);

export { Checkbox };
