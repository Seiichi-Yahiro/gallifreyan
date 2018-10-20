import * as React from 'react';
import {classNames} from './ComponentUtils';

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

const Flex: React.SFC<IListProps> = ({
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
    const wrapperClassNames = classNames([
        'flex',
        'flex--' + orientation,
        spaceBetween ? 'flex--space-between' : '',
        verticalCenter ? 'flex--vertical-center' : '',
        className
    ]);

    const childClassNames = classNames([
        'flex__item',
        'flex__item--' + orientation,
        childClassName
    ]);

    return (
        <div className={wrapperClassNames}>
            {items.map((item: any, index: number) => (
                <div key={generateKey(item, index)}
                     className={childClassNames}>{renderItem(item, index)}</div>))}

            {React.Children.map(children, (child: any, index: number) =>
                React.cloneElement(child, {
                    key: generateKey(child, index),
                    className: `${childClassNames} ${child.props ? child.props.className : ''}`
                })
            )}
        </div>
    );
};

export default Flex;