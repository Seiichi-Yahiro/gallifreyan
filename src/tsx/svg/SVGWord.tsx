import React, { useRef } from 'react';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { useRedux } from '../hooks/useRedux';
import { dragWord } from '../state/image/ImageThunks';
import { ConsonantPlacement, ImageType, Letter, UUID, Word } from '../state/image/ImageTypes';
import { useCircleSelector } from '../state/Selectors';
import { selectWord } from '../state/work/WorkThunks';
import AngleConstraints from './AngleConstraints';
import Group, { AnglePlacement } from './Group';
import { SVGCircle } from './SVGCircle';
import SVGLetter, { SVGConsonantCutMask } from './SVGLetter';

interface WordProps {
    id: UUID;
}

const SVGWord: React.FunctionComponent<WordProps> = ({ id }) => {
    const { circle: word, isSelected, isHovered } = useCircleSelector<Word>(id);
    const wordRef = useRef<SVGCircleElement>(null);

    useDragAndDrop(id, wordRef.current, dragWord);

    return (
        <Group
            angle={word.circle.angle}
            distance={word.circle.distance}
            anglePlacement={AnglePlacement.Absolute}
            isHovered={isHovered}
            isSelected={isSelected}
            className="group-word"
        >
            <AngleConstraints radius={word.circle.r} renderFor={word.letters} />
            <mask id={`mask_${id}`}>
                <circle r={word.circle.r} fill="#000000" stroke="#ffffff" />
                {word.letters.map((letterId) => (
                    <SVGLetterCutMask key={letterId} id={letterId} />
                ))}
            </mask>
            <SVGCircle
                id={id}
                select={selectWord}
                ref={wordRef}
                r={word.circle.r}
                lineSlots={word.lineSlots}
                filled={false}
                fill="transparent"
                stroke="inherit"
                mask={`url(#mask_${id})`}
            />
            {word.letters.map((letterId) => (
                <SVGLetter key={letterId} id={letterId} />
            ))}
        </Group>
    );
};

interface SVGLetterCutMaskProps {
    id: UUID;
}

const SVGLetterCutMask: React.FunctionComponent<SVGLetterCutMaskProps> = ({ id }) => {
    const consonant = useRedux((state) => state.image.circles[id]) as Letter;

    if (
        consonant.type === ImageType.Consonant &&
        [ConsonantPlacement.DeepCut, ConsonantPlacement.ShallowCut].includes(consonant.placement)
    ) {
        return <SVGConsonantCutMask circle={consonant.circle} fill="#000000" stroke="#000000" />;
    } else {
        return null;
    }
};

export default React.memo(SVGWord);
