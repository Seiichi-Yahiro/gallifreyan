import { useEffect, useRef } from 'react';

const useEventListener = <E extends Event>(
    eventNames: string,
    handler: (event: E) => void,
    element: EventTarget | undefined | null,
    options?: AddEventListenerOptions
) => {
    const savedHandler = useRef(handler);

    useEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    useEffect(() => {
        const eventListener = (event: Event) => {
            savedHandler.current(event as E);
        };

        const events = eventNames.split(' ');

        if (!element) {
            return () => undefined;
        }

        events.forEach((eventName) => {
            element.addEventListener(eventName, eventListener, options);
        });

        return () => {
            events.forEach((eventName) => {
                element.removeEventListener(eventName, eventListener);
            });
        };
    }, [eventNames, element]);
};

export default useEventListener;
