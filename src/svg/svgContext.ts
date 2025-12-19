import { createContext } from 'react';

export type SvgContextType = {
    calculateInverseSvgMatrix: () => void;
    getInverseSvgMatrix: () => DOMMatrix | null;
};

const SvgContext = createContext<SvgContextType>({
    calculateInverseSvgMatrix: () => {},
    getInverseSvgMatrix: () => null,
});

export default SvgContext;
