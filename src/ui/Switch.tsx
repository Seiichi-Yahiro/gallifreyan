import cn from '@/utils/cn';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import React from 'react';

const Switch: React.FC<React.ComponentProps<typeof SwitchPrimitives.Root>> = ({
    ref,
    className,
    ...props
}) => (
    <SwitchPrimitives.Root
        className={cn(
            'peer data-[state=checked]:bg-hover-accent-strong data-[state=unchecked]:bg-muted outline-accent inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-2 disabled:cursor-not-allowed disabled:opacity-50',
            className,
        )}
        {...props}
        ref={ref}
    >
        <SwitchPrimitives.Thumb
            className={cn(
                'bg-background pointer-events-none block h-5 w-5 rounded-full shadow-lg transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
            )}
        />
    </SwitchPrimitives.Root>
);

export default Switch;
