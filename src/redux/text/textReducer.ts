import { type LetterId, type SentenceId, type WordId } from '@/redux/text/ids';
import textActions from '@/redux/text/textActions';
import { type TextElementsDict, TextElementType } from '@/redux/text/textTypes';
import { createReducer, isAnyOf } from '@reduxjs/toolkit';

export interface TextState {
    value: string;
    rootElement: SentenceId | null;
    elements: TextElementsDict;
}

const createInitialTextState = (): TextState => ({
    value: '',
    rootElement: null,
    elements: {},
});

export const createTextReducer = (
    initialState: TextState | (() => TextState) = createInitialTextState,
) =>
    createReducer(initialState, (builder) => {
        builder
            .addCase(textActions.setText, (state, action) => {
                state.value = action.payload;
            })
            .addCase(textActions.addSentence, (state, action) => {
                if (action.payload.id in state.elements) {
                    throw new Error(
                        `Tried to add ${action.payload.id}, but it already exists`,
                    );
                }

                state.rootElement = action.payload.id;
                state.elements[action.payload.id] = action.payload;
            })
            .addCase(textActions.removeSentence, (state, _action) => {
                state.rootElement = null;
                state.elements = {};
            })
            .addMatcher(
                isAnyOf(
                    textActions.addWord,
                    textActions.addLetter,
                    textActions.addDot,
                    textActions.addLineSlot,
                ),
                (state, action) => {
                    if (action.payload.id in state.elements) {
                        throw new Error(
                            `Tried to add ${action.payload.id}, but it already exists`,
                        );
                    }

                    state.elements = {
                        ...state.elements,
                        [action.payload.id]: action.payload,
                    };

                    const parent = state.elements[action.payload.parent];

                    if (!parent) {
                        throw new Error(
                            `Could not find parent ${action.payload.parent} of ${action.payload.id}`,
                        );
                    }

                    switch (parent.elementType) {
                        case TextElementType.Sentence: {
                            parent.words.push(action.payload.id as WordId);
                            break;
                        }

                        case TextElementType.Word: {
                            parent.letters.push(action.payload.id as LetterId);
                            break;
                        }

                        case TextElementType.Letter: {
                            if (
                                action.payload.elementType ===
                                TextElementType.Dot
                            ) {
                                parent.dots.push(action.payload.id);
                            } else if (
                                action.payload.elementType ===
                                TextElementType.LineSlot
                            ) {
                                parent.lineSlots.push(action.payload.id);
                            }
                            break;
                        }

                        default: {
                            throw new Error('Unhandled case');
                        }
                    }
                },
            )
            .addMatcher(
                isAnyOf(
                    textActions.removeWord,
                    textActions.removeLetter,
                    textActions.removeDot,
                    textActions.removeLineSlot,
                ),
                (state, action) => {
                    const element = state.elements[action.payload];

                    if (!element) {
                        throw new Error(
                            `Tried to delete nonexistent ${action.payload}`,
                        );
                    }

                    const parent = state.elements[element.parent];

                    if (!parent) {
                        delete state.elements[action.payload];
                        return;
                    }

                    const filterChild = (childId: string) =>
                        childId !== element.id;

                    switch (parent.elementType) {
                        case TextElementType.Sentence: {
                            parent.words = parent.words.filter(filterChild);
                            break;
                        }

                        case TextElementType.Word: {
                            parent.letters = parent.letters.filter(filterChild);
                            break;
                        }

                        case TextElementType.Letter: {
                            if (element.elementType === TextElementType.Dot) {
                                parent.dots = parent.dots.filter(filterChild);
                            } else if (
                                element.elementType === TextElementType.LineSlot
                            ) {
                                parent.lineSlots =
                                    parent.lineSlots.filter(filterChild);
                            }
                            break;
                        }

                        default: {
                            throw new Error('Unhandled case');
                        }
                    }

                    delete state.elements[action.payload];
                },
            )
            .addMatcher(
                isAnyOf(
                    textActions.updateSentenceText,
                    textActions.updateWordText,
                    textActions.updateLetterText,
                ),
                (state, action) => {
                    if (!(action.payload.id in state.elements)) {
                        throw new Error(
                            `Tried to update nonexistent ${action.payload}`,
                        );
                    }

                    state.elements = {
                        ...state.elements,
                        [action.payload.id]: {
                            ...state.elements[action.payload.id],
                            ...action.payload,
                        },
                    };
                },
            );
    });
