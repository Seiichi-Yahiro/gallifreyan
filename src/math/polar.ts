import mAngle, { type Radian } from '@/math/angle';
import mVec2, { type Vec2 } from '@/math/vec';

export type PolarCoordinate = {
    angle: Radian;
    distance: number;
};

const create = (distance: number, angle: Radian): PolarCoordinate => {
    return {
        distance,
        angle,
    };
};

/**
 * This will rotate counterclockwise starting from the bottom.
 */
const toCartesian = (polar: PolarCoordinate): Vec2 => {
    const phi = polar.angle.value;
    const x = polar.distance * Math.sin(phi);
    const y = -polar.distance * Math.cos(phi);
    return mVec2.create(x, y);
};

/**
 * Angle will be between [0, 2PI). 0 is at the bottom rotating counterclockwise.
 */
const angleFromCartesian = (vec: Vec2): Radian => {
    const phi = Math.atan2(vec.x, -vec.y);
    return mAngle.radian(phi < 0 ? phi + 2 * Math.PI : phi);
};

const distanceFromCartesian = mVec2.length;

/**
 * Angle will be between [0, 2PI). 0 is at the bottom rotating counterclockwise.
 */
const fromCartesian = (vec: Vec2): PolarCoordinate => {
    return {
        angle: angleFromCartesian(vec),
        distance: distanceFromCartesian(vec),
    };
};

const mPolar = {
    create,
    toCartesian,
    angleFromCartesian,
    distanceFromCartesian,
    fromCartesian,
};

export default mPolar;
