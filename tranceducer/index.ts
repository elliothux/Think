
import { range, even } from '../utils';

const sum = (cum: number, num: number): number => cum + num;


// 实现 Transducer
type Reducing<T, U> = (T, U) => T;
type F<T, U> = (T) => U;

const map = <T, U> (f: F<T, U>) => (reducing: Reducing<U[], U>) => (result: U[], item: U) => reducing(result, f(item));

const filter = <T> (predicate: F<T, boolean>) => (reducing: Reducing<T[], T>) => (result: T[], item: T) => predicate(item) ? reducing(result, item) : result;

const compose = (...f: ((...any) => any)[]): Reducing<any, any> => {
    const [r, ...fs] = [...f].reverse();
    return [...fs].reduce((res, fn) => fn(res), r);
};



// 求出小于 1000000 的所有为 7 的倍数且个位数为偶数且该数的前一位不能被 4 整除的数字的之和：
const trans3: Reducing<number, number> = compose(
    filter(x => x % 7 === 0),
    filter(x => even(x % 10)),
    filter(x => (x - 1) % 4 !== 0),
    map(x => x * x),
    sum
);

console.time("With transducer");
const result1 = range(0, 1000000).reduce(trans3, 0);
console.log(result1);
console.timeEnd("With transducer");


console.time("Without transducer");
const result2 = range(0, 1000000)
    .filter(x => x % 7 === 0)
    .filter(x => even(x % 10))
    .filter(x => (x - 1) % 4 !== 0)
    .map(x => x * x)
    .reduce(sum, 0);
console.log(result2);
console.timeEnd("Without transducer");
