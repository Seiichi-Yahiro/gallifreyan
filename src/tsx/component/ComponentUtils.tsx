export interface IClassNameDictionary {
    [key: string]: boolean | undefined;
}

/**
 * Create a single className string out of multiple classNames
 *
 * @param {string | IClassNameDictionary} classNames - classNames as either a simple string or as key value pairs where
 * the boolean-value defines if the className should be included e.g. ({'myClass': true})
 * @return {string} - the className
 */
export const createClassName = (
    ...classNames: Array<string | undefined | IClassNameDictionary>
) =>
    classNames
        .map(className => {
            if (typeof className === 'object') {
                return Object.keys(className)
                    .filter(key => className[key])
                    .join(' ');
            }
            return className;
        })
        .filter(className => className && className.length)
        .join(' ');
