import { AngleUnit } from '@/math/angle';
import { createReduxSelector, useAppDispatch, useRedux } from '@/redux/hooks';
import {
    isDotId,
    isLetterId,
    isLineSlotId,
    isSentenceId,
    type LetterId,
    type LineSlotId,
} from '@/redux/ids';
import { svgActions } from '@/redux/slices/svgSlice';
import letterThunks from '@/redux/thunks/letterThunks';
import svgThunks from '@/redux/thunks/svgThunks';
import { LetterPlacement, LetterType } from '@/redux/types/letterTypes';
import type { CircleId } from '@/redux/types/svgTypes';
import { isDigraphText } from '@/redux/utils/textAnalysis';
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
    const selected = useRedux((state) => state.ui.selected);

    if (!selected || isSentenceId(selected)) {
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
        (state, id: LetterId) => state.text.elements[id],
        (state) => state.text.elements,
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
                            letterThunks.mergeToDigraph(
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
                        dispatch(letterThunks.splitDigraph(id));
                    }}
                >
                    <Split />
                </IconButton>
            )}
            {canMergeWithNextToDigraph && (
                <IconButton
                    onClick={() => {
                        dispatch(
                            letterThunks.mergeToDigraph(
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
    const dispatch = useAppDispatch();

    const circle = useRedux((state) => state.svg.circles[id]);

    const parentAngle = useRedux((state) =>
        isDotId(id)
            ? state.svg.circles[state.text.elements[id].parent].position.angle
            : undefined,
    );

    const canChangeDistance = useRedux(
        (state) =>
            !(
                isLetterId(id) &&
                state.text.elements[id].letter.placement ===
                    LetterPlacement.OnLine
            ),
    );

    return (
        <>
            <RadiusSettings
                radius={circle.radius}
                onChange={(radius) =>
                    dispatch(svgThunks.setCircleRadius(id, radius))
                }
            />
            {canChangeDistance && (
                <DistanceSettings
                    distance={circle.position.distance}
                    onChange={(distance) =>
                        dispatch(svgThunks.setCirclePosition(id, { distance }))
                    }
                />
            )}
            <AngleSettings
                unit={AngleUnit.Degree}
                angle={circle.position.angle}
                parentAngle={parentAngle}
                onChange={(angle) => {
                    dispatch(svgThunks.setCirclePosition(id, { angle }));
                }}
            />
        </>
    );
};

interface LineSlotSettingsProps {
    id: LineSlotId;
}

const LineSlotSettings: React.FC<LineSlotSettingsProps> = ({ id }) => {
    const dispatch = useAppDispatch();

    const lineSlot = useRedux((state) => state.svg.lineSlots[id]);

    const parentAngle = useRedux(
        (state) =>
            state.svg.circles[state.text.elements[id].parent].position.angle,
    );

    return (
        <AngleSettings
            unit={AngleUnit.Degree}
            angle={lineSlot.position.angle}
            parentAngle={parentAngle}
            onChange={(angle) =>
                dispatch(
                    svgActions.setLineSlotPosition({
                        id,
                        position: { angle },
                    }),
                )
            }
        />
    );
};

export default ElementSettings;
