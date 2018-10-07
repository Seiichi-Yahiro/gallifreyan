import * as React from 'react';

interface IListProps {
    readonly items?: any[];
    readonly generateKey?: (item: any, index?: number) => string;
    readonly renderItem?: (item: any, index?: number) => string | JSX.Element;
    readonly isHorizontal?: boolean;
    readonly className?: string;
    readonly childClassName?: string;
}

const Flex: React.SFC<IListProps> = ({
                                         items = [],
                                         generateKey = (item: any, index: number) => index.toString(),
                                         renderItem = (item: any, index: number) => item,
                                         isHorizontal = false,
                                         className = '',
                                         childClassName = '',
                                         children
                                     }) => {
    const orientation = isHorizontal ? 'horizontal' : 'vertical';

    return (
        <div className={`flex flex--${orientation} ${className}`}>
            {items.map((item: any, index: number) => (
                <div key={generateKey(item, index)}
                     className={`flex__item flex__item--${orientation} ${childClassName}`}>{renderItem(item, index)}</div>))}

            {React.Children.map(children, (child: any, index: number) =>
                React.cloneElement(child, {
                    key: generateKey(child, index),
                    className: `flex__item flex__item--${orientation} ${child.props.className} ${childClassName}`
                })
            )}
        </div>
    );
};

export default Flex;