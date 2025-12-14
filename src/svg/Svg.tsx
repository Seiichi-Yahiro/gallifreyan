import { useRedux } from '@/redux/hooks';
import type {
    DotId,
    LetterId,
    LineSlotId,
    SentenceId,
    WordId,
} from '@/redux/ids';
import { antiArcsToArcs } from '@/redux/utils/svgUtils';
import SvgArc from '@/svg/SvgArc';
import SvgCircle from '@/svg/SvgCircle';
import SvgGroup from '@/svg/SvgGroup';
import useDragAndDrop from '@/svg/useDragAndDrop';
import useHover from '@/svg/useHover';
import useSelect from '@/svg/useSelect';
import cn from '@/utils/cn';
import { isNotNil } from 'es-toolkit';
import React, { useMemo } from 'react';
import './Svg.css';

const Svg: React.FC = () => {
    const svgSize = useRedux((state) => state.svg.size);
    const sentenceId = useRedux((state) => state.text.rootElement);

    return (
        <svg
            id="gallifreyan"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                width: '100%',
                height: '100%',
                touchAction: 'pinch-zoom',
            }}
            viewBox={`-${svgSize / 2} -${svgSize / 2} ${svgSize} ${svgSize}`}
        >
            {sentenceId && <SvgSentence id={sentenceId} />}
        </svg>
    );
};

interface SvgSentenceProps {
    id: SentenceId;
}

const SvgSentence: React.FC<SvgSentenceProps> = ({ id }) => {
    const words = useRedux((state) => state.text.elements[id].words);

    const circle = useRedux((state) => state.svg.circles[id]);

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
    const letters = useRedux((state) => state.text.elements[id].letters);

    const circle = useRedux((state) => state.svg.circles[id]);

    const arcs = useMemo(() => {
        const antiArcs = Object.values(circle.antiArcs)
            .filter(isNotNil)
            .sort((a, b) => a.end.value - b.end.value);

        return antiArcsToArcs(antiArcs);
    }, [circle.antiArcs]);

    const { isHovered, onHover, onHoverStop } = useHover(id);
    const { isSelected, onSelect } = useSelect(id);
    const startDragging = useDragAndDrop(id);

    return (
        <SvgGroup
            distance={circle.position.distance}
            angle={circle.position.angle}
            rotateInParent={false}
        >
            {arcs.length > 0 ? (
                <>
                    <SvgArc
                        radius={circle.radius}
                        arcs={arcs}
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
                        onPointerDown={startDragging}
                    />
                </>
            ) : (
                <SvgCircle
                    radius={circle.radius}
                    className="word"
                    onMouseEnter={onHover}
                    onMouseLeave={onHoverStop}
                    onClick={onSelect}
                    onPointerDown={startDragging}
                    isHovered={isHovered}
                    isSelected={isSelected}
                />
            )}
            {letters.map((letterId) => (
                <SvgLetter key={letterId} id={letterId} />
            ))}
        </SvgGroup>
    );
};

interface SvgLetterProps {
    id: LetterId;
}

const SvgLetter: React.FC<SvgLetterProps> = ({ id }) => {
    const dots = useRedux((state) => state.text.elements[id].dots);

    const lineSlots = useRedux((state) => state.text.elements[id].lineSlots);

    const circle = useRedux((state) => state.svg.circles[id]);

    const { isHovered, onHover, onHoverStop } = useHover(id);
    const { isSelected, onSelect } = useSelect(id);
    const startDragging = useDragAndDrop(id);

    return (
        <SvgGroup
            distance={circle.position.distance}
            angle={circle.position.angle}
            rotateInParent={true}
        >
            {circle.arc ? (
                <SvgArc
                    radius={circle.radius}
                    arcs={[circle.arc]}
                    className="letter"
                    onMouseEnter={onHover}
                    onMouseLeave={onHoverStop}
                    onClick={onSelect}
                    onPointerDown={startDragging}
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
                    onPointerDown={startDragging}
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
    const circle = useRedux((state) => state.svg.circles[id]);

    const { isHovered, onHover, onHoverStop } = useHover(id);
    const { isSelected, onSelect } = useSelect(id);
    const startDragging = useDragAndDrop(id);

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
                onPointerDown={startDragging}
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
    const lineSlot = useRedux((state) => state.svg.lineSlots[id]);

    const { isHovered, onHover, onHoverStop } = useHover(id);
    const { isSelected, onSelect } = useSelect(id);
    const startDragging = useDragAndDrop(id);

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
                onPointerDown={startDragging}
            />
        </SvgGroup>
    );
};

export default Svg;
