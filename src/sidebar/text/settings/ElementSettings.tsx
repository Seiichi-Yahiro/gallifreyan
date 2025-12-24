import { createReduxSelector, useAppDispatch, useRedux } from '@/redux/hooks';
import ids, {
    type LetterId,
    type LineSlotId,
    type SentenceId,
} from '@/redux/ids';
import { interactionActions } from '@/redux/slices/interactionSlice';
import historyThunks from '@/redux/thunks/historyThunks';
import letterThunks from '@/redux/thunks/letterThunks';
import { LetterPlacement, LetterType } from '@/redux/types/letterTypes';
import type { CircleId } from '@/redux/types/svgTypes';
import { isDigraphText } from '@/redux/utils/textAnalysis';
import AngleSettings from '@/sidebar/text/settings/AngleSettings';
import DistanceSettings from '@/sidebar/text/settings/DistanceSettings';
import RadiusSettings from '@/sidebar/text/settings/RadiusSettings';
import IconButton from '@/ui/IconButton';
import cn from '@/utils/cn';
import { Merge, Split, X } from 'lucide-react';
import React, { useMemo } from 'react';

interface PositionInputProps {
    className?: string;
}

const ElementSettings: React.FC<PositionInputProps> = ({ className }) => {
    const selected = useRedux((state) => state.interaction.selected);

    const dispatch = useAppDispatch();
    const deselect = () => {
        dispatch(interactionActions.setSelection(null));
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
    const canChangeDistance = useRedux(
        (state) =>
            !(
                ids.letter.is(id) &&
                state.text.elements[id].letter.placement ===
                    LetterPlacement.OnLine
            ),
    );

    return (
        <>
            <RadiusSettings id={id} />
            {canChangeDistance && <DistanceSettings id={id} />}
            <AngleSettings id={id} />
        </>
    );
};

interface LineSlotSettingsProps {
    id: LineSlotId;
}

const LineSlotSettings: React.FC<LineSlotSettingsProps> = ({ id }) => {
    return <AngleSettings id={id} />;
};

export default ElementSettings;
