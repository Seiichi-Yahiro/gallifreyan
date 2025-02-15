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

    it('should clamp degree angles closer to max', () => {
        const result = mAngle.clamp(mAngle.degree(90), 270, 360);
        expect(result.value).toBe(360);
    });

    it('should clamp radian angles closer to max', () => {
        const result = mAngle.clamp(
            mAngle.radian(Math.PI / 2),
            Math.PI + Math.PI / 2,
            Math.PI * 2,
        );
        expect(result.value).toBe(Math.PI * 2);
    });

    it('should clamp degree angles closer to min', () => {
        const result = mAngle.clamp(mAngle.degree(270), 0, 90);
        expect(result.value).toBe(0);
    });

    it('should clamp radian angles closer to min', () => {
        const result = mAngle.clamp(
            mAngle.radian(Math.PI + Math.PI / 2),
            0,
            Math.PI / 2,
        );
        expect(result.value).toBe(0);
    });

    it('should clamp degree angles in range', () => {
        const result = mAngle.clamp(mAngle.degree(180), 90, 270);
        expect(result.value).toBe(180);
    });

    it('should clamp radian angles in range', () => {
        const result = mAngle.clamp(
            mAngle.radian(Math.PI),
            Math.PI / 2,
            Math.PI + Math.PI / 2,
        );
        expect(result.value).toBe(Math.PI);
    });

    it('should clamp angles closer to min when min is greater than max', () => {
        const result = mAngle.clamp(mAngle.degree(260), 270, 90);
        expect(result.value).toBe(270);
    });

    it('should clamp angles closer to max when min is greater than max', () => {
        const result = mAngle.clamp(mAngle.degree(100), 270, 90);
        expect(result.value).toBe(90);
    });

    it('should not clamp angles in range to max when min is greater than max', () => {
        const result = mAngle.clamp(mAngle.degree(10), 270, 90);
        expect(result.value).toBe(10);
    });

    it('should not clamp angles in range to min when min is greater than max', () => {
        const result = mAngle.clamp(mAngle.degree(350), 270, 90);
        expect(result.value).toBe(350);
    });
});
