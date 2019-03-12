import { useContext } from 'react';
import { AppContextStateDispatch, AppContextStateSelection } from '../view/AppContext';
import { selectAction } from '../store/AppStore';
import { ISVGBaseItem } from '../types/SVG';

const useSelect = (svgItem: ISVGBaseItem) => {
    const dispatch = useContext(AppContextStateDispatch);
    const selection = useContext(AppContextStateSelection);

    const isSelected = selection === svgItem;

    const select = () => {
        if (!isSelected) {
            dispatch(selectAction(svgItem));
        }
    };

    return { select, isSelected };
};

export default useSelect;
