import mVec2 from '@/math/vec';
import SvgContext from '@/svg/svgContext';
import useDragAndDrop, { type PointerData } from '@/utils/useDragAndDrop';
import { useContext } from 'react';

const useSvgDragAndDrop = (onMove: (pointerData: PointerData) => void) => {
    const svg = useContext(SvgContext);

    return useDragAndDrop({
        onDown: () => {
            svg.calculateInverseSvgMatrix();
        },
        onMove,
        transform: (client) => {
            const inverseSvgMatrix = svg.getInverseSvgMatrix();

            if (!inverseSvgMatrix) {
                return client;
            }

            const domPoint = new DOMPoint(client.x, client.y).matrixTransform(
                inverseSvgMatrix,
            );

            return mVec2.create(domPoint.x, -domPoint.y);
        },
    });
};

export default useSvgDragAndDrop;
