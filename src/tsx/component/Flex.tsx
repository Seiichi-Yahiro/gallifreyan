import * as React from 'react';
import { createClassName } from './ComponentUtils';

interface IListProps {
    items?: any[];
    generateKey?: (item: any, index?: number) => string;
    renderItem?: (item: any, index?: number) => string | JSX.Element;
    isHorizontal?: boolean;
    className?: string;
    childClassName?: string;
    spaceBetween?: boolean;
    verticalCenter?: boolean;
}

const Flex: React.FunctionComponent<IListProps> = ({
    items = [],
    generateKey = (item: any, index: number) => index.toString(),
    renderItem = (item: any, index: number) => item,
    isHorizontal = false,
    className = '',
    childClassName = '',
    spaceBetween = false,
    verticalCenter = false,
    children
}) => {
    const orientation = isHorizontal ? 'horizontal' : 'vertical';
    const wrapperClassNames = createClassName(
        'flex',
        'flex--' + orientation,
        {
            'flex--space-between': spaceBetween,
            'flex--vertical-center': verticalCenter
        },
        className
    );

    const childClassNames = createClassName(
        'flex__item',
        'flex__item--' + orientation,
        childClassName
    );

    return (
        <div className={wrapperClassNames}>
            {items.map((item: any, index: number) => (
                <div key={generateKey(item, index)} className={childClassNames}>
                    {renderItem(item, index)}
                </div>
            ))}

            {React.Children.map(children, (child: any, index: number) =>
                React.cloneElement(child, {
                    key: generateKey(child, index),
                    className: `${childClassNames} ${
                        child.props ? child.props.className : ''
                    }`
                })
            )}
        </div>
    );
};

export default Flex;
