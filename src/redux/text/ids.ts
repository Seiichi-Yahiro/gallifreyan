type IdGenerator<Prefix extends string> = `${Prefix}-${number}`;

const createIdCounter = <Prefix extends string>(prefix: Prefix) => {
    let counter = 0;

    const generator = (): IdGenerator<Prefix> => `${prefix}-${counter++}`;

    const reset = () => {
        counter = 0;
    };

    return { generator, reset };
};

export type SentenceId = IdGenerator<'SNT'>;
const sentenceCounter = createIdCounter('SNT');
export const sentenceId: () => SentenceId = sentenceCounter.generator;

export type WordId = IdGenerator<'WRD'>;
const wordCounter = createIdCounter('WRD');
export const wordId: () => WordId = wordCounter.generator;

const letterCounter = createIdCounter('LTR');

export type ConsonantId = IdGenerator<'CON'>;
export const consonantId = (): ConsonantId =>
    letterCounter.generator().replace('LTR', 'CON') as ConsonantId;
export const isConsonantId = (id: TextElementId): id is ConsonantId =>
    id.startsWith('CON');

export type VocalId = IdGenerator<'VOC'>;
export const vocalId = (): VocalId =>
    letterCounter.generator().replace('LTR', 'VOC') as VocalId;
export const isVocalId = (id: TextElementId): id is VocalId =>
    id.startsWith('VOC');

export type LetterId = ConsonantId | VocalId;
export const isLetterId = (id: TextElementId): id is LetterId =>
    isConsonantId(id) || isVocalId(id);

export const convertConsonantIdToVocalId = (id: ConsonantId): VocalId =>
    id.replace('CON', 'VOC') as VocalId;

export const convertVocalIdToConsonantId = (id: VocalId): ConsonantId =>
    id.replace('VOC', 'CON') as ConsonantId;

export type DotId = IdGenerator<'DOT'>;
const dotCounter = createIdCounter('DOT');
export const dotId: () => DotId = dotCounter.generator;
export const isDotId = (id: TextElementId): id is DotId => id.startsWith('DOT');

export type LineSlotId = IdGenerator<'LNS'>;
const lineSlotCounter = createIdCounter('LNS');
export const lineSlotId: () => LineSlotId = lineSlotCounter.generator;
export const isLineSlotId = (id: TextElementId): id is LineSlotId =>
    id.startsWith('LNS');

export type TextElementId = SentenceId | WordId | LetterId | DotId | LineSlotId;

// For testing
export const resetIdCounters = () => {
    sentenceCounter.reset();
    wordCounter.reset();
    letterCounter.reset();
    dotCounter.reset();
    lineSlotCounter.reset();
};
