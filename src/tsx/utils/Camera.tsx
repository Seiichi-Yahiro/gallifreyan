import React, { useEffect, useRef } from 'react';
import useComplexState from '../hooks/useComplexState';
import useEventListener from '../hooks/useEventListener';
import Maybe from './Maybe';
import './Camera.scss';

interface CameraProps {
    size: number;
}

const Camera: React.FunctionComponent<CameraProps> = ({ size, children }) => {
    const cameraRef = useRef<HTMLDivElement>(null);

    const [state, setState] = useComplexState({
        scale: 1,
        transformX: 0,
        transformY: 0,
        isPanning: false,
    });

    const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.button === 1) {
            setState({ isPanning: true });
        }
    };

    const onMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.button === 1) {
            setState({ isPanning: false });
        }
    };

    const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!state.isPanning) {
            return;
        }

        const x = event.movementX;
        const y = event.movementY;
        setState((oldState) => ({ transformX: oldState.transformX + x, transformY: oldState.transformY + y }));

        /*Maybe.of(cameraRef.current).map(it => it.getBoundingClientRect()).ifIsSome(({x, y, width, height}) => {
           const transformX = event.clientX - x - width / 2;
           // const transformY = event.clientY - y - height / 2;
           setState(oldState => ({transformX: transformX + (transformX - oldState.transformX)}));
        });*/
    };

    const onMouseWheel = (event: React.WheelEvent<HTMLDivElement>) => {
        const sign = Math.sign(-event.deltaY);
        setState((oldState) => ({ scale: oldState.scale + 0.1 * sign }));
    };

    const resetView = () => {
        Maybe.of(cameraRef.current)
            .map((it) => it.getBoundingClientRect())
            .ifIsSome(({ width, height }) =>
                setState({ scale: Math.min(width / size, height / size), transformX: 0, transformY: 0 })
            );
    };

    useEffect(() => {
        resetView();
    }, [cameraRef, size]);

    useEventListener<KeyboardEvent>(
        'keypress',
        (event) => {
            if (event.key === 'r') {
                resetView();
            }
        },
        window
    );

    return (
        <div
            ref={cameraRef}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            onWheel={onMouseWheel}
            className="camera"
        >
            <div
                className="camera__view"
                style={{
                    transform: `matrix(${state.scale}, 0, 0, ${state.scale}, ${state.transformX}, ${state.transformY})`,
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default Camera;
