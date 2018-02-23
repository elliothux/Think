
import { range } from '../utils';

// 假设我们需要找出 100 以内能被 3 整除的所有奇数的平方和
const odd = (num: number): boolean => num % 2 !== 0;
const pow2 = (num: number): number => Math.pow(num, 2);
const sum = (cum: number, num: number): number => cum + num;
// const data: number = range(0, 100).filter(odd).map(pow2).reduce(sum);
const mapReducer = (f) => (result, item) => {
    result.push(f(item));
}