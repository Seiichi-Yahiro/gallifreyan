import type { AppStartListening } from '@/redux/listener';
import svgActions from '@/redux/svg/svgActions';
import type { WordId } from '@/redux/text/ids';
import { TextElementType } from '@/redux/text/textTypes';

export const resetCircleIntersections = (startListening: AppStartListening) =>
    startListening({
        actionCreator: svgActions.reset,
        effect: (_action, api) => {
            const state = api.getState();

            for (const [key, value] of Object.entries(state.main.svg.circles)) {
                if (value.type === TextElementType.Word) {
                    api.dispatch(
                        svgActions.calculateCircleIntersections(key as WordId),
                    );
                }
            }
        },
    });

export const setupSvgListeners = (startListening: AppStartListening) => {
    resetCircleIntersections(startListening);
};
