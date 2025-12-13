import mAngle from '@/math/angle';
import mPolar, { type PolarCoordinate } from '@/math/polar';
import mVec2, { type Vec2 } from '@/math/vec';
import ids, { type LineSlotId } from '@/redux/ids';
import { svgActions } from '@/redux/slices/svgSlice';
import { uiActions } from '@/redux/slices/uiSlice';
import type { AppThunkAction } from '@/redux/store';
import svgThunks from '@/redux/thunks/svgThunks';
import type { CircleId } from '@/redux/types/svgTypes';

const setSelection =
    (id: CircleId | LineSlotId | null): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();

        if (state.ui.selected !== id && !state.ui.dragging) {
            dispatch(uiActions.setSelection(id));
        }
    };

const startDragging =
    (id: CircleId | LineSlotId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();

        if (
            state.ui.selected !== id ||
            ids.sentence.is(id) ||
            state.ui.dragging
        ) {
            return;
        }

        const svg = document.getElementById(
            'gallifreyan',
        ) as SVGSVGElement | null;

        if (!svg) {
            throw new Error('SVG element not found');
        }

        dispatch(uiActions.setDragging(true));

        const parentId = state.text.elements[id].parent;
        const parentAngle = ids.letter.is(parentId)
            ? state.svg.circles[parentId].position.angle
            : mAngle.radian(0);

        const inverseDOMMatrix = svg.getScreenCTM()!.inverse();

        let prevPointerPos: Vec2 | null = null;
        let deltaSum = mVec2.create(0, 0);
        let frameId: number | null = null;
        let frameScheduled = false;

        const pointerToSvgPosition = (event: PointerEvent): Vec2 => {
            const domPoint = new DOMPoint(
                event.clientX,
                event.clientY,
            ).matrixTransform(inverseDOMMatrix);

            return mVec2.create(domPoint.x, domPoint.y);
        };

        const rotateDelta = (delta: Vec2) =>
            mVec2.rotate(mVec2.create(delta.x, -delta.y), parentAngle, true);

        const calculateNewPosition = (
            current: PolarCoordinate,
            delta: Vec2,
        ) => {
            const pos = mPolar.toCartesian(current);
            return mVec2.add(pos, rotateDelta(delta));
        };

        const applyDelta = () => {
            const state = getState();

            if (ids.lineSlot.is(id)) {
                const current = state.svg.lineSlots[id].position;
                const next = calculateNewPosition(current, deltaSum);

                dispatch(
                    svgActions.setLineSlotPosition({
                        id,
                        position: { angle: mPolar.angleFromCartesian(next) },
                    }),
                );
            } else {
                const current = state.svg.circles[id].position;
                const next = calculateNewPosition(current, deltaSum);

                dispatch(
                    svgThunks.setCirclePosition(id, {
                        distance: mVec2.length(next),
                        angle: mPolar.angleFromCartesian(next),
                    }),
                );
            }

            deltaSum = mVec2.create(0, 0);
            frameScheduled = false;
        };

        const scheduleFrame = () => {
            if (!frameScheduled) {
                frameScheduled = true;
                frameId = requestAnimationFrame(applyDelta);
            }
        };

        const onMove = (event: PointerEvent) => {
            if (!event.isPrimary) {
                return;
            }

            event.preventDefault();

            const pos = pointerToSvgPosition(event);

            if (prevPointerPos) {
                deltaSum = mVec2.add(deltaSum, mVec2.sub(pos, prevPointerPos));
            }

            prevPointerPos = pos;
            scheduleFrame();
        };

        const onEnd = (event: PointerEvent) => {
            if (!event.isPrimary) {
                return;
            }

            if (frameId !== null) {
                cancelAnimationFrame(frameId);
            }

            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onEnd);
            window.removeEventListener('pointercancel', onEnd);

            dispatch(uiActions.setDragging(false));
        };

        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onEnd);
        window.addEventListener('pointercancel', onEnd);
    };

const uiThunks = {
    setSelection,
    startDragging,
};

export default uiThunks;
