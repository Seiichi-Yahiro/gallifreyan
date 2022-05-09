import React from 'react';
import { render } from '../utils/TestUtils';
import Group, { hoverColor, selectedColor } from './Group';

describe('SVG Group', () => {
    it('should use selected color when selected and not hovered', () => {
        const { container } = render(
            <svg>
                <Group x={0} y={0} isSelected={true} isHovered={false} />
            </svg>
        );

        const group = container.querySelector('g')!;
        expect(group.getAttribute('stroke')).toBe(selectedColor);
        expect(group.getAttribute('fill')).toBe(selectedColor);
    });

    it('should use selected color when selected and hovered', () => {
        const { container } = render(
            <svg>
                <Group x={0} y={0} isSelected={true} isHovered={true} />
            </svg>
        );

        const group = container.querySelector('g')!;
        expect(group.getAttribute('stroke')).toBe(selectedColor);
        expect(group.getAttribute('fill')).toBe(selectedColor);
    });

    it('should use hovered color when hovered and not selected', () => {
        const { container } = render(
            <svg>
                <Group x={0} y={0} isSelected={false} isHovered={true} />
            </svg>
        );

        const group = container.querySelector('g')!;
        expect(group.getAttribute('stroke')).toBe(hoverColor);
        expect(group.getAttribute('fill')).toBe(hoverColor);
    });

    it('should inherit color when not hovered and not selected', () => {
        const { container } = render(
            <svg>
                <Group x={0} y={0} isSelected={false} isHovered={false} />
            </svg>
        );

        const group = container.querySelector('g')!;
        expect(group.getAttribute('stroke')).toBe('inherit');
        expect(group.getAttribute('fill')).toBe('inherit');
    });
});