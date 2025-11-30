import cn from '@/utils/cn';
import { debounce } from 'es-toolkit';
import { ChevronRight, Dot } from 'lucide-react';
import React, {
    type KeyboardEvent,
    useCallback,
    useMemo,
    useState,
} from 'react';

interface TreeProps {
    children: React.ReactNode;
    className?: string;
}

export const Tree: React.FC<TreeProps> = ({ children, className }) => {
    return (
        <div className={cn('flex flex-col gap-1', className)}>{children}</div>
    );
};

interface TreeItemProps extends React.HTMLProps<HTMLDivElement> {
    title: string;
    defaultOpen?: boolean;
    children?: React.ReactNode;
}

export const TreeItem: React.FC<TreeItemProps> = ({
    title,
    defaultOpen = false,
    children,
    className,
    ...props
}) => {
    const [open, setOpen] = useState(defaultOpen);
    const toggleOpen = useCallback(() => setOpen((prev) => !prev), [setOpen]);

    const hasChildren = React.Children.count(children) > 0;

    return (
        <div className="relative">
            <div className="absolute flex h-full flex-col gap-1">
                <TreeItemTrigger
                    open={open}
                    toggleOpen={toggleOpen}
                    hasChildren={hasChildren}
                />
                {hasChildren && (
                    <div className="border-border ml-[0.5px] w-3 grow border-r" />
                )}
            </div>
            <div className="flex grow flex-col">
                <TreeItemTitle title={title} className={className} {...props} />
                {hasChildren && (
                    <TreeItemContent open={open}>{children}</TreeItemContent>
                )}
            </div>
        </div>
    );
};

interface TreeItemTriggerProps {
    hasChildren: boolean;
    open: boolean;
    toggleOpen: () => void;
}

const TreeItemTrigger: React.FC<TreeItemTriggerProps> = ({
    hasChildren,
    open,
    toggleOpen,
}) => {
    const onKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>) => {
            if (event.key === 'Enter' || event.key === ' ') {
                toggleOpen();
            }
        },
        [toggleOpen],
    );

    return (
        <div className="w-6 select-none">
            {hasChildren ? (
                <div
                    className="outline-accent cursor-pointer focus-visible:rounded-sm focus-visible:outline-2 focus-visible:-outline-offset-2"
                    tabIndex={0}
                    onClick={toggleOpen}
                    onKeyDown={onKeyDown}
                >
                    <ChevronRight
                        className={cn('transition-[rotate]', {
                            'rotate-90': open,
                        })}
                    />
                </div>
            ) : (
                <div>
                    <Dot />
                </div>
            )}
        </div>
    );
};

interface TreeItemTitleProps extends React.HTMLProps<HTMLDivElement> {
    title: string;
    className?: string;
}

const TreeItemTitle: React.FC<TreeItemTitleProps> = ({
    title,
    className,
    ...props
}) => {
    return (
        <div
            className={cn(
                'border-border hover:bg-hover-accent outline-accent ml-7 rounded-sm border px-1 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2',
                className,
            )}
            tabIndex={0}
            {...props}
        >
            {title}
        </div>
    );
};

interface TreeItemContentProps {
    open: boolean;
    children: React.ReactNode;
}

const TreeItemContent: React.FC<TreeItemContentProps> = ({
    open,
    children,
}) => {
    const [height, setHeight] = useState(0);

    const style = useMemo(() => {
        return {
            '--tree-item-content-height': `${height}px`,
        } as React.CSSProperties;
    }, [height]);

    const observeHeight = useCallback((div: HTMLDivElement | null) => {
        if (!div) {
            return;
        }

        const observer = new ResizeObserver(
            debounce(() => {
                setHeight(div.offsetHeight);
            }, 250),
        );

        observer.observe(div);

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div
            style={style}
            className={cn('overflow-hidden pl-7', {
                'animate-tree-item-open': open,
                'animate-tree-item-close invisible h-0': !open,
            })}
        >
            <div ref={observeHeight} className="mt-1 flex flex-col gap-1">
                {React.Children.map(children, (child, index) => (
                    <div key={index} className="relative">
                        <div className="border-border absolute top-0 -left-3 mt-[0.5px] h-3 w-3 border-b" />
                        {child}
                    </div>
                ))}
            </div>
        </div>
    );
};
