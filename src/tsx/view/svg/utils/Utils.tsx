import Point from './Point';
import { ISVGBaseItem } from '../../../types/SVG';

/**
 * Get svg path of a partial circle
 * 0 Radians is on the right
 * Drawn clockwise
 *
 * @param {number} cx - circle x position
 * @param {number} cy - circle y position
 * @param {number} r - circle radius
 * @param {number} start - start angle in radians
 * @param {number} end - end angle in radians
 * @returns {string} svg path
 */
export const partialCircle = (
    cx: number,
    cy: number,
    r: number,
    start: number,
    end: number
): string => {
    const length = end - start;

    if (length === 0) {
        return '';
    }

    const fromX = r * Math.cos(start) + cx;
    const fromY = r * Math.sin(start) + cy;
    const toX = r * Math.cos(end) + cx;
    const toY = r * Math.sin(end) + cy;
    const large = Math.abs(length) <= Math.PI ? '0' : '1';
    const sweep = length < 0 ? '0' : '1';

    return `M ${fromX} ${fromY} A ${r} ${r} 0 ${large} ${sweep} ${toX} ${toY}`;
};

/**
 * Calculate the points where a circle "a" in the center of the system intersects with a circle "b"
 *
 * @param ra - radius of circle a
 * @param rb - radius of circle b
 * @param posB - the position of circle b
 */
export const calculateCircleIntersectionPoints = (
    ra: number,
    rb: number,
    posB: Point
): Point[] => {
    const distance = posB.length();
    if (distance === 0) {
        return [];
    }

    const { pow } = Math;
    const raSq = pow(ra, 2);
    const x = (raSq + pow(distance, 2) - pow(rb, 2)) / (2.0 * distance);

    const determinant = raSq - pow(x, 2);
    if (determinant <= 0) {
        return [];
    }

    const y = Math.sqrt(determinant);

    const xUnitVector = posB.unit();
    const yUnitVector = xUnitVector.rotate(Math.PI / 2.0);
    const xMoveVector = xUnitVector.multiply(x);
    const yMoveVector = yUnitVector.multiply(y);

    const q1 = xMoveVector.add(yMoveVector);
    const q2 = xMoveVector.subtract(yMoveVector);

    return [q1, q2];
};

export const calculateCircleIntersectionAngle = (
    point: Point,
    r: number
): number => {
    const zeroAngleVector = new Point(r, 0);

    let angle = Math.acos(
        point.dot(zeroAngleVector) / (point.length() * zeroAngleVector.length())
    );

    if (point.cross(zeroAngleVector) > 0) {
        angle = Math.PI * 2 - angle;
    }

    return angle;
};

export const getPath = (svgBaseItem: ISVGBaseItem): string[] =>
    svgBaseItem.parent === undefined
        ? [svgBaseItem.id]
        : getPath(svgBaseItem.parent).concat(svgBaseItem.id);

export const getSVGItem = (
    path: string[],
    children: ISVGBaseItem[]
): ISVGBaseItem => {
    if (path.length === 0) {
        throw new Error('Path cannot be empty!');
    } else if (path.length === 1) {
        return children.find(child => child.id === path[0])!;
    } else {
        const svgItem: ISVGBaseItem = children.find(
            child => child.id === path[0]
        )!;
        if (!svgItem.children) {
            throw new Error(`Path length is ${path.length - 1} too long!`);
        }
        return getSVGItem(path.slice(1), svgItem.children);
    }
};

export const updateSVGItem = (
    path: string[],
    newSvgItem: ISVGBaseItem,
    children: ISVGBaseItem[]
): ISVGBaseItem[] => {
    if (path.length === 0) {
        return children;
    } else if (path.length === 1) {
        return children.map(child =>
            child.id === path[0] ? newSvgItem : child
        );
    } else {
        return children.map(child => {
            if (child.id === path[0]) {
                if (!child.children) {
                    throw new Error(
                        `Path length is ${path.length - 1} too long!`
                    );
                }

                return {
                    ...child,
                    children: updateSVGItem(
                        path.slice(1),
                        newSvgItem,
                        child.children
                    )
                };
            }

            return child;
        });
    }
};

export const removeSVGItem = (
    path: string[],
    children: ISVGBaseItem[]
): ISVGBaseItem[] => {
    if (path.length === 0) {
        return children;
    } else if (path.length === 1) {
        return children.filter(child => child.id !== path[0]);
    } else {
        return children.map(child => {
            if (child.id === path[0]) {
                if (!child.children) {
                    throw new Error(
                        `Path length is ${path.length - 1} too long!`
                    );
                }

                return {
                    ...child,
                    children: removeSVGItem(path.slice(1), child.children)
                };
            }

            return child;
        });
    }
};
