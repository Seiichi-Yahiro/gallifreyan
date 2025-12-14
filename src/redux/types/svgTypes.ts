import type { Angle } from '@/math/angle';
import type { PolarCoordinate } from '@/math/polar';
import type {
    DotId,
    LetterId,
    LineSlotId,
    SentenceId,
    WordId,
} from '@/redux/ids';
import { TextElementType } from '@/redux/types/textTypes';

/**
 * An Arc should be drawn counterclockwise.
 */
export type Arc = {
    start: Angle;
    end: Angle;
};

export interface PolarCircle {
    radius: number;
    position: PolarCoordinate;
}

export interface SentenceCircle extends PolarCircle {
    type: TextElementType.Sentence;
}

export interface WordCircle extends PolarCircle {
    type: TextElementType.Word;
    // anti arcs are the parts that should not be drawn
    antiArcs: {
        [K in LetterId]: Arc | null;
    };
}

export interface LetterCircle extends PolarCircle {
    type: TextElementType.Letter;
    arc: Arc | null;
}

export interface DotCircle extends PolarCircle {
    type: TextElementType.Dot;
}

export type Circle = SentenceCircle | WordCircle | LetterCircle | DotCircle;

export type CircleId = SentenceId | WordId | LetterId | DotId;

// prettier-ignore
export type CirclesDictValue<K extends string> =
    K extends SentenceId ? SentenceCircle :
    K extends WordId ? WordCircle :
    K extends LetterId ? LetterCircle :
    K extends DotId ? DotCircle : never;

export type CirclesDict = {
    [K in CircleId]: CirclesDictValue<K>;
};

export interface LineSlot {
    position: PolarCoordinate;
}

export type LineSlotDict = {
    [K in LineSlotId]: LineSlot;
};
