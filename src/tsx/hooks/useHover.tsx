import { useState } from 'react';

const useHover = () => {
    const [isHovered, setIsHovered] = useState(false);
    const toggleHover = (hoverState: boolean) => () => setIsHovered(hoverState);
    return { toggleHover, isHovered };
};

export default useHover;
