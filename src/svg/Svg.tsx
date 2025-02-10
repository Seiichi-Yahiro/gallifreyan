import { CircleIntersectionType } from '@/math/circle';
import { useAppDispatch, useRedux } from '@/redux/hooks';
import svgActions from '@/redux/svg/svgActions';
import type {
    DotId,
    LetterId,
    LineSlotId,
    SentenceId,
    WordId,
} from '@/redux/text/ids';
import SvgArc from '@/svg/SvgArc';
import SvgCircle from '@/svg/SvgCircle';
import SvgGroup from '@/svg/SvgGroup';
import useHover from '@/svg/useHover';
import useSelect from '@/svg/useSelect';
import React, { useCallback } from 'react';
import './Svg.css';

const Svg: React.FC = () => {
    const dispatch = useAppDispatch();
    const deselect = useCallback(() => {
        dispatch(svgActions.setSelection(null));
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
                strokeLinecap: 'round',
                strokeWidth: 1,
                stroke: 'currentColor',
                fill: 'currentColor',
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
            isHovered={isHovered}
            isSelected={isSelected}
        >
            <SvgCircle
                radius={circle.radius}
                className="sentence"
                onMouseEnter={onHover}
                onMouseLeave={onHoverStop}
                onClick={onSelect}
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
            isHovered={isHovered}
            isSelected={isSelected}
        >
            {circle.intersections.length > 0 ? (
                <>
                    <SvgArc
                        radius={circle.radius}
                        arcs={circle.arcs}
                        className="word"
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
            isHovered={isHovered}
            isSelected={isSelected}
        >
            {circle.intersections.type === CircleIntersectionType.Two ? (
                <SvgArc
                    radius={circle.radius}
                    arcs={circle.intersections.values}
                    className="letter"
                    onMouseEnter={onHover}
                    onMouseLeave={onHoverStop}
                    onClick={onSelect}
                />
            ) : (
                <SvgCircle
                    radius={circle.radius}
                    className="letter"
                    onMouseEnter={onHover}
                    onMouseLeave={onHoverStop}
                    onClick={onSelect}
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
            isHovered={isHovered}
            isSelected={isSelected}
        >
            <SvgCircle
                radius={circle.radius}
                filled={true}
                className="dot"
                onMouseEnter={onHover}
                onMouseLeave={onHoverStop}
                onClick={onSelect}
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
            isHovered={isHovered}
            isSelected={isSelected}
        >
            <line
                x1={0}
                y1={0}
                x2={0}
                y2={20}
                stroke="inherit"
                className="transition-colors--not-print"
            />
            <circle
                cx={0}
                cy={0}
                r={8}
                className="transition-colors--not-print"
                fill="transparent"
                stroke={isHovered || isSelected ? 'inherit' : 'transparent'}
                onMouseEnter={onHover}
                onMouseLeave={onHoverStop}
                onClick={onSelect}
            />
        </SvgGroup>
    );
};

export default React.memo(Svg);
