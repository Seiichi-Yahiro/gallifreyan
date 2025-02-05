import { degree } from '@/math/angle';
import { vec2 } from '@/math/vec';
import { describe, expect, it } from 'vitest';

describe('vec', () => {
    it('should add', () => {
        const result = vec2.add(vec2.create(0, 1), vec2.create(1, 2), -4);
        expect(result).toStrictEqual(vec2.create(-3, -1));
    });

    it('should subtract', () => {
        const result = vec2.sub(vec2.create(0, 1), vec2.create(1, 2), -4);
        expect(result).toStrictEqual(vec2.create(3, 3));
    });

    it('should multiply', () => {
        const result = vec2.mul(vec2.create(-1, 1), vec2.create(2, -2), -4, 10);
        expect(result).toStrictEqual(vec2.create(80, 80));
    });

    it('should divide', () => {
        const result = vec2.div(vec2.create(-1, 1), vec2.create(2, -2), -4, 10);
        expect(result).toStrictEqual(vec2.create(0.0125, 0.0125));
    });

    it('should rotate counterclockwise', () => {
        const result = vec2.rotate(vec2.create(0, 1), degree(90));
        expect(result.x).approximately(-1, 0.000001);
        expect(result.y).approximately(0, 0.000001);
    });

    it('should rotate clockwise', () => {
        const result = vec2.rotate(vec2.create(-1, 0), degree(-90));
        expect(result.x).approximately(0, 0.000001);
        expect(result.y).approximately(1, 0.000001);
    });
});
