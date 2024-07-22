import { useEffect, useRef } from "react";

export const useEffectEvent = (event: any, effect: () => void) => {
    const eventRef = useRef(event);

    useEffect(() => {
        if (event !== eventRef.current) {
            effect();
            eventRef.current = event;
        }
    }, [event])
};