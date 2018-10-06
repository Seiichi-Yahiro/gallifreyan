import * as React from 'react';

interface IListProps {
    readonly items?: any[];
    readonly generateKey?: (item: any, index?: number) => string;
    readonly isHorizontal?: boolean;
    readonly className?: string;
    readonly childClassName?: string;
}

const List: React.SFC<IListProps> = ({
                                         items = [],
                                         generateKey = (item: any, index: number) => index.toString(),
                                         isHorizontal = false,
                                         className = '',
                                         childClassName = '',
                                         children
                                     }) => {
    const orientation = isHorizontal ? 'horizontal' : 'vertical';

    return (
        <div className={`list list--${orientation} ${className}`}>
            {items.map((item: any, index: number) => (
                <div key={generateKey(item, index)} className={`list__item list__item--${orientation} ${childClassName}`}>{item}</div>))}

            {React.Children.map(children, (child: any, index: number) =>
                React.cloneElement(child, {
                    key: generateKey(child, index),
                    className: `list__item list__item--${orientation} ${child.props.className} ${childClassName}`
                })
            )}
        </div>
    );
};

export default List;