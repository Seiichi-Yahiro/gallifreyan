import mAngle from '@/math/angle';
import mPolar from '@/math/polar';
import mVec2 from '@/math/vec';
import { describe, expect, it } from 'vitest';

describe('Polar coordinates', () => {
    it('should convert 0 degrees to 0,-1', () => {
        const polar = mPolar.create(1, mAngle.degree(0));
        const cartesian = mPolar.toCartesian(polar);

        expect(cartesian.x).approximately(0, 0.00001);
        expect(cartesian.y).approximately(-1, 0.00001);
    });

    it('should convert 90 degrees to 1,0', () => {
        const polar = mPolar.create(1, mAngle.degree(90));
        const cartesian = mPolar.toCartesian(polar);

        expect(cartesian.x).approximately(1, 0.00001);
        expect(cartesian.y).approximately(0, 0.00001);
    });

    it('should convert 180 degrees to 0,1', () => {
        const polar = mPolar.create(1, mAngle.degree(180));
        const cartesian = mPolar.toCartesian(polar);

        expect(cartesian.x).approximately(0, 0.00001);
        expect(cartesian.y).approximately(1, 0.00001);
    });

    it('should convert 270 degrees to -1,0', () => {
        const polar = mPolar.create(1, mAngle.degree(270));
        const cartesian = mPolar.toCartesian(polar);

        expect(cartesian.x).approximately(-1, 0.00001);
        expect(cartesian.y).approximately(0, 0.00001);
    });

    it('should convert 0,-1 to 0 degrees', () => {
        const cartesian = mVec2.create(0, -1);
        const polar = mPolar.fromCartesian(cartesian);

        expect(polar.distance).approximately(1, 0.00001);
        expect(polar.angle.value).approximately(0, 0.00001);
    });

    it('should convert 1,0 to 90 degrees', () => {
        const cartesian = mVec2.create(1, 0);
        const polar = mPolar.fromCartesian(cartesian);

        expect(polar.distance).approximately(1, 0.00001);
        expect(polar.angle.value).approximately(Math.PI / 2, 0.00001);
    });

    it('should convert 0,1 to 180 degrees', () => {
        const cartesian = mVec2.create(0, 1);
        const polar = mPolar.fromCartesian(cartesian);

        expect(polar.distance).approximately(1, 0.00001);
        expect(polar.angle.value).approximately(Math.PI, 0.00001);
    });

    it('should convert -1,0 to 270 degrees', () => {
        const cartesian = mVec2.create(-1, 0);
        const polar = mPolar.fromCartesian(cartesian);

        expect(polar.distance).approximately(1, 0.00001);
        expect(polar.angle.value).approximately(Math.PI * 1.5, 0.00001);
    });
});
