import mAngle from '@/math/angle';
import mVec2 from '@/math/vec';
import { describe, expect, it } from 'vitest';

describe('vec', () => {
    it('should add', () => {
        const result = mVec2.add(mVec2.create(0, 1), mVec2.create(1, 2), -4);
        expect(result).toStrictEqual(mVec2.create(-3, -1));
    });

    it('should subtract', () => {
        const result = mVec2.sub(mVec2.create(0, 1), mVec2.create(1, 2), -4);
        expect(result).toStrictEqual(mVec2.create(3, 3));
    });

    it('should multiply', () => {
        const result = mVec2.mul(
            mVec2.create(-1, 1),
            mVec2.create(2, -2),
            -4,
            10,
        );
        expect(result).toStrictEqual(mVec2.create(80, 80));
    });

    it('should divide', () => {
        const result = mVec2.div(
            mVec2.create(-1, 1),
            mVec2.create(2, -2),
            -4,
            10,
        );
        expect(result).toStrictEqual(mVec2.create(0.0125, 0.0125));
    });

    it('should rotate counterclockwise', () => {
        const result = mVec2.rotate(mVec2.create(0, 1), mAngle.degree(90));
        expect(result.x).approximately(-1, 0.000001);
        expect(result.y).approximately(0, 0.000001);
    });

    it('should rotate clockwise', () => {
        const result = mVec2.rotate(mVec2.create(-1, 0), mAngle.degree(-90));
        expect(result.x).approximately(0, 0.000001);
        expect(result.y).approximately(1, 0.000001);
    });
});
