/*
import {v4} from "uuid";
import {isDoubleDot, isDoubleLine, isSingleLine, isTripleDot, isTripleLine} from "../utils/LetterGroups";
import {convertWordToLetters} from "../utils/LetterUtils";
import Maybe from "../utils/Maybe";
import {AppStoreState, Letter, Referencable, Circle, SVGLine} from "./StateTypes";




export enum ActionType {
    ADD_WORD = 'ADD_WORD',
}

export interface Action<T = any> {
    type: string;
    payload: T;
}

// tslint:disable-next-line:no-any
export type AppAction<T = any> = Action<T> | ((state: Readonly<AppStoreState>) => Action<T>)

interface ActionCreator<T> {
    creator: (state: Readonly<AppStoreState>) => AppAction<T>,
    isAction: (action: Action) => action is Action<T>
}

function createAction<A, F extends Function>(name: string, f: F): ActionCreator<A> {
    return {
      creator: () => f(),
      isAction: (action: Action) => action.type === name
    };
}

createAction('foo', () => 5)

// tslint:disable-next-line:no-any
export const isAddWordAction = (action: Action<any>): action is Action<string> => action.type === ActionType.ADD_WORD;
export const addSentenceAction = (word: string): Action<string> => {
    const data = convertWordToLetters(word).map(char => {
        let filled = true;
        let dots: Circle[] = [];
        let lineSlots: Maybe<Referencable<SVGLine>>[] = [];

        const dot = {
            x: 0,
            y:0,
            r: 5,
            filled: true
        };

        if (isDoubleDot(char)) {
            dots = [dot, dot].map(it => ({...it, id: v4()}));
        } else if (isTripleDot(char)) {
            dots = [dot, dot, dot].map(it => ({...it, id: v4()}));
        } else {
            filled = false;
        }

        if (isSingleLine(char)) {
            lineSlots = [Maybe.none()];
        } else if (isDoubleLine(char)) {
            lineSlots = [Maybe.none(), Maybe.none()];
        } else if (isTripleLine(char)) {
            lineSlots = [Maybe.none(), Maybe.none(), Maybe.none()];
        }

        const circleId: Circle = {
            id: v4(),
          x: 0,
          y:0,
          r: 10,
          filled
        };

        const letter: Letter = {
            id: v4(),
            circleId: {id: circleId.id},
            dots: dots.map(it => ({id: it.id})),
            lineSlots
        };

        return {
            letter,
            circles: dots.concat(circleId),
        };
    });

    return {
        type: ActionType.ADD_WORD,
        payload: {
            text: word,
            circles: data.flatMap(it => it.circles),
            letters: data.map(it => it.letter)
        },
    };
};
*/
