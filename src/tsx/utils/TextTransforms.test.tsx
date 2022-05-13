import { range } from 'lodash';
import { Letter, VocalDecoration, VocalPlacement } from '../state/ImageTypes';
import {
    adjustAngle,
    calculateInitialDotPositionDatas,
    calculateInitialLetterPositionDatas,
    calculateInitialLineSlotPositionDatas,
    calculateInitialWordPositionDatas,
    calculateTranslation,
} from './TextTransforms';

describe('Text Transforms', () => {
    describe('Adjust angle', () => {
        it('should adjust an angle greater 360°', () => {
            const result = adjustAngle(360 + 90);
            expect(result).toBe(90);
        });

        it('should adjust an angle smaller -360°', () => {
            const result = adjustAngle(-360 - 90);
            expect(result).toBe(-90);
        });

        it('should adjust an angle greater 180°', () => {
            const result = adjustAngle(180 + 90);
            expect(result).toBe(-90);
        });

        it('should not adjust an angle smaller 180°', () => {
            const result = adjustAngle(90);
            expect(result).toBe(90);
        });
    });

    describe('Calculate translation', () => {
        it('should calculate translation from 0 angle', () => {
            const result = calculateTranslation(0, 10);
            expect(result.x).toBeCloseTo(0);
            expect(result.y).toBeCloseTo(10);
        });

        it('should calculate translation from 90 angle', () => {
            const result = calculateTranslation(90, 10);
            expect(result.x).toBeCloseTo(10);
            expect(result.y).toBeCloseTo(0);
        });

        it('should calculate translation from -90 angle', () => {
            const result = calculateTranslation(-90, 10);
            expect(result.x).toBeCloseTo(-10);
            expect(result.y).toBeCloseTo(0);
        });

        it('should calculate translation from 90 angle and negative parentDistance', () => {
            const result = calculateTranslation(90, -10);
            expect(result.x).toBeCloseTo(-10);
            expect(result.y).toBeCloseTo(0);
        });

        it('should calculate translation from -90 angle and negative parentDistance', () => {
            const result = calculateTranslation(-90, -10);
            expect(result.x).toBeCloseTo(10);
            expect(result.y).toBeCloseTo(0);
        });
    });

    describe('Initial position angles', () => {
        it('should have correct word angles', () => {
            const result = calculateInitialWordPositionDatas(10, 4).map((it) => it.angle);
            expect(result).toEqual([0, 90, 180, -90]);
        });

        it('should have correct letter angles', () => {
            const letters = range(4).map<Letter>(() => ({
                text: '',
                circleId: '',
                lineSlots: [],
                decoration: VocalDecoration.None,
                placement: VocalPlacement.OnLine,
            }));
            const result = calculateInitialLetterPositionDatas(letters, 10).map((it) => it.angle);
            expect(result).toEqual([0, 90, 180, -90]);
        });

        it('should have correct dot angles', () => {
            const result = calculateInitialDotPositionDatas(10, 0, 4).map((it) => it.angle);
            expect(result).toEqual([112.5, 157.5, -157.5, -112.5]);
        });

        it('should have correct line slot angles', () => {
            const result = calculateInitialLineSlotPositionDatas(10, 0, 4, false).map((it) => it.angle);
            expect(result).toEqual([112.5, 157.5, -157.5, -112.5]);
        });

        it('should have correct line slot angles pointing outside', () => {
            const result = calculateInitialLineSlotPositionDatas(10, 0, 4, true).map((it) => it.angle);
            expect(result).toEqual([-67.5, -22.5, 22.5, 67.5]);
        });
    });
});
