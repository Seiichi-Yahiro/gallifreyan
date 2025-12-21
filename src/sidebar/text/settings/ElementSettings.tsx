import { AngleUnit } from '@/math/angle';
import { createReduxSelector, useAppDispatch, useRedux } from '@/redux/hooks';
import ids, {
    type LetterId,
    type LineSlotId,
    type SentenceId,
} from '@/redux/ids';
import { svgActions } from '@/redux/slices/svgSlice';
import { uiActions } from '@/redux/slices/uiSlice';
import dotThunks from '@/redux/thunks/dotThunks';
import historyThunks from '@/redux/thunks/historyThunks';
import letterThunks from '@/redux/thunks/letterThunks';
import wordThunks from '@/redux/thunks/wordThunks';
import { LetterPlacement, LetterType } from '@/redux/types/letterTypes';
import type { CircleId } from '@/redux/types/svgTypes';
import { isDigraphText } from '@/redux/utils/textAnalysis';
import AngleSettings from '@/sidebar/text/settings/AngleSettings';
import DistanceSettings from '@/sidebar/text/settings/DistanceSettings';
import RadiusSettings from '@/sidebar/text/settings/RadiusSettings';
import IconButton from '@/ui/IconButton';
import cn from '@/utils/cn';
import { partial } from 'es-toolkit';
import { Merge, Split, X } from 'lucide-react';
import React, { useMemo } from 'react';
import { match } from 'ts-pattern';

interface PositionInputProps {
    className?: string;
}

const ElementSettings: React.FC<PositionInputProps> = ({ className }) => {
    const selected = useRedux((state) => state.ui.selected);

    const dispatch = useAppDispatch();
    const deselect = () => {
        dispatch(uiActions.setSelection(null));
    };

    if (!selected || ids.sentence.is(selected)) {
        return null;
    }

    const id = 'element-settings';

    return (
        <section
            aria-labelledby={id}
            className={cn('relative flex flex-col gap-1', className)}
        >
            <div className="mb-1 flex flex-row items-center justify-between gap-1">
                <h2 id={id} className="font-semibold">
                    Settings
                </h2>
                <IconButton aria-label="Close settings" onClick={deselect}>
                    <X />
                </IconButton>
            </div>
            {ids.letter.is(selected) && <LetterSettings id={selected} />}
            {ids.lineSlot.is(selected) ? (
                <LineSlotSettings id={selected} />
            ) : (
                <CircleSettings id={selected} />
            )}
        </section>
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
                        dispatch(historyThunks.save());
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
                        dispatch(historyThunks.save());
                        dispatch(letterThunks.splitDigraph(id));
                    }}
                >
                    <Split />
                </IconButton>
            )}
            {canMergeWithNextToDigraph && (
                <IconButton
                    onClick={() => {
                        dispatch(historyThunks.save());
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
    id: Exclude<CircleId, SentenceId>;
}

const CircleSettings: React.FC<CircleSettingsProps> = ({ id }) => {
    const dispatch = useAppDispatch();

    const circle = useRedux((state) => state.svg.circles[id]);

    const parentAngle = useRedux((state) =>
        ids.dot.is(id)
            ? state.svg.circles[state.text.elements[id].parent].position.angle
            : undefined,
    );

    const canChangeDistance = useRedux(
        (state) =>
            !(
                ids.letter.is(id) &&
                state.text.elements[id].letter.placement ===
                    LetterPlacement.OnLine
            ),
    );

    const { setCircleRadius, setCirclePosition } = match(id)
        .when(ids.word.is, (wordId) => ({
            setCircleRadius: partial(wordThunks.setCircleRadius, wordId),
            setCirclePosition: partial(wordThunks.setCirclePosition, wordId),
        }))
        .when(ids.letter.is, (letterId) => ({
            setCircleRadius: partial(letterThunks.setCircleRadius, letterId),
            setCirclePosition: partial(
                letterThunks.setCirclePosition,
                letterId,
            ),
        }))
        .when(ids.dot.is, (dotId) => ({
            setCircleRadius: partial(dotThunks.setCircleRadius, dotId),
            setCirclePosition: partial(dotThunks.setCirclePosition, dotId),
        }))
        .exhaustive();

    return (
        <>
            <RadiusSettings
                radius={circle.radius}
                onPointerDown={() => {
                    dispatch(historyThunks.save());
                    dispatch(uiActions.setDragging(true));
                }}
                onChange={(radius) => {
                    dispatch(setCircleRadius(radius));
                }}
                onPointerUp={() => {
                    dispatch(uiActions.setDragging(false));
                }}
            />
            {canChangeDistance && (
                <DistanceSettings
                    distance={circle.position.distance}
                    onPointerDown={() => {
                        dispatch(historyThunks.save());
                        dispatch(uiActions.setDragging(true));
                    }}
                    onChange={(distance) => {
                        dispatch(setCirclePosition({ distance }));
                    }}
                    onPointerUp={() => {
                        dispatch(uiActions.setDragging(false));
                    }}
                />
            )}
            <AngleSettings
                unit={AngleUnit.Degree}
                angle={circle.position.angle}
                parentAngle={parentAngle}
                onPointerDown={() => {
                    dispatch(historyThunks.save());
                    dispatch(uiActions.setDragging(true));
                }}
                onChange={(angle) => {
                    dispatch(setCirclePosition({ angle }));
                }}
                onPointerUp={() => {
                    dispatch(uiActions.setDragging(false));
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
            onPointerDown={() => {
                dispatch(historyThunks.save());
            }}
            onChange={(angle) => {
                dispatch(
                    svgActions.setLineSlotPosition({
                        id,
                        position: { angle },
                    }),
                );
            }}
        />
    );
};

export default ElementSettings;
