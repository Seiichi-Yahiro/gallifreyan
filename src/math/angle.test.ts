import mAngle from '@/math/angle';
import { describe, expect, it } from 'vitest';

describe('angle', () => {
    it('should convert degrees to radian', () => {
        const result = mAngle.toRadian(mAngle.degree(180));
        expect(result.value).toBe(Math.PI);
    });

    it('should convert radian to degrees', () => {
        const result = mAngle.toDegree(mAngle.radian(Math.PI));
        expect(result.value).toBe(180);
    });

    it('should normalize negative degrees less than 360', () => {
        const result = mAngle.normalize(mAngle.degree(-180));
        expect(result.value).toBe(180);
    });

    it('should normalize negative degrees greater than 360', () => {
        const result = mAngle.normalize(mAngle.degree(-(360 + 180)));
        expect(result.value).toBe(180);
    });

    it('should normalize positive degrees less than 360', () => {
        const result = mAngle.normalize(mAngle.degree(180));
        expect(result.value).toBe(180);
    });

    it('should normalize positive degrees greater than 360', () => {
        const result = mAngle.normalize(mAngle.degree(360 + 180));
        expect(result.value).toBe(180);
    });

    it('should normalize negative radians less than 360', () => {
        const result = mAngle.normalize(mAngle.radian(-Math.PI));
        expect(result.value).toBe(Math.PI);
    });

    it('should normalize negative radians greater than 360', () => {
        const result = mAngle.normalize(
            mAngle.radian(-(2 * Math.PI + Math.PI)),
        );
        expect(result.value).toBe(Math.PI);
    });

    it('should normalize positive radians less than 360', () => {
        const result = mAngle.normalize(mAngle.radian(Math.PI));
        expect(result.value).toBe(Math.PI);
    });

    it('should normalize positive radians greater than 360', () => {
        const result = mAngle.normalize(mAngle.radian(2 * Math.PI + Math.PI));
        expect(result.value).toBe(Math.PI);
    });
});
