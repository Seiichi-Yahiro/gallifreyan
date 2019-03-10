import { ILetter, IWord } from '../types/SVG';
import * as _ from 'lodash';
import { isFullCircle } from './LetterGroups';
import Point from './Point';

/**
 * Calculate the points where a circle "a" in the center of the system intersects with a circle "b"
 *
 * @param ra - radius of circle a
 * @param rb - radius of circle b
 * @param posB - the position of circle b
 */
const calculateCircleIntersectionPoints = (ra: number, rb: number, posB: Point): Point[] => {
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

const calculateCircleIntersectionAngle = (point: Point, r: number): number => {
    const zeroAngleVector = new Point(r, 0);

    let angle = Math.acos(point.dot(zeroAngleVector) / (point.length() * zeroAngleVector.length()));

    if (point.cross(zeroAngleVector) > 0) {
        angle = Math.PI * 2 - angle;
    }

    return angle;
};

export const calculateAngles = (word: IWord): IWord => {
    const wordRadius = word.r;
    const wordAngles = _.chain(word.children)
        .filter(({ text }) => !isFullCircle(text))
        .flatMap(({ x, y, r }) => {
            const letterPosition = new Point(x, y);

            const angles = calculateCircleIntersectionPoints(wordRadius, r, letterPosition)
                .map(point => calculateCircleIntersectionAngle(point, wordRadius))
                .sort();

            // if letter circle is not on top the word 0° point
            if (new Point(wordRadius, 0).subtract(letterPosition).length() > r) {
                return angles.reverse();
            }

            return angles;
        })
        .value();

    const children = word.children.map(letter => {
        const { x, y, r } = letter;
        const letterPosition = new Point(x, y);
        let angles = calculateCircleIntersectionPoints(wordRadius, r, letterPosition)
            .map(point => point.subtract(letterPosition))
            .map(point => calculateCircleIntersectionAngle(point, r))
            .sort();

        // if letter 0° point is not inside word circle
        if (letterPosition.add(new Point(r, 0)).length() > wordRadius) {
            angles = angles.reverse();
        }

        return {
            ...letter,
            angles
        } as ILetter;
    });

    return {
        ...word,
        children,
        angles: wordAngles
    };
};
