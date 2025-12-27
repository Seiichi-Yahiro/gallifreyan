import type { Radian } from '@/math/angle';
import type { PolarCoordinate } from '@/math/polar';
import type {
    DotId,
    LetterId,
    LineSlotId,
    SentenceId,
    WordId,
} from '@/redux/ids';

/**
 * An Arc should be drawn counterclockwise.
 */
export type Arc = {
    start: Radian;
    end: Radian;
};

export interface PolarCircle {
    radius: number;
    position: PolarCoordinate;
}

export type CircleId = SentenceId | WordId | LetterId | DotId;

export type CirclesDict = {
    [K in CircleId]: PolarCircle;
};

export interface LineSlot {
    position: PolarCoordinate;
}

export type LineSlotDict = {
    [K in LineSlotId]: LineSlot;
};
