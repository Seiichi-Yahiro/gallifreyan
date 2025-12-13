const ID_PREFIXES = {
    sentence: 'SNT',
    word: 'WRD',
    letter: 'LTR',
    dot: 'DOT',
    lineSlot: 'LNS',
} as const;

type IdPrefix = (typeof ID_PREFIXES)[keyof typeof ID_PREFIXES];

type IdType<Prefix extends IdPrefix> = `${Prefix}-${number}`;

const createIdFunctions = <Prefix extends IdPrefix>(prefix: Prefix) => {
    let counter = 0;

    return {
        create: (): IdType<Prefix> => `${prefix}-${counter++}`,
        reset: () => {
            counter = 0;
        },
        is: (id: IdType<IdPrefix>): id is IdType<Prefix> =>
            id.startsWith(prefix),
    };
};

export type SentenceId = IdType<typeof ID_PREFIXES.sentence>;
export type WordId = IdType<typeof ID_PREFIXES.word>;
export type LetterId = IdType<typeof ID_PREFIXES.letter>;
export type DotId = IdType<typeof ID_PREFIXES.dot>;
export type LineSlotId = IdType<typeof ID_PREFIXES.lineSlot>;

const ids = {
    sentence: createIdFunctions(ID_PREFIXES.sentence),
    word: createIdFunctions(ID_PREFIXES.word),
    letter: createIdFunctions(ID_PREFIXES.letter),
    dot: createIdFunctions(ID_PREFIXES.dot),
    lineSlot: createIdFunctions(ID_PREFIXES.lineSlot),
};

export const resetIdCounters = () => {
    Object.values(ids).forEach((obj) => {
        obj.reset();
    });
};

export default ids;
