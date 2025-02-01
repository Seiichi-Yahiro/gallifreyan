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

export type LetterId = IdGenerator<'LTR'>;
const letterCounter = createIdCounter('LTR');
export const letterId: () => LetterId = letterCounter.generator;

export type DotId = IdGenerator<'DOT'>;
const dotCounter = createIdCounter('DOT');
export const dotId: () => DotId = dotCounter.generator;

export type LineSlotId = IdGenerator<'LNS'>;
const lineSlotCounter = createIdCounter('LNS');
export const lineSlotId: () => LineSlotId = lineSlotCounter.generator;

export type TextElementId = SentenceId | WordId | LetterId | DotId | LineSlotId;

// For testing
export const resetIdCounters = () => {
    sentenceCounter.reset();
    wordCounter.reset();
    letterCounter.reset();
    dotCounter.reset();
    lineSlotCounter.reset();
};
