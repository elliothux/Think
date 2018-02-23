
export const range = (from: number = 0, to: number = 0, skip: number = 1): number[] => {
    const result = [];
    let i = from;
    while((i >= from && i < to) || (i <= from && i > to)) {
        i += skip;
        result.push(i)
    }
    return result;
};

export const randoms = (take: number, min: number = 0, max: number = 100): number[] => {
    const result = [];
    const range = max - min;
    for (let i = 0; i < take; i++) {
        result.push(Math.ceil(Math.random() * range + min));
    }
    return result;
};

export const take = <T>(arr: T[], num: number): T[] => {
    return arr.slice(0, num);
};

export const odd = (num: number): boolean => num % 2 !== 0;

export const even: (number) => boolean = (x) => !odd(x);
