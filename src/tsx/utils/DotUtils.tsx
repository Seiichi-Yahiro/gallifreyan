import { isDoubleDot, isInside, isOnLine, isTripleDot } from './LetterGroups';
import Point from './Point';
import { v4 } from 'uuid';
import { IDot, ILetter, SVGItemType } from '../types/SVG';

export const initializeDots = (letter: ILetter): IDot[] => {
    const { text, r, angles } = letter;
    const [startAngle, endAngle] = angles;
    const angleDifference = endAngle - (startAngle < endAngle ? startAngle + Math.PI * 2 : startAngle);
    const moveAngle = (isInside(text) ? Math.PI : angleDifference) / 4;

    let defaultPosition: Point;
    if (isInside(text)) {
        const letterPos = new Point(letter.x, letter.y);
        const distance = letterPos.length() - (letterPos.length() - letter.r + 5);
        defaultPosition = letterPos
            .unit()
            .multiply(distance)
            .rotate(-Math.PI / 2);
    } else {
        defaultPosition = new Point(r - 5, 0).rotate(startAngle);
    }

    const defaultDot = {
        r: 2.5
    };

    let children: Point[] = [];

    if (isDoubleDot(text)) {
        children = [3 * moveAngle, moveAngle].map(angle => defaultPosition.rotate(angle));
    } else if (isTripleDot(text)) {
        children = [3 * moveAngle, 2 * moveAngle, moveAngle].map(angle => defaultPosition.rotate(angle));
    }

    // Move dots outside for on line circles this is an aesthetic change
    if (isOnLine(text)) {
        children = children.map(point => point.rotate(Math.PI));
    }

    return children.map(
        dot =>
            ({
                id: v4(),
                type: SVGItemType.DOT,
                parent: letter,
                ...defaultDot,
                ...dot
            } as IDot)
    );
};
