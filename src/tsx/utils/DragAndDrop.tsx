import { PositionData } from '../state/image/ImageTypes';
import { add, angleBetween, Degree, div, length, Position, sub, toDegree, Vector2 } from './LinearAlgebra';
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

export const calculateRelativePositionData = (
    mouseMovement: Vector2,
    viewPortScale: number,
    domRect: DOMRect,
    currentPositionData: PositionData,
    relativeAngle = 0
): PositionData => {
    const scaledMouseMovement = div(mouseMovement, viewPortScale);
    const currentPosition = div(centerOfDOMRect(domRect), viewPortScale);

    const newPosition = add(currentPosition, scaledMouseMovement);

    const translation = calculateTranslation(currentPositionData.angle + relativeAngle, currentPositionData.distance);
    const parentPosition = sub(currentPosition, translation);

    return {
        distance: calculateDistance(newPosition, parentPosition),
        angle: adjustAngle(calculateAngle(newPosition, parentPosition) - relativeAngle),
    };
};
