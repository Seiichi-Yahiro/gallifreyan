const read = <T,>(key: string): T | null => {
    const value = window.localStorage.getItem(key);

    if (value) {
        return JSON.parse(value) as T;
    }

    return null;
};

const write = <T,>(key: string, value: T) => {
    window.localStorage.setItem(key, JSON.stringify(value));
};

const remove = (key: string) => window.localStorage.removeItem(key);

const LocalStorage = { read, write, remove };

export default LocalStorage;
