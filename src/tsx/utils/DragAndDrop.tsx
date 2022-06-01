import { PositionData } from '../state/image/ImageTypes';
import {
    angleBetween,
    Degree,
    dot,
    length,
    lengthSquared,
    mul,
    Position,
    rotate,
    sub,
    toDegree,
    toRadian,
    Vector2,
} from './LinearAlgebra';
import { adjustAngle, calculateTranslation } from './TextTransforms';

export const calculateParentPos = (childDomRect: DOMRect, translation: Vector2, viewPortScale: number) => {
    const elementPos = centerOfDOMRect(childDomRect);
    return sub(elementPos, mul(translation, viewPortScale));
};

const centerOfDOMRect = ({ left, top, width, height }: DOMRect): Position => ({
    x: left + width / 2,
    y: top + height / 2,
});

export const calculateDistance = (mousePos: Position, parentPos: Position, viewPortScale: number): number => {
    const mouseVec = sub(mousePos, parentPos);
    return length(mouseVec) / viewPortScale;
};

export const calculateAngle = (mousePos: Position, parentPos: Position): Degree => {
    const mouseVec = sub(mousePos, parentPos);
    const zeroDegreeVec: Vector2 = { x: 0, y: 1 };
    return toDegree(angleBetween(mouseVec, zeroDegreeVec));
};

export const calculatePositionData = (
    mousePos: Position,
    viewPortScale: number,
    childDomRect: DOMRect,
    childPositionData: PositionData,
    relativeAngle = 0
): PositionData => {
    const translation = calculateTranslation(childPositionData.angle + relativeAngle, childPositionData.distance);
    const parentPos = calculateParentPos(childDomRect, translation, viewPortScale);

    return {
        distance: calculateDistance(mousePos, parentPos, viewPortScale),
        angle: adjustAngle(calculateAngle(mousePos, parentPos) - relativeAngle),
    };
};

export const constrainDistanceOnAngle = (mousePos: Position, constrainedAngle: Degree): number => {
    const constrainedAngleVector = rotate({ x: 0, y: 1 }, -toRadian(constrainedAngle));
    const lambda = dot(mousePos, constrainedAngleVector) / lengthSquared(constrainedAngleVector);

    if (lambda <= 0) {
        return 0;
    } else {
        const intersection = mul(constrainedAngleVector, lambda);
        return length(intersection);
    }
};
