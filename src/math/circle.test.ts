import mCircle, { type Circle, CircleIntersectionType } from '@/math/circle';
import mVec2 from '@/math/vec';
import { describe, expect, it } from 'vitest';

describe('circle', () => {
    it('should return no circle intersection when same position different radius', () => {
        const a: Circle = {
            radius: 10,
            position: mVec2.create(1, 1),
        };

        const b: Circle = {
            radius: 5,
            position: mVec2.create(1, 1),
        };

        const result = mCircle.intersections(a, b);

        expect(result).toStrictEqual({
            type: CircleIntersectionType.None,
        });
    });

    it('should return no infinity intersections when same position same radius', () => {
        const a: Circle = {
            radius: 10,
            position: mVec2.create(1, 1),
        };

        const b: Circle = {
            radius: 10,
            position: mVec2.create(1, 1),
        };

        const result = mCircle.intersections(a, b);

        expect(result).toStrictEqual({
            type: CircleIntersectionType.Infinity,
        });
    });

    it('should return no circle intersections', () => {
        const a: Circle = {
            radius: 10,
            position: mVec2.create(100, 100),
        };

        const b: Circle = {
            radius: 5,
            position: mVec2.create(1, 1),
        };

        const result = mCircle.intersections(a, b);

        expect(result).toStrictEqual({
            type: CircleIntersectionType.None,
        });
    });

    it('should return one circle intersection', () => {
        const a: Circle = {
            radius: 10,
            position: mVec2.create(5, 5),
        };

        const b: Circle = {
            radius: 5,
            position: mVec2.create(-10, 5),
        };

        const result = mCircle.intersections(a, b);

        expect(result).toStrictEqual({
            type: CircleIntersectionType.One,
            intersection: mVec2.create(-5, 5),
        });
    });

    it('should return two circle intersections', () => {
        const a: Circle = {
            radius: 10,
            position: mVec2.create(5, 5),
        };

        const b: Circle = {
            radius: 5,
            position: mVec2.create(-5, 4),
        };

        const result = mCircle.intersections(a, b);

        expect(result).toStrictEqual({
            type: CircleIntersectionType.Two,
            intersections: [
                mVec2.create(-3.2322906495242942, -0.6770935047570674),
                mVec2.create(-4.193451924733133, 8.934519247331325),
            ],
        });
    });
});
