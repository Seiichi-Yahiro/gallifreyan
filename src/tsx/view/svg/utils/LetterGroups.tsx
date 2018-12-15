export const DEEP_CUT = new RegExp('^(?:b|ch|d|g|h|f)$', 'i');
export const INSIDE = new RegExp('^[jklnpm]$', 'i');
export const SHALLOW_CUT = new RegExp('^(?:t|sh|r|v|w|s)$', 'i');
export const ON_LINE = new RegExp('^(?:th|y|z|qu|x|ng)$', 'i');

export const DOUBLE_DOT = new RegExp('^(?:ch|k|sh|y)$', 'i');
export const TRIPLE_DOT = new RegExp('^[dlrz]$', 'i');

export const SINGLE_LINE = new RegExp('^(?:g|n|v|qu)$', 'i');
export const DOUBLE_LINE = new RegExp('^[hpwx]$', 'i');
export const TRIPLE_LINE = new RegExp('^(?:f|m|s|ng)$', 'i');

export const VOCAL = new RegExp('^[aeiou]$', 'i');

export const DOUBLE_LETTER = new RegExp('ch|sh|th|qu|ng', 'i');

export const isDeepCut = (text: string) => DEEP_CUT.test(text);
export const isInside = (text: string) => INSIDE.test(text);
export const isShallowCut = (text: string) => SHALLOW_CUT.test(text);
export const isOnLine = (text: string) => ON_LINE.test(text);

export const isDoubleDot = (text: string) => DOUBLE_DOT.test(text);
export const isTripleDot = (text: string) => TRIPLE_DOT.test(text);

export const isSingleLine = (text: string) => SINGLE_LINE.test(text);
export const isDoubleLine = (text: string) => DOUBLE_LINE.test(text);
export const isTripleLine = (text: string) => TRIPLE_LINE.test(text);

export const isVocal = (text: string) => VOCAL.test(text);

export const letterGroupsCombination = (
    ...fns: Array<(text: string) => boolean>
) => (text: string) => fns.some(fn => fn(text));

export const isFullCircle = letterGroupsCombination(
    isOnLine,
    isInside,
    isVocal
);
