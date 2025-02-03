import type { Degree } from '@/math/angle';
import type {
    DotId,
    LetterId,
    LineSlotId,
    SentenceId,
    WordId,
} from '@/redux/text/ids';

export interface PositionData {
    angle: Degree;
    distance: number;
}

export interface Circle {
    radius: number;
    position: PositionData;
}

export type CircleId = SentenceId | WordId | LetterId | DotId;

export type CirclesDict = {
    [K in CircleId]: Circle;
};

export interface LineSlot {
    position: PositionData;
}

export type LineSlotDict = {
    [K in LineSlotId]: LineSlot;
};
