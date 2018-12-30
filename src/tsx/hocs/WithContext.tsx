import * as React from 'react';

const withContext = <C extends object>(Context: React.Context<C>) => <
    P extends object
>(
    Component: React.ComponentType<P & C>
) => {
    const component: React.FunctionComponent<P> = (props: P) => (
        <Context.Consumer>
            {context => <Component {...context} {...props} />}
        </Context.Consumer>
    );

    component.displayName = `With${Context.displayName ||
        'Context'}(${Component.displayName || Component.name || 'Component'})`;

    return component;
};

export default withContext;
