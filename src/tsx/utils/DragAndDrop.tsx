import { angleBetween, Degree, length, mul, Position, sub, toDegree, Vector2 } from './LinearAlgebra';

export const calculateParentPos = (element: Element, translation: Vector2, viewPortScale: number) => {
    const domRect = element.getBoundingClientRect();
    const elementPos = centerOfDOMRect(domRect);
    return sub(elementPos, mul(translation, viewPortScale));
};

const centerOfDOMRect = ({ left, top, width, height }: DOMRect): Position => ({
    x: left + width / 2,
    y: top + height / 2,
});

export const calculateParentDistance = (mousePos: Position, parentPos: Position, viewPortScale: number): number => {
    const mouseVec = sub(mousePos, parentPos);
    return length(mouseVec) / viewPortScale;
};

export const calculateAngle = (mousePos: Position, parentPos: Position): Degree => {
    const mouseVec = sub(mousePos, parentPos);
    const zeroDegreeVec: Vector2 = { x: 0, y: 1 };
    return toDegree(angleBetween(mouseVec, zeroDegreeVec));
};
