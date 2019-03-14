import { useContext } from 'react';
import { AppContextStateDispatch, AppContextStateSelection } from '../view/AppContext';
import { selectAction } from '../store/AppStore';
import { ISVGBaseItem } from '../types/SVG';
import { getPath } from '../store/StateUtils';
import { areListsEqual } from '../utils/Utils';

const useSelect = (svgItem: ISVGBaseItem) => {
    const dispatch = useContext(AppContextStateDispatch);
    const selection = useContext(AppContextStateSelection);

    const isSelected = areListsEqual(selection, getPath(svgItem));

    const select = () => {
        if (!isSelected) {
            dispatch(selectAction(svgItem));
        }
    };

    return { select, isSelected };
};

export default useSelect;
