import cn from '@/utils/cn';
import { debounce } from 'lodash';
import { ChevronRight, Dot } from 'lucide-react';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

interface TreeProps {
    children: React.ReactNode;
    className?: string;
}

export const Tree: React.FC<TreeProps> = ({ children, className }) => {
    return (
        <div className={cn('flex flex-col gap-1 p-1', className)}>
            {children}
        </div>
    );
};

interface TreeItemProps {
    title: string;
    children?: React.ReactNode;
}

export const TreeItem: React.FC<TreeItemProps> = ({ title, children }) => {
    const [open, setOpen] = useState(true);
    const toggleOpen = useCallback(() => setOpen((prev) => !prev), [setOpen]);

    return (
        <div className="relative">
            <div className="absolute flex h-full flex-col gap-1">
                <TreeItemTrigger
                    open={open}
                    toggleOpen={toggleOpen}
                    hasChildren={!!children}
                />
                {children && (
                    <div className="border-muted ml-[0.5px] w-3 grow border-r" />
                )}
            </div>
            <div className="flex grow flex-col">
                <TreeItemTitle title={title} />
                {children && (
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
    return (
        <div className="w-6 select-none">
            {hasChildren ? (
                <ChevronRight
                    className={cn('cursor-pointer transition-all', {
                        'rotate-90': open,
                    })}
                    onClick={toggleOpen}
                />
            ) : (
                <Dot />
            )}
        </div>
    );
};

interface TreeItemTitleProps {
    title: string;
}

const TreeItemTitle: React.FC<TreeItemTitleProps> = ({ title }) => {
    return (
        <div className="border-muted hover:bg-accent/10 ml-6 rounded-sm border px-1">
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
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const prevOpen = useRef(open);

    useEffect(() => {
        if (prevOpen.current !== open) {
            setShouldAnimate(true);
            prevOpen.current = open;
        }
    }, [open]);

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
            className={cn('overflow-hidden pl-6', {
                'animate-tree-item-open': shouldAnimate && open,
                'animate-tree-item-close': shouldAnimate && !open,
                'h-0': !open,
            })}
        >
            <div ref={observeHeight} className="mt-1 flex flex-col gap-1">
                {React.Children.map(children, (child, index) => (
                    <div key={index} className="relative">
                        <div className="border-muted absolute top-0 -left-3 mt-[0.5px] h-3 w-3 border-b" />
                        {child}
                    </div>
                ))}
            </div>
        </div>
    );
};
