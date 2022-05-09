import { useSelector } from 'react-redux';
import { AppState } from '../state/AppState';

export const useRedux = <S,>(selector: (state: AppState) => S, equalityFn?: (left: S, right: S) => boolean) =>
    useSelector<AppState, S>(selector, equalityFn);
