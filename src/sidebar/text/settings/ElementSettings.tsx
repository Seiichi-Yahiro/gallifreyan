import { useAppDispatch, useRedux } from '@/redux/hooks';
import type { CircleId } from '@/redux/svg/svgTypes';
import {
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
import React from 'react';

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
    const dispatch = useAppDispatch();

    const { prevId, nextId, isDigraph } = useRedux((state) => {
        const letter = state.main.text.elements[id];

        let prevId = null;
        let nextId = null;

        if (letter.letter.letterType === LetterType.Digraph) {
            return { prevId, nextId, isDigraph: true };
        }

        const parent = state.main.text.elements[letter.parent];
        const index = parent.letters.findIndex((letterId) => letterId === id);

        if (index - 1 >= 0) {
            const localPrevId = parent.letters[index - 1];
            const prevText = state.main.text.elements[localPrevId].text;
            if (isDigraphText(prevText + letter.text)) {
                prevId = localPrevId;
            }
        }

        if (index + 1 < parent.letters.length) {
            const localNextId = parent.letters[index + 1];
            const nextText = state.main.text.elements[localNextId].text;
            if (isDigraphText(letter.text + nextText)) {
                nextId = localNextId;
            }
        }

        return { prevId, nextId, isDigraph: false };
    }, isEqual);

    return (
        <div className="flex flex-row gap-1 empty:hidden">
            {prevId && (
                <IconButton
                    onClick={() => {
                        dispatch(textThunks.mergeToDigraph(prevId, id));
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
            {nextId && (
                <IconButton
                    onClick={() => {
                        dispatch(textThunks.mergeToDigraph(id, nextId));
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

export default React.memo(ElementSettings);
