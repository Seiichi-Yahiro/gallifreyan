import type { AppStartListening } from '@/redux/listener';
import svgActions from '@/redux/svg/svgActions';
import textActions from '@/redux/text/textActions';
import textThunks from '@/redux/text/textThunks';
import { sanitizeSentence } from '@/redux/text/textUtils';

export const updateTree = (startListening: AppStartListening) =>
    startListening({
        actionCreator: textActions.setText,
        effect: (action, api) => {
            const sanitizedText = sanitizeSentence(action.payload);
            api.dispatch(textThunks.updateTree(sanitizedText));
            api.dispatch(svgActions.reset());
        },
    });

export const setupTextListeners = (startListening: AppStartListening) => {
    updateTree(startListening);
};
