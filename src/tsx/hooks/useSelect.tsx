import { useContext } from 'react';
import { AppContextState, AppContextStateDispatch } from '../view/AppContext';
import { selectAction } from '../store/AppStore';
import { ISVGBaseItem } from '../types/SVG';

const useSelect = (svgItem: ISVGBaseItem) => {
    const dispatch = useContext(AppContextStateDispatch);
    const { selection } = useContext(AppContextState);

    const select = () => dispatch(selectAction(svgItem));
    const isSelected = selection === svgItem;

    return { select, isSelected };
};

export default useSelect;
