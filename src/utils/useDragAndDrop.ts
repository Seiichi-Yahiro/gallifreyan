import mVec2, { type Vec2 } from '@/math/vec';
import React, { useEffect, useRef, useState } from 'react';

type UseDragAndDropProps = {
    onDown?: (client: Vec2) => void;
    onMove?: (pointerData: PointerData) => void;
    onUp?: (client: Vec2) => void;
};

export type PointerData = {
    client: Vec2;
    movement: Vec2;
};

const useDragAndDrop = (props: UseDragAndDropProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const frameScheduled = useRef(false);
    const frameId = useRef<number | null>(null);

    const pointerData = useRef({
        previousPos: mVec2.create(0, 0),
        currentPos: mVec2.create(0, 0),
    });

    const onPointerDown = (event: React.PointerEvent) => {
        if (!event.isPrimary || isDragging) {
            return;
        }

        event.stopPropagation();

        pointerData.current.currentPos = mVec2.create(
            event.clientX,
            event.clientY,
        );

        pointerData.current.previousPos = pointerData.current.currentPos;

        props.onDown?.(pointerData.current.currentPos);
        setIsDragging(true);
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

            pointerData.current.currentPos = mVec2.create(
                event.clientX,
                event.clientY,
            );

            if (!frameScheduled.current) {
                frameScheduled.current = true;

                frameId.current = requestAnimationFrame(() => {
                    const deltaMovement = mVec2.sub(
                        pointerData.current.currentPos,
                        pointerData.current.previousPos,
                    );

                    props.onMove?.({
                        client: pointerData.current.currentPos,
                        movement: deltaMovement,
                    });

                    pointerData.current.previousPos =
                        pointerData.current.currentPos;

                    frameScheduled.current = false;
                });
            }
        };

        const onPointerUp = (event: PointerEvent) => {
            if (!event.isPrimary) {
                return;
            }

            props.onUp?.(mVec2.create(event.clientX, event.clientY));

            if (frameId.current !== null) {
                cancelAnimationFrame(frameId.current);
                frameId.current = null;
            }

            setIsDragging(false);
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
    }, [isDragging, props]);

    return { onPointerDown, isDragging };
};

export default useDragAndDrop;
