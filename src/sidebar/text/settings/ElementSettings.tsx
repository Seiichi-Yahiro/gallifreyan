import { createReduxSelector, useAppDispatch, useRedux } from '@/redux/hooks';
import type { CircleId } from '@/redux/svg/svgTypes';
import {
    isDotId,
    isLetterId,
    isLineSlotId,
    type LetterId,
    type LineSlotId,
} from '@/redux/text/ids';
import { LetterType } from '@/redux/text/letters';
import { isDigraphText } from '@/redux/text/textAnalysis';
import textThunks from '@/redux/text/textThunks';
import AngleSettings from '@/sidebar/text/settings/AngleSettings';
import DistanceSettings from '@/sidebar/text/settings/DistanceSettings';
import RadiusSettings from '@/sidebar/text/settings/RadiusSettings';
import IconButton from '@/ui/IconButton';
import cn from '@/utils/cn';
import { Merge, Split } from 'lucide-react';
import React, { useMemo } from 'react';

interface PositionInputProps {
    className?: string;
}

const ElementSettings: React.FC<PositionInputProps> = ({ className }) => {
    const selected = useRedux((state) => state.main.selected);

    if (!selected) {
        return null;
    }

    return (
        <div className={cn('flex flex-col gap-1', className)}>
            {isLetterId(selected) && <LetterSettings id={selected} />}
            {isLineSlotId(selected) ? (
                <LineSlotSettings id={selected} />
            ) : (
                <CircleSettings id={selected} />
            )}
        </div>
    );
};

const selectLetterWithNeighbors = createReduxSelector(
    [
        (state, id: LetterId) => state.main.text.elements[id],
        (state) => state.main.text.elements,
    ],
    (letterElement, elements) => {
        const parent = elements[letterElement.parent];
        const index = parent.letters.indexOf(letterElement.id);

        const prev = index > 0 ? elements[parent.letters[index - 1]] : null;

        const next =
            index < parent.letters.length - 1
                ? elements[parent.letters[index + 1]]
                : null;

        return {
            prevLetterElement: prev,
            letterElement,
            nextLetterElement: next,
        };
    },
);

interface LetterSettingsProps {
    id: LetterId;
}

const LetterSettings: React.FC<LetterSettingsProps> = ({ id }) => {
    const dispatch = useAppDispatch();

    const { prevLetterElement, letterElement, nextLetterElement } = useRedux(
        (state) => selectLetterWithNeighbors(state, id),
    );

    const canMergeWithPrevToDigraph = useMemo(
        () =>
            prevLetterElement &&
            isDigraphText(prevLetterElement.text + letterElement.text),
        [letterElement.text, prevLetterElement],
    );

    const canMergeWithNextToDigraph = useMemo(
        () =>
            nextLetterElement &&
            isDigraphText(letterElement.text + nextLetterElement.text),
        [letterElement.text, nextLetterElement],
    );

    return (
        <div className="flex flex-row gap-1 empty:hidden">
            {canMergeWithPrevToDigraph && (
                <IconButton
                    onClick={() => {
                        dispatch(
                            textThunks.mergeToDigraph(
                                prevLetterElement!.id,
                                id,
                            ),
                        );
                    }}
                >
                    <Merge className="-rotate-90" />
                </IconButton>
            )}
            {letterElement.letter.letterType === LetterType.Digraph && (
                <IconButton
                    onClick={() => {
                        dispatch(textThunks.splitDigraph(id));
                    }}
                >
                    <Split />
                </IconButton>
            )}
            {canMergeWithNextToDigraph && (
                <IconButton
                    onClick={() => {
                        dispatch(
                            textThunks.mergeToDigraph(
                                id,
                                nextLetterElement!.id,
                            ),
                        );
                    }}
                >
                    <Merge className="rotate-90" />
                </IconButton>
            )}
        </div>
    );
};

interface CircleSettingsProps {
    id: CircleId;
}

const CircleSettings: React.FC<CircleSettingsProps> = ({ id }) => {
    const circle = useRedux((state) => state.main.svg.circles[id]);

    const parentAngle = useRedux((state) =>
        isDotId(id)
            ? state.main.svg.circles[state.main.text.elements[id].parent]
                  .position.angle
            : undefined,
    );

    return (
        <>
            <RadiusSettings radius={circle.radius} />
            <DistanceSettings distance={circle.position.distance} />
            <AngleSettings
                angle={circle.position.angle}
                parentAngle={parentAngle}
            />
        </>
    );
};

interface LineSlotSettingsProps {
    id: LineSlotId;
}

const LineSlotSettings: React.FC<LineSlotSettingsProps> = ({ id }) => {
    const lineSlot = useRedux((state) => state.main.svg.lineSlots[id]);

    const parentAngle = useRedux(
        (state) =>
            state.main.svg.circles[state.main.text.elements[id].parent].position
                .angle,
    );

    return (
        <AngleSettings
            angle={lineSlot.position.angle}
            parentAngle={parentAngle}
        />
    );
};

export default ElementSettings;
