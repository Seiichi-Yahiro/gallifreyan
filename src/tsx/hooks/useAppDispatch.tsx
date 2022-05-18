import { useDispatch } from 'react-redux';
import { AppDispatch } from '../state/AppState';

export const useAppDispatch: () => AppDispatch = useDispatch;
