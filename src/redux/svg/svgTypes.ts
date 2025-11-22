import type { Angle } from '@/math/angle';
import type {
    CircleIntersections,
    TwoCircleIntersections,
} from '@/math/circle';
import type { Vec2 } from '@/math/vec';
import type {
    DotId,
    LetterId,
    LineSlotId,
    SentenceId,
    WordId,
} from '@/redux/text/ids';
import type { TextElementType } from '@/redux/text/textTypes';

export type Arc = [Vec2, Vec2];

export interface PositionData {
    angle: Angle;
    distance: number;
}

export interface CircleI {
    radius: number;
    position: PositionData;
}

export interface SentenceCircle extends CircleI {
    type: TextElementType.Sentence;
}

export interface WordCircle extends CircleI {
    type: TextElementType.Word;
    intersections: TwoCircleIntersections['values'][];
    arcs: Arc[];
}

export interface LetterCircle extends CircleI {
    type: TextElementType.Letter;
    intersections: CircleIntersections;
}

export interface DotCircle extends CircleI {
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
    position: PositionData;
}

export type LineSlotDict = {
    [K in LineSlotId]: LineSlot;
};
