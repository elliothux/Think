
import { range } from '../utils';

// 假设我们需要找出 100 以内能被 3 整除的所有奇数的平方和
const odd = (num: number): boolean => num % 2 !== 0;
const pow2 = (num: number): number => Math.pow(num, 2);
const sum = (cum: number, num: number): number => cum + num;
const data1 = range(0, 100).filter(odd).map(pow2).reduce(sum, 0);
console.log(data1);


const mapReducer = <T> (f: (T) => any) => (result: any, item: T) => {
    result.push(f(item));
    return result;
};

const filterReducer = <T> (predicate: (T) => boolean) => (result: any, item: T) => {
    if (predicate(item)) {
        result.push(item);
    }
    return result;
};

const data2 = range(0, 100)
    .reduce(filterReducer(odd), [])
    .reduce(mapReducer(pow2), [])
    .reduce(sum, 0);
console.log(data2);


type Reducing<T> = (any, T) => any;
const mapping = <T> (f: (T) => any) => (reducing: Reducing<T>) => (result: any, item: T) => reducing(result, f(item));
const filtering = <T> (predicate: (T) => boolean) => (reducing: Reducing<T>) => (result: any, item: T) => predicate(item) ? reducing(result, item) : result;
const trans = filtering(odd)(mapping(pow2)(sum));
const data3 = range(0, 100)
    .reduce(trans, 0);
console.log(data3);
