import { useContext } from 'react';
import { AppContextState, AppContextStateDispatch } from '../view/AppContext';
import { selectAction } from '../store/AppStore';
import { ISVGBaseItem } from '../types/SVG';

const useSelect = (svgItem: ISVGBaseItem) => {
    const dispatch = useContext(AppContextStateDispatch);
    const { selection } = useContext(AppContextState);

    const isSelected = selection === svgItem;

    const select = () => {
        if (!isSelected) {
            dispatch(selectAction(svgItem));
        }
    };

    return { select, isSelected };
};

export default useSelect;
