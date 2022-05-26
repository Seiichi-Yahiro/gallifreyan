import { angleBetween, clamp, clampAngle, rotate, Vector2 } from './LinearAlgebra';

describe('Linear Algebra', () => {
    it('should calculate negative angle between 2 vectors', () => {
        const v1: Vector2 = { x: 0, y: -1 };
        const v2: Vector2 = { x: 1, y: 0 };
        const result = angleBetween(v1, v2);
        expect(result).toBeCloseTo(Math.PI / 2);
    });

    it('should calculate positive angle between 2 vectors', () => {
        const v1: Vector2 = { x: 0, y: -1 };
        const v2: Vector2 = { x: -1, y: 0 };
        const result = angleBetween(v1, v2);
        expect(result).toBeCloseTo(-Math.PI / 2);
    });

    it('should rotate 90° counter clockwise', () => {
        const { x, y } = rotate({ x: 10, y: 0 }, Math.PI / 2);
        expect(x).toBeCloseTo(0);
        expect(y).toBeCloseTo(10);
    });

    it('should rotate 90° clockwise', () => {
        const { x, y } = rotate({ x: 10, y: 0 }, -Math.PI / 2);
        expect(x).toBeCloseTo(0);
        expect(y).toBeCloseTo(-10);
    });

    it('should rotate 180°', () => {
        const { x, y } = rotate({ x: 10, y: 0 }, Math.PI);
        expect(x).toBeCloseTo(-10);
        expect(y).toBeCloseTo(0);
    });

    it('should clamp values bigger than max', () => {
        const result = clamp(180, -90, 90);
        expect(result).toBe(90);
    });

    it('should clamp values smaller than min', () => {
        const result = clamp(-180, -90, 90);
        expect(result).toBe(-90);
    });

    it('should not clamp values in range', () => {
        const result = clamp(0, -90, 90);
        expect(result).toBe(0);
    });

    it('should clamp angles closer to max', () => {
        const result = clampAngle(90, 270, 360);
        expect(result).toBe(360);
    });

    it('should clamp angles closer to min', () => {
        const result = clampAngle(270, 0, 90);
        expect(result).toBe(0);
    });

    it('should not clamp angles in range', () => {
        const result = clampAngle(180, 90, 270);
        expect(result).toBe(180);
    });
});
