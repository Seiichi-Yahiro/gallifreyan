import { angleBetween, rotate, Vector2 } from './LinearAlgebra';

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
});
