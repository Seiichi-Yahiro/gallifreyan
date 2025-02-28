import { formatDecimal } from '@/utils/format';
import { describe, expect, it } from 'vitest';

describe('format', () => {
    it('should not show zeros when integer', () => {
        const result = formatDecimal(42);
        expect(result).toBe('42');
    });

    it('should format with 2 decimals', () => {
        const result = formatDecimal(42.236);
        expect(result).toBe('42.24');
    });
});
