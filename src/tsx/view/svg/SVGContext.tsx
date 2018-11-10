import * as React from 'react';

export interface ISVGContext {
    zoomX: number;
    zoomY: number;
}

export const defaultSVGContext: ISVGContext = {
    zoomX: 1,
    zoomY: 1
};

const SVGContext = React.createContext(defaultSVGContext);

export default SVGContext;
