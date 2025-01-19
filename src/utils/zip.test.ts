import { zipLongest } from '@/utils/zip';
import { describe, expect, it } from 'vitest';

describe('zip', () => {
    it('should zip second with undefined if first is longer', () => {
        const result = zipLongest([1, 2, 3], [11]);
        expect(result).toStrictEqual([
            [1, 11],
            [2, undefined],
            [3, undefined],
        ]);
    });

    it('should zip first with undefined if second is longer', () => {
        const result = zipLongest([11], [1, 2, 3]);
        expect(result).toStrictEqual([
            [11, 1],
            [undefined, 2],
            [undefined, 3],
        ]);
    });

    it('should zip without undefined if both are same length', () => {
        const result = zipLongest([1, 2, 3], [11, 22, 33]);
        expect(result).toStrictEqual([
            [1, 11],
            [2, 22],
            [3, 33],
        ]);
    });
});
