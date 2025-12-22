export const mapOptional =
    <Input, Output>(mapper: (value: Input) => Output) =>
    (value: Input | undefined): Output | undefined =>
        value === undefined ? undefined : mapper(value);
