import { updateSVGItemsAction } from '../store/AppStore';
import { ISVGBaseItem } from '../types/SVG';
import { useContext } from 'react';
import { AppContextStateDispatch } from '../view/AppContext';

const useHover = (svgItem: ISVGBaseItem) => {
    const dispatch = useContext(AppContextStateDispatch);

    const toggleHover = (hoverState: boolean) => () =>
        dispatch(
            updateSVGItemsAction(svgItem, () => ({
                isHovered: hoverState
            }))
        );

    return { toggleHover };
};

export default useHover;
