import cn from '@/utils/cn';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import React from 'react';

const Tabs: React.FC<React.ComponentProps<typeof TabsPrimitive.Root>> = ({
    className,
    children,
    ...props
}) => (
    <TabsPrimitive.Root
        className={cn(
            'flex gap-1 data-[orientation=horizontal]:flex-col data-[orientation=vertical]:flex-row',
            className,
        )}
        {...props}
    >
        {children}
    </TabsPrimitive.Root>
);

const TabsList: React.FC<React.ComponentProps<typeof TabsPrimitive.List>> = ({
    ref,
    className,
    children,
    ...props
}) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn(
            'bg-hover-accent text-muted inline-flex items-center gap-1 rounded-sm p-1 data-[orientation=horizontal]:h-10 data-[orientation=horizontal]:flex-row data-[orientation=horizontal]:justify-center data-[orientation=vertical]:min-w-10 data-[orientation=vertical]:flex-col data-[orientation=vertical]:justify-start',
            className,
        )}
        {...props}
    >
        {children}
    </TabsPrimitive.List>
);

const TabsTrigger: React.FC<
    React.ComponentProps<typeof TabsPrimitive.Trigger>
> = ({ ref, className, children, ...props }) => (
    <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
            'data-[state=active]:bg-background data-[state=active]:text-text outline-accent data-[state=inactive]:hover:bg-hover-accent-strong inline-flex cursor-pointer items-center justify-center rounded-sm p-1 text-sm font-medium whitespace-nowrap transition-all focus-visible:outline-2 focus-visible:-outline-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm',
            className,
        )}
        {...props}
    >
        {children}
    </TabsPrimitive.Trigger>
);

const TabsContent: React.FC<
    React.ComponentProps<typeof TabsPrimitive.Content>
> = ({ ref, className, ...props }) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn(
            'focus-visible:outline-accent focus-visible:outline-2',
            className,
        )}
        {...props}
    />
);

export { Tabs, TabsContent, TabsList, TabsTrigger };
