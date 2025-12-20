import mVec2, { type Vec2 } from '@/math/vec';
import SvgContext from '@/svg/svgContext';
import useDragAndDrop, { type PointerData } from '@/utils/useDragAndDrop';
import { useContext } from 'react';

const useSvgDragAndDrop = (onMove: (pointerData: PointerData) => void) => {
    const svg = useContext(SvgContext);

    const applySvgMatrixToPoint = (svgMatrix: DOMMatrix, point: Vec2): Vec2 => {
        const domPoint = new DOMPoint(point.x, point.y).matrixTransform(
            svgMatrix,
        );

        return mVec2.create(domPoint.x, -domPoint.y);
    };

    return useDragAndDrop({
        onDown: () => {
            svg.calculateInverseSvgMatrix();
        },
        onMove: (pointerData) => {
            const inverseSvgMatrix = svg.getInverseSvgMatrix();

            if (!inverseSvgMatrix) {
                return;
            }

            const previousPos = mVec2.sub(
                pointerData.client,
                pointerData.movement,
            );

            const previousSvgPos = applySvgMatrixToPoint(
                inverseSvgMatrix,
                previousPos,
            );

            const currentSvgPos = applySvgMatrixToPoint(
                inverseSvgMatrix,
                pointerData.client,
            );

            const delta = mVec2.sub(currentSvgPos, previousSvgPos);

            onMove({ client: currentSvgPos, movement: delta });
        },
    });
};

export default useSvgDragAndDrop;
