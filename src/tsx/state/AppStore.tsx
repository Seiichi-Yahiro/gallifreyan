import { useSelector } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { produce, enableAllPlugins } from 'immer';
import logger from 'redux-logger';
import { isValidLetter } from '../utils/LetterGroups';
import { convertTextToSentence, splitWordToChars } from '../utils/TextConverter';
import { resetLetters } from '../utils/TextTransforms';
import { AppStoreState, UUID } from './StateTypes';
import { createActionCreator, createReducer } from 'deox';
import { composeWithDevTools } from 'redux-devtools-extension';
import Maybe from '../utils/Maybe';

enableAllPlugins();

const defaultState: AppStoreState = {
    circles: {},
    lineConnections: {},
    lineSlots: {},
    sentences: [],
    svgSize: 1000,
    selection: [],
    hovering: Maybe.none(),
};

export const addSentenceAction = createActionCreator('ADD_SENTENCE', (resolve) => (sentence: string) =>
    resolve(sentence)
);

export const setHoveringAction = createActionCreator('SET_HOVERING', (resolve) => (uuid: Maybe<UUID>) => resolve(uuid));

const reducer = createReducer(defaultState, (handle) => [
    handle(addSentenceAction, (state, { payload: sentenceText }) =>
        produce(state, (draft) => {
            const text = sentenceText
                .split(' ')
                .map((word) => splitWordToChars(word).filter(isValidLetter).join(''))
                .filter((word) => word.length > 0)
                .join(' ');
            const { sentence, circles, lineSlots } = convertTextToSentence(text);

            draft.sentences.push(sentence);
            circles.forEach((circle) => (draft.circles[circle.id] = circle));
            lineSlots.forEach((slot) => (draft.lineSlots[slot.id] = slot));

            resetLetters(draft as AppStoreState);
        })
    ),
    handle(setHoveringAction, (state, { payload }) =>
        produce(state, (draft) => {
            draft.hovering = payload;
        })
    ),
]);

export const configureStore = () => createStore(reducer, composeWithDevTools(applyMiddleware(logger)));

export function useRedux<S>(selector: (state: AppStoreState) => S, equalityFn?: (left: S, right: S) => boolean) {
    return useSelector<AppStoreState, S>(selector, equalityFn);
}
