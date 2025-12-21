import cn from '@/utils/cn';
import React from 'react';

const IconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
    children,
    className,
    ...props
}) => {
    return (
        <button
            type="button"
            className={cn(
                'border-border bg-background hover:bg-hover-accent focus-visible:outline-accent inline-flex size-7 cursor-pointer appearance-none items-center justify-center rounded-sm border p-0.5 transition-colors focus-visible:rounded-sm focus-visible:outline-2 focus-visible:-outline-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none',
                className,
            )}
            {...props}
        >
            {children}
        </button>
    );
};

export default IconButton;
