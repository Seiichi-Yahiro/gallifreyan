import React from 'react';

interface SVGCircleProps {
    r: number;
    filled: boolean;
}

export const SVGCircle: React.FunctionComponent<SVGCircleProps> = ({ r, filled }) => (
    <circle cx={0} cy={0} r={r} stroke="#000000" fill={filled ? '#000000' : 'transparent'} />
);

interface SVGMaskedCircleProps {
    r: number;
    maskId: string;
}

export const SVGMaskedCircle: React.FunctionComponent<SVGMaskedCircleProps> = ({ r, maskId }) => (
    <circle cx={0} cy={0} r={r} stroke="#000000" fill="#000000" mask={`url(#${maskId})`} />
);

interface SVGCuttingCircleProps {
    r: number;
}

export const SVGCuttingCircle: React.FunctionComponent<SVGCuttingCircleProps> = ({ r }) => (
    <circle cx={0} cy={0} r={r} stroke="none" fill="transparent" />
);
