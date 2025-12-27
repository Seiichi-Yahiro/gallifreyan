import mAngle from '@/math/angle';
import { type Circle } from '@/math/circle';
import mPolar from '@/math/polar';
import mVec2 from '@/math/vec';
import { antiArcsToArcs, intersectionsToArc } from '@/redux/svg/intersections';
import type { Arc } from '@/redux/svg/svgTypes';
import { describe, expect, it } from 'vitest';

describe('svgUtils', () => {
    it('should not swap intersections when angle origin is not in intersection', () => {
        const c1: Circle = {
            radius: 10,
            position: {
                x: 0,
                y: 0,
            },
        };

        const c2: Circle = {
            radius: 5,
            position: {
                x: c1.radius,
                y: 0,
            },
        };

        const posA = mVec2.create(8.75, -4.8412285); // below, smaller angle
        const posB = mVec2.create(8.75, 4.8412285); // above, bigger angle

        const angleA = mPolar.angleFromCartesian(posA);
        const angleB = mPolar.angleFromCartesian(posB);

        const result = intersectionsToArc(c1, c2, [posA, posB]);

        expect(result).toStrictEqual({
            start: angleA,
            end: angleB,
        } satisfies Arc);
    });

    it('should swap intersections when angle origin is not in intersection', () => {
        const c1: Circle = {
            radius: 10,
            position: {
                x: 0,
                y: 0,
            },
        };

        const c2: Circle = {
            radius: 5,
            position: {
                x: c1.radius,
                y: 0,
            },
        };

        const posA = mVec2.create(8.75, 4.8412285); // above, bigger angle
        const posB = mVec2.create(8.75, -4.8412285); // below, smaller angle

        const angleA = mPolar.angleFromCartesian(posA);
        const angleB = mPolar.angleFromCartesian(posB);

        const result = intersectionsToArc(c1, c2, [posA, posB]);

        expect(result).toStrictEqual({
            start: angleB,
            end: angleA,
        } satisfies Arc);
    });

    it('should not swap intersections when angle origin is in intersection', () => {
        const c1: Circle = {
            radius: 10,
            position: {
                x: 0,
                y: 0,
            },
        };

        const c2: Circle = {
            radius: 5,
            position: {
                x: 0,
                y: -c1.radius,
            },
        };

        const posA = mVec2.create(-4.8412285, -8.75); // left of angle origin, bigger angle
        const posB = mVec2.create(4.8412285, -8.75); // right of angle origin, smaller angle

        const angleA = mPolar.angleFromCartesian(posA);
        const angleB = mPolar.angleFromCartesian(posB);

        const result = intersectionsToArc(c1, c2, [posA, posB]);

        expect(result).toStrictEqual({
            start: angleA,
            end: angleB,
        } satisfies Arc);
    });

    it('should swap intersections when angle origin is in intersection', () => {
        const c1: Circle = {
            radius: 10,
            position: {
                x: 0,
                y: 0,
            },
        };

        const c2: Circle = {
            radius: 5,
            position: {
                x: 0,
                y: -c1.radius,
            },
        };

        const posA = mVec2.create(4.8412285, -8.75); // right of angle origin, smaller angle
        const posB = mVec2.create(-4.8412285, -8.75); // left of angle origin, bigger angle

        const angleA = mPolar.angleFromCartesian(posA);
        const angleB = mPolar.angleFromCartesian(posB);

        const result = intersectionsToArc(c1, c2, [posA, posB]);

        expect(result).toStrictEqual({
            start: angleB,
            end: angleA,
        } satisfies Arc);
    });

    it('should create word arcs from intersections', () => {
        // 6 points sorted by sortIntersectionsByAngle
        const result = antiArcsToArcs([
            {
                start: mAngle.radian(Math.PI * 1.9),
                end: mAngle.radian(Math.PI * 0.1),
            },
            {
                start: mAngle.radian(Math.PI * 0.5),
                end: mAngle.radian(Math.PI),
            },
            {
                start: mAngle.radian(Math.PI * 1.5),
                end: mAngle.radian(Math.PI * 1.6),
            },
        ]);

        expect(result).toStrictEqual([
            {
                start: mAngle.radian(Math.PI * 0.1),
                end: mAngle.radian(Math.PI * 0.5),
            },
            {
                start: mAngle.radian(Math.PI),
                end: mAngle.radian(Math.PI * 1.5),
            },
            {
                start: mAngle.radian(Math.PI * 1.6),
                end: mAngle.radian(Math.PI * 1.9),
            },
        ]);
    });
});
