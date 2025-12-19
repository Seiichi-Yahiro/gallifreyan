import mVec2, { type Vec2 } from '@/math/vec';
import { useAppDispatch } from '@/redux/hooks';
import { uiActions } from '@/redux/slices/uiSlice';
import React, { useEffect, useRef, useState } from 'react';

type UseDragAndDropProps = {
    onDown?: (pointerData: PointerData) => void;
    onMove?: (pointerData: PointerData) => void;
    onEnd?: (pointerData: PointerData) => void;
    transform?: (client: Vec2) => Vec2;
};

export type PointerData = {
    client: Vec2;
    movement: Vec2;
};

const useDragAndDrop = (props: UseDragAndDropProps) => {
    const dispatch = useAppDispatch();

    const [isDragging, setIsDragging] = useState(false);
    const frameScheduled = useRef(false);
    const frameId = useRef<number | null>(null);

    const pointerData = useRef<PointerData>({
        client: mVec2.create(0, 0),
        movement: mVec2.create(0, 0),
    });

    const onPointerDown = (event: React.PointerEvent) => {
        if (!event.isPrimary || isDragging) {
            return;
        }

        props.onDown?.(pointerData.current);

        event.stopPropagation();

        pointerData.current.client = mVec2.create(event.clientX, event.clientY);

        if (props.transform) {
            pointerData.current.client = props.transform(
                pointerData.current.client,
            );
        }

        pointerData.current.movement = mVec2.create(0, 0);

        setIsDragging(true);
        dispatch(uiActions.setDragging(true));
    };

    useEffect(() => {
        if (!isDragging) {
            return () => {};
        }

        const onPointerMove = (event: PointerEvent) => {
            if (!event.isPrimary || !isDragging) {
                return;
            }

            event.preventDefault();

            let pos = mVec2.create(event.clientX, event.clientY);

            if (props.transform) {
                pos = props.transform(pos);
            }

            // calculate delta
            pointerData.current.movement = mVec2.add(
                pointerData.current.movement,
                mVec2.sub(pos, pointerData.current.client),
            );

            pointerData.current.client = pos;

            if (!frameScheduled.current) {
                frameScheduled.current = true;

                frameId.current = requestAnimationFrame(() => {
                    props.onMove?.(pointerData.current);
                    pointerData.current.movement = mVec2.create(0, 0);
                    frameScheduled.current = false;
                });
            }
        };

        const onPointerUp = (event: PointerEvent) => {
            if (!event.isPrimary) {
                return;
            }

            props.onEnd?.(pointerData.current);

            if (frameId.current !== null) {
                cancelAnimationFrame(frameId.current);
                frameId.current = null;
            }

            setIsDragging(false);
            dispatch(uiActions.setDragging(false));

            frameScheduled.current = false;
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);

        return () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointercancel', onPointerUp);
        };
    }, [dispatch, isDragging, props]);

    return { onPointerDown, isDragging };
};

export default useDragAndDrop;
