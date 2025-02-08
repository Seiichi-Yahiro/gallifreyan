import mAngle from '@/math/angle';
import { type Circle } from '@/math/circle';
import mVec2 from '@/math/vec';
import {
    angleFromVec,
    circleTransform,
    sortIntersectionsByAngle,
    wordArcsFromIntersections,
} from '@/redux/svg/svgUtils';
import { describe, expect, it } from 'vitest';

describe('svgUtils', () => {
    it('should create transform for bottom', () => {
        const result = circleTransform({
            distance: 10,
            angle: mAngle.degree(0),
        });

        expect.soft(result.x).approximately(0, 0.00001);
        expect.soft(result.y).approximately(-10, 0.00001);
    });

    it('should create transform for right', () => {
        const result = circleTransform({
            distance: 10,
            angle: mAngle.degree(90),
        });

        expect.soft(result.x).approximately(10, 0.00001);
        expect.soft(result.y).approximately(0, 0.00001);
    });

    it('should create transform for top', () => {
        const result = circleTransform({
            distance: 10,
            angle: mAngle.degree(180),
        });

        expect.soft(result.x).approximately(0, 0.00001);
        expect.soft(result.y).approximately(10, 0.00001);
    });

    it('should create transform for left', () => {
        const result = circleTransform({
            distance: 10,
            angle: mAngle.degree(-90),
        });

        expect.soft(result.x).approximately(-10, 0.00001);
        expect.soft(result.y).approximately(0, 0.00001);
    });

    it('should create angle for bottom', () => {
        const result = angleFromVec(mVec2.create(0, -10));
        expect(result.value).approximately(0, 0.00001);
    });

    it('should create angle for right', () => {
        const result = angleFromVec(mVec2.create(10, 0));
        expect(result.value).approximately(Math.PI / 2, 0.00001);
    });

    it('should create angle for top', () => {
        const result = angleFromVec(mVec2.create(0, 10));
        expect(result.value).approximately(Math.PI, 0.00001);
    });

    it('should create angle for left', () => {
        const result = angleFromVec(mVec2.create(-10, 0));
        expect(result.value).approximately(Math.PI + Math.PI / 2, 0.00001);
    });

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

        const a = mVec2.create(8.75, 4.8412285); // above, bigger angle
        const b = mVec2.create(8.75, -4.8412285); // below, smaller angle

        const result = sortIntersectionsByAngle(c1, c2, [a, b]);

        expect(result).toStrictEqual([a, b]);
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

        const a = mVec2.create(8.75, -4.8412285); // below, smaller angle
        const b = mVec2.create(8.75, 4.8412285); // above, bigger angle

        const result = sortIntersectionsByAngle(c1, c2, [a, b]);

        expect(result).toStrictEqual([b, a]);
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

        const a = mVec2.create(4.8412285, -8.75); // right of angle origin, smaller angle
        const b = mVec2.create(-4.8412285, -8.75); // left of angle origin, bigger angle

        const result = sortIntersectionsByAngle(c1, c2, [a, b]);

        expect(result).toStrictEqual([a, b]);
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

        const a = mVec2.create(-4.8412285, -8.75); // left of angle origin, bigger angle
        const b = mVec2.create(4.8412285, -8.75); // right of angle origin, smaller angle

        const result = sortIntersectionsByAngle(c1, c2, [a, b]);

        expect(result).toStrictEqual([b, a]);
    });

    it('should create word arcs from intersections', () => {
        // 6 points sorted by sortIntersectionsByAngle
        const result = wordArcsFromIntersections([
            [mVec2.create(1, 1), mVec2.create(6, 6)], // at angle origin
            [mVec2.create(3, 3), mVec2.create(2, 2)],
            [mVec2.create(5, 5), mVec2.create(4, 4)],
        ]);

        expect(result).toStrictEqual([
            [mVec2.create(1, 1), mVec2.create(2, 2)],
            [mVec2.create(3, 3), mVec2.create(4, 4)],
            [mVec2.create(5, 5), mVec2.create(6, 6)],
        ]);
    });
});
