import { CircleIntersectionType } from '@/math/circle';
import actions from '@/redux/actions';
import { useAppDispatch, useRedux } from '@/redux/hooks';
import {
    type ConsonantId,
    type DotId,
    isAttachedVocalGroupId,
    isConsonantId,
    isDoubleConsonantGroupId,
    isDoubleVocalGroupId,
    isStackedConsonantGroupId,
    isVocalId,
    type LineSlotId,
    type SentenceId,
    type VocalId,
    type WordId,
} from '@/redux/text/ids';
import SvgArc from '@/svg/SvgArc';
import SvgCircle from '@/svg/SvgCircle';
import SvgGroup from '@/svg/SvgGroup';
import useHover from '@/svg/useHover';
import useSelect from '@/svg/useSelect';
import cn from '@/utils/cn';
import React, { useCallback } from 'react';
import { match } from 'ts-pattern';
import './Svg.css';

const Svg: React.FC = () => {
    const dispatch = useAppDispatch();
    const deselect = useCallback(() => {
        dispatch(actions.setSelection(null));
    }, [dispatch]);

    const svgSize = useRedux((state) => state.main.svg.size);
    const sentenceId = useRedux((state) => state.main.text.rootElement);

    return (
        <svg
            id="gallifreyan"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                width: '100%',
                height: '100%',
            }}
            viewBox={`-${svgSize / 2} -${svgSize / 2} ${svgSize} ${svgSize}`}
            onClick={deselect}
        >
            {sentenceId && <SvgSentence id={sentenceId} />}
        </svg>
    );
};

interface SvgSentenceProps {
    id: SentenceId;
}

const SvgSentence: React.FC<SvgSentenceProps> = ({ id }) => {
    const words = useRedux((state) => state.main.text.elements[id].words);

    const circle = useRedux((state) => state.main.svg.circles[id]);

    const { isHovered, onHover, onHoverStop } = useHover(id);
    const { isSelected, onSelect } = useSelect(id);

    return (
        <SvgGroup
            distance={circle.position.distance}
            angle={circle.position.angle}
            rotateInParent={false}
        >
            <circle
                cx={0}
                cy={0}
                r={circle.radius + 10}
                className="sentence__outer"
            />
            <SvgCircle
                radius={circle.radius}
                className="sentence__inner"
                onMouseEnter={onHover}
                onMouseLeave={onHoverStop}
                onClick={onSelect}
                isHovered={isHovered}
                isSelected={isSelected}
            />
            {words.map((wordId) => (
                <SvgWord key={wordId} id={wordId} />
            ))}
        </SvgGroup>
    );
};

interface SvgWordProps {
    id: WordId;
}

const SvgWord: React.FC<SvgWordProps> = ({ id }) => {
    const letters = useRedux((state) => state.main.text.elements[id].letters);

    const circle = useRedux((state) => state.main.svg.circles[id]);

    const { isHovered, onHover, onHoverStop } = useHover(id);
    const { isSelected, onSelect } = useSelect(id);

    return (
        <SvgGroup
            distance={circle.position.distance}
            angle={circle.position.angle}
            rotateInParent={false}
        >
            {circle.intersections.length > 0 ? (
                <>
                    <SvgArc
                        radius={circle.radius}
                        arcs={circle.arcs}
                        className="word"
                        isHovered={isHovered}
                        isSelected={isSelected}
                    />
                    <circle // hover does not work with arc directly because it is not a full circle
                        cx={0}
                        cy={0}
                        r={circle.radius}
                        fill="transparent"
                        stroke="transparent"
                        className="print:hidden"
                        onMouseEnter={onHover}
                        onMouseLeave={onHoverStop}
                        onClick={onSelect}
                    />
                </>
            ) : (
                <SvgCircle
                    radius={circle.radius}
                    className="word"
                    onMouseEnter={onHover}
                    onMouseLeave={onHoverStop}
                    onClick={onSelect}
                    isHovered={isHovered}
                    isSelected={isSelected}
                />
            )}
            {letters.map((letterId) =>
                match(letterId)
                    .when(isVocalId, (vocalId) => (
                        <SvgVocal key={vocalId.slice(4)} id={vocalId} />
                    ))
                    .when(isConsonantId, (consonantId) => (
                        <SvgConsonant
                            key={consonantId.slice(4)}
                            id={consonantId}
                        />
                    ))
                    .when(isDoubleVocalGroupId, (_groupId) => {
                        // TODO
                        return null;
                    })
                    .when(isDoubleConsonantGroupId, (_groupId) => {
                        // TODO
                        return null;
                    })
                    .when(isStackedConsonantGroupId, (_groupId) => {
                        // TODO
                        return null;
                    })
                    .when(isAttachedVocalGroupId, (_groupId) => {
                        // TODO
                        return null;
                    })
                    .exhaustive(),
            )}
        </SvgGroup>
    );
};

