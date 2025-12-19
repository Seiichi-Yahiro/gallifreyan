import { useRedux } from '@/redux/hooks';
import type { WordId } from '@/redux/ids';
import { antiArcsToArcs } from '@/redux/utils/svgUtils';
import SvgArc from '@/svg/SvgArc';
import SvgCircle from '@/svg/SvgCircle';
import SvgGroup from '@/svg/SvgGroup';
import SvgLetter from '@/svg/SvgLetter';
import useSvgDragAndDrop from '@/svg/useSvgDragAndDrop';
import useHover from '@/utils/useHover';
import useSelect from '@/utils/useSelect';
import { isNotNil } from 'es-toolkit';
import React, { useMemo } from 'react';

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
    const { onPointerDown } = useSvgDragAndDrop(id);

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
                        onPointerDown={isSelected ? onPointerDown : undefined}
                    />
                </>
            ) : (
                <SvgCircle
                    radius={circle.radius}
                    className="word"
                    onMouseEnter={onHover}
                    onMouseLeave={onHoverStop}
                    onClick={onSelect}
                    onPointerDown={isSelected ? onPointerDown : undefined}
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

export default SvgWord;
