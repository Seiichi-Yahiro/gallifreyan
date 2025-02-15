export const formatDecimal = (value: number): string =>
    value.toFixed(2).replace(/.00$/, '');
