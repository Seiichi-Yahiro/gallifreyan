import mVec2 from '@/math/vec';
import { useAppDispatch } from '@/redux/hooks';
import type { LineSlotId, SentenceId } from '@/redux/ids';
import uiThunks from '@/redux/thunks/uiThunks';
import type { CircleId } from '@/redux/types/svgTypes';
import SvgContext from '@/svg/svgContext';
import useDragAndDrop from '@/utils/useDragAndDrop';
import { useContext } from 'react';

const useSvgDragAndDrop = (id: Exclude<CircleId, SentenceId> | LineSlotId) => {
    const dispatch = useAppDispatch();
    const svg = useContext(SvgContext);

    return useDragAndDrop({
        onDown: () => {
            svg.calculateInverseSvgMatrix();
        },
        onMove: (pointerData) => {
            dispatch(uiThunks.onDrag(id, pointerData.movement));
        },
        transform: (client) => {
            const inverseSvgMatrix = svg.getInverseSvgMatrix();

            if (!inverseSvgMatrix) {
                return client;
            }

            const domPoint = new DOMPoint(client.x, client.y).matrixTransform(
                inverseSvgMatrix,
            );

            return mVec2.create(domPoint.x, domPoint.y);
        },
    });
};

export default useSvgDragAndDrop;