interface SvgVocalProps {
    id: VocalId;
}

const SvgVocal: React.FC<SvgVocalProps> = ({ id }) => {
    const lineSlots = useRedux(
        (state) => state.main.text.elements[id].lineSlots,
    );

    const circle = useRedux((state) => state.main.svg.circles[id]);

    const { isHovered, onHover, onHoverStop } = useHover(id);
    const { isSelected, onSelect } = useSelect(id);

    return (
        <SvgGroup
            distance={circle.position.distance}
            angle={circle.position.angle}
            rotateInParent={true}
        >
            <SvgCircle
                radius={circle.radius}
                className="letter"
                onMouseEnter={onHover}
                onMouseLeave={onHoverStop}
                onClick={onSelect}
                isHovered={isHovered}
                isSelected={isSelected}
            />
            {lineSlots.map((lineSlotId) => (
                <SvgLineSlot key={lineSlotId} id={lineSlotId} />
            ))}
        </SvgGroup>
    );
};

interface SvgConsonantProps {
    id: ConsonantId;
}

const SvgConsonant: React.FC<SvgConsonantProps> = ({ id }) => {
    const dots = useRedux((state) => state.main.text.elements[id].dots);

    const lineSlots = useRedux(
        (state) => state.main.text.elements[id].lineSlots,
    );

    const circle = useRedux((state) => state.main.svg.circles[id]);

    const { isHovered, onHover, onHoverStop } = useHover(id);
    const { isSelected, onSelect } = useSelect(id);

    return (
        <SvgGroup
            distance={circle.position.distance}
            angle={circle.position.angle}
            rotateInParent={true}
        >
            {circle.intersections.type === CircleIntersectionType.Two ? (
                <SvgArc
                    radius={circle.radius}
                    arcs={circle.intersections.values}
                    className="letter"
                    onMouseEnter={onHover}
                    onMouseLeave={onHoverStop}
                    onClick={onSelect}
                    isHovered={isHovered}
                    isSelected={isSelected}
                />
            ) : (
                <SvgCircle
                    radius={circle.radius}
                    className="letter"
                    onMouseEnter={onHover}
                    onMouseLeave={onHoverStop}
                    onClick={onSelect}
                    isHovered={isHovered}
                    isSelected={isSelected}
                />
            )}
            {dots.map((dotId) => (
                <SvgDot key={dotId} id={dotId} />
            ))}
            {lineSlots.map((lineSlotId) => (
                <SvgLineSlot key={lineSlotId} id={lineSlotId} />
            ))}
        </SvgGroup>
    );
};

interface SvgDotProps {
    id: DotId;
}

const SvgDot: React.FC<SvgDotProps> = ({ id }) => {
    const circle = useRedux((state) => state.main.svg.circles[id]);

    const { isHovered, onHover, onHoverStop } = useHover(id);
    const { isSelected, onSelect } = useSelect(id);

    return (
        <SvgGroup
            distance={circle.position.distance}
            angle={circle.position.angle}
            rotateInParent={false}
        >
            <SvgCircle
                radius={circle.radius}
                filled={true}
                className="dot"
                onMouseEnter={onHover}
                onMouseLeave={onHoverStop}
                onClick={onSelect}
                isHovered={isHovered}
                isSelected={isSelected}
            />
        </SvgGroup>
    );
};

interface SvgLineSlotProps {
    id: LineSlotId;
}

const SvgLineSlot: React.FC<SvgLineSlotProps> = ({ id }) => {
    const lineSlot = useRedux((state) => state.main.svg.lineSlots[id]);

    const { isHovered, onHover, onHoverStop } = useHover(id);
    const { isSelected, onSelect } = useSelect(id);

    return (
        <SvgGroup
            distance={lineSlot.position.distance}
            angle={lineSlot.position.angle}
            rotateInParent={true}
            className="print:hidden"
        >
            <line
                x1={0}
                y1={0}
                x2={0}
                y2={20}
                className="transition-colors--not-print line-slot"
            />
            <circle
                cx={0}
                cy={0}
                r={8}
                className={cn('transition-colors--not-print', {
                    'hovered__stroke--not-print': isHovered,
                    'selected__stroke--not-print': isSelected,
                })}
                fill="transparent"
                onMouseEnter={onHover}
                onMouseLeave={onHoverStop}
                onClick={onSelect}
            />
        </SvgGroup>
    );
};

export default React.memo(Svg);
