import * as React from 'react';

interface IConditionalWrapperProps {
    condition: boolean;
    wrapper: (children: React.ReactNode) => React.ReactNode;
}

const ConditionalWrapper: React.FunctionComponent<IConditionalWrapperProps> = ({ condition, wrapper, children }) => (
    <>{condition ? wrapper(children) : children}</>
);

export default ConditionalWrapper;
