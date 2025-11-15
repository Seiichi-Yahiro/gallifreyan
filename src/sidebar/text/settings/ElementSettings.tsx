import { useAppDispatch, useRedux } from '@/redux/hooks';
import type { CircleId } from '@/redux/svg/svgTypes';
import {
    type ConsonantId,
    isConsonantId,
    isDotId,
    isLetterId,
    isLineSlotId,
    type LetterId,
    type LineSlotId,
} from '@/redux/text/ids';
import { LetterType } from '@/redux/text/letterTypes';
import textThunks from '@/redux/text/textThunks';
import { isDigraphText } from '@/redux/text/textUtils';
import AngleSettings from '@/sidebar/text/settings/AngleSettings';
import DistanceSettings from '@/sidebar/text/settings/DistanceSettings';
import RadiusSettings from '@/sidebar/text/settings/RadiusSettings';
import IconButton from '@/ui/IconButton';
import cn from '@/utils/cn';
import { isEqual } from 'lodash';
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

interface LetterSettingsProps {
    id: LetterId;
}

const LetterSettings: React.FC<LetterSettingsProps> = ({ id }) => {
    const [prevId, nextId] = useRedux(
        (state): [LetterId | undefined, LetterId | undefined] => {
            const letter = state.main.text.elements[id];
            const parent = state.main.text.elements[letter.parent];
            const index = parent.letters.findIndex(
                (letterId) => letterId === id,
            );

            let prevId;
            let nextId;

            if (index - 1 >= 0) {
                prevId = parent.letters[index - 1];
            }

            if (index + 1 < parent.letters.length) {
                nextId = parent.letters[index + 1];
            }

            return [prevId, nextId];
        },
        isEqual,
    );

    return (
        <div className="flex flex-row gap-1 empty:hidden">
            {isConsonantId(id) && (
                <ConsonantSettings id={id} prevId={prevId} nextId={nextId} />
            )}
        </div>
    );
};

interface ConsonantSettingsProps {
    prevId?: LetterId;
    id: ConsonantId;
    nextId?: LetterId;
}

const ConsonantSettings: React.FC<ConsonantSettingsProps> = ({
    prevId,
    id,
    nextId,
}) => {
    const dispatch = useAppDispatch();

    const isDigraph = useRedux(
        (state) =>
            state.main.text.elements[id].letter.letterType ===
            LetterType.Digraph,
    );

    const [prevText, text, nextText] = useRedux((state) => {
        const prevText = prevId ? state.main.text.elements[prevId].text : '';
        const text = state.main.text.elements[id].text;
        const nextText = nextId ? state.main.text.elements[nextId].text : '';
        return [prevText, text, nextText];
    }, isEqual);

    const canMergeWithPrevToDigraph = useMemo(
        () => !isDigraph && isDigraphText(prevText + text),
        [isDigraph, prevText, text],
    );

    const canMergeWithNextToDigraph = useMemo(
        () => !isDigraph && isDigraphText(text + nextText),
        [isDigraph, nextText, text],
    );

    return (
        <>
            {canMergeWithPrevToDigraph && (
                <IconButton
                    onClick={() => {
                        dispatch(
                            textThunks.mergeToDigraph(
                                prevId as ConsonantId,
                                id,
                            ),
                        );
                    }}
                >
                    <Merge className="-rotate-90" />
                </IconButton>
            )}
            {isDigraph && (
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
                            textThunks.mergeToDigraph(id, nextId as LetterId),
                        );
                    }}
                >
                    <Merge className="rotate-90" />
                </IconButton>
            )}
        </>
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
