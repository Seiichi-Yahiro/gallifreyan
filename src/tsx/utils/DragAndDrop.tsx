import { PositionData } from '../state/image/ImageTypes';
import {
    add,
    angleBetween,
    Degree,
    div,
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

export const centerOfDOMRect = ({ left, top, width, height }: DOMRect): Position => ({
    x: left + width / 2,
    y: top + height / 2,
});

export const calculateDistance = (newPosition: Position, parentPos: Position): number => {
    const vec = sub(newPosition, parentPos);
    return length(vec);
};

export const calculateAngle = (newPosition: Position, parentPos: Position): Degree => {
    const vec = sub(newPosition, parentPos);
    const zeroDegreeVec: Vector2 = { x: 0, y: 1 };
    return toDegree(angleBetween(vec, zeroDegreeVec));
};

export const calculatePositionData = (
    mouseOffset: Position,
    viewPortScale: number,
    domRect: DOMRect,
    positionData: PositionData,
    relativeAngle = 0
): PositionData => {
    const scaledMouseOffset = div(mouseOffset, viewPortScale);
    const elementPos = div(centerOfDOMRect(domRect), viewPortScale);

    const newPosition = add(elementPos, scaledMouseOffset);

    const translation = calculateTranslation(positionData.angle + relativeAngle, positionData.distance);
    const parentPos = sub(elementPos, translation);

    return {
        distance: calculateDistance(newPosition, parentPos),
        angle: adjustAngle(calculateAngle(newPosition, parentPos) - relativeAngle),
    };
};

// TODO remove?
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
