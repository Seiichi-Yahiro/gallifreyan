export const zipLongest = <T, U>(
    arr1: T[],
    arr2: U[],
): [T | undefined, U | undefined][] => {
    const length = Math.max(arr1.length, arr2.length);
    return Array.from({ length }, (_, i) => [arr1.at(i), arr2.at(i)]);
};
