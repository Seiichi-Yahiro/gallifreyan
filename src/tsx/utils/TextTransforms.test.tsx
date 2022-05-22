import { range } from 'lodash';
import { CircleType, ConsonantPlacement, Letter, VocalDecoration, VocalPlacement } from '../state/ImageTypes';
import {
    adjustAngle,
    calculateInitialDotCircleData,
    calculateInitialLetterCircleData,
    calculateInitialLineSlotPositionData,
    calculateInitialNestedVocalCircleData,
    calculateInitialWordCircleData,
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
            expect(result).toBe(270);
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

        it('should calculate translation from 90 angle and negative distance', () => {
            const result = calculateTranslation(90, -10);
            expect(result.x).toBeCloseTo(-10);
            expect(result.y).toBeCloseTo(0);
        });

        it('should calculate translation from -90 angle and negative distance', () => {
            const result = calculateTranslation(-90, -10);
            expect(result.x).toBeCloseTo(10);
            expect(result.y).toBeCloseTo(0);
        });
    });

    describe('Initial position angles', () => {
        it('should have correct word angles', () => {
            const result = calculateInitialWordCircleData(10, 4).map((it) => it.angle);
            expect(result).toEqual([0, 90, 180, 270]);
        });

        it('should have correct letter angles', () => {
            const letters = range(4).map<Letter>(() => ({
                id: '',
                parentId: '',
                text: '',
                type: CircleType.Vocal,
                circle: {
                    angle: 0,
                    distance: 0,
                    r: 0,
                },
                lineSlots: [],
                decoration: VocalDecoration.None,
                placement: VocalPlacement.OnLine,
            }));
            const result = calculateInitialLetterCircleData(letters, 10).map((it) => it.angle);
            expect(result).toEqual([0, 90, 180, 270]);
        });

        describe('Nested Vocal', () => {
            const consonantPlacements = [
                ConsonantPlacement.DeepCut,
                ConsonantPlacement.Inside,
                ConsonantPlacement.ShallowCut,
                ConsonantPlacement.OnLine,
            ];

            [VocalPlacement.Outside, VocalPlacement.OnLine]
                .flatMap((vocalPlacement) =>
                    consonantPlacements.map<[VocalPlacement, ConsonantPlacement]>((consonantPlacement) => [
                        vocalPlacement,
                        consonantPlacement,
                    ])
                )
                .forEach(([vocalPlacement, consonantPlacement]) => {
                    it(`should have angle of 0 for vocal: ${vocalPlacement}, consonant: ${consonantPlacement}`, () => {
                        const result = calculateInitialNestedVocalCircleData(
                            vocalPlacement,
                            consonantPlacement,
                            { angle: 90, distance: 10, r: 10 },
                            100
                        ).angle;
                        expect(result).toBe(0);
                    });
                });

            consonantPlacements
                .map<[VocalPlacement, ConsonantPlacement]>((consonantPlacement) => [
                    VocalPlacement.Inside,
                    consonantPlacement,
                ])
                .forEach(([vocalPlacement, consonantPlacement]) => {
                    it(`should have angle of 180 for vocal: ${vocalPlacement}, consonant: ${consonantPlacement}`, () => {
                        const result = calculateInitialNestedVocalCircleData(
                            vocalPlacement,
                            consonantPlacement,
                            { angle: 90, distance: 10, r: 10 },
                            100
                        ).angle;
                        expect(result).toBe(180);
                    });
                });
        });

        it('should have correct dot angles', () => {
            const result = calculateInitialDotCircleData(10, 4).map((it) => it.angle);
            expect(result).toEqual([112.5, 157.5, 202.5, 247.5]);
        });

        it('should have correct line slot angles', () => {
            const result = calculateInitialLineSlotPositionData(10, 4, false).map((it) => it.angle);
            expect(result).toEqual([112.5, 157.5, 202.5, 247.5]);
        });

        it('should have correct line slot angles pointing outside', () => {
            const result = calculateInitialLineSlotPositionData(10, 4, true).map((it) => it.angle);
            expect(result).toEqual([292.5, 337.5, 22.5, 67.5]);
        });
    });
});
