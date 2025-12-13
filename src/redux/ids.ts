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
export const isSentenceId = (id: TextElementId): id is SentenceId =>
    id.startsWith('SNT');

export type WordId = IdGenerator<'WRD'>;
const wordCounter = createIdCounter('WRD');
export const wordId: () => WordId = wordCounter.generator;
export const isWordId = (id: TextElementId): id is WordId =>
    id.startsWith('WRD');

export type LetterId = IdGenerator<'LTR'>;
const letterCounter = createIdCounter('LTR');
export const letterId: () => LetterId = letterCounter.generator;
export const isLetterId = (id: TextElementId): id is LetterId =>
    id.startsWith('LTR');

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
