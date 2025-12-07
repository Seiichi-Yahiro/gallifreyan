import mAngle from '@/math/angle';
import mVec2, { type Vec2 } from '@/math/vec';
import actions from '@/redux/actions';
import type { AppStartListening } from '@/redux/listener';
import svgActions from '@/redux/svg/svgActions';
import svgThunks from '@/redux/svg/svgThunks';
import type { PositionData } from '@/redux/svg/svgTypes';
import { angleFromVec, circleTransform } from '@/redux/svg/svgUtils';
import {
    isLetterId,
    isLineSlotId,
    isSentenceId,
    type WordId,
} from '@/redux/text/ids';
import { TextElementType } from '@/redux/text/textElements';

export const resetCircleIntersections = (startListening: AppStartListening) =>
    startListening({
        actionCreator: svgActions.reset,
        effect: (_action, api) => {
            const state = api.getState();

            for (const [key, value] of Object.entries(state.main.svg.circles)) {
                if (value.type === TextElementType.Word) {
                    api.dispatch(
                        svgActions.calculateCircleIntersections(key as WordId),
                    );
                }
            }
        },
    });

export const startDragging = (startListening: AppStartListening) =>
    startListening({
        actionCreator: actions.startDragging,
        effect: (_action, api) => {
            const svg = document.getElementById(
                'gallifreyan',
            ) as SVGSVGElement | null;

            if (!svg) {
                return;
            }

            const state = api.getState();
            const id = state.main.selected;

            if (id === null || isSentenceId(id)) {
                return;
            }

            api.unsubscribe();

            const parentId = state.main.text.elements[id].parent;
            const parentAngle = isLetterId(parentId)
                ? state.main.svg.circles[parentId].position.angle
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
                mVec2.rotate(mVec2.create(delta.x, -delta.y), {
                    value: -parentAngle.value,
                    unit: parentAngle.unit,
                });

            const calculateNewPosition = (
                current: PositionData,
                delta: Vec2,
            ) => {
                const pos = circleTransform(current);
                return mVec2.add(pos, rotateDelta(delta));
            };

            const applyDelta = () => {
                const state = api.getState();

                if (isLineSlotId(id)) {
                    const current = state.main.svg.lineSlots[id].position;
                    const next = calculateNewPosition(current, deltaSum);

                    api.dispatch(
                        svgActions.setLineSlotPositionData({
                            id,
                            position: { angle: angleFromVec(next) },
                        }),
                    );
                } else {
                    const current = state.main.svg.circles[id].position;
                    const next = calculateNewPosition(current, deltaSum);

                    api.dispatch(
                        svgThunks.setCirclePositionData(id, {
                            distance: mVec2.length(next),
                            angle: angleFromVec(next),
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
                    deltaSum = mVec2.add(
                        deltaSum,
                        mVec2.sub(pos, prevPointerPos),
                    );
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

                api.dispatch(actions.stopDragging());
                api.subscribe();
            };

            window.addEventListener('pointermove', onMove);
            window.addEventListener('pointerup', onEnd);
            window.addEventListener('pointercancel', onEnd);
        },
    });

export const setupSvgListeners = (startListening: AppStartListening) => {
    resetCircleIntersections(startListening);
    startDragging(startListening);
};
