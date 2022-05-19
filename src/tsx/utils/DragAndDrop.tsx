import { PositionData } from '../state/ImageTypes';
import { angleBetween, Degree, length, mul, Position, sub, toDegree, Vector2 } from './LinearAlgebra';
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
    parentAngle = 0
): PositionData => {
    const translation = calculateTranslation(childPositionData.angle + parentAngle, childPositionData.distance);
    const parentPos = calculateParentPos(childDomRect, translation, viewPortScale);

    return {
        distance: calculateDistance(mousePos, parentPos, viewPortScale),
        angle: adjustAngle(calculateAngle(mousePos, parentPos) - parentAngle),
    };
};
