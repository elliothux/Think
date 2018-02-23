## Functional JavaScript 之 Transducer

### 1. 什么是 Transducer

在函数式编程中，Transducer 是一种用于处理数据的高效、**可组合**且**不会产生的中间数据**的**函数**。

这样说可能会有些让人无法理解，让我们用通俗的代码解释一遍：

假设我们需要找出 100 以内能被 3 整除的所有奇数的平方和（注：为了更清晰的表示函数的参数与返回值，所有的示例代码均使用 TypeScript）：

```typescript
// 先定义一个辅助函数用于生成指定范围内的数组
function range(from: number = 0, to: number = 0, skip: number = 1): number[] {
    const result = [];
    for (let i = from; i < to; i += skip) {
        result.push(i);
    }
    return result;
}

const odd = (num: number): boolean => num % 2 !== 0;			// 判断是否奇数
const pow2 = (num: number): number => Math.pow(num, 2);			// 计算平方
const sum = (cum: number, num: number): number => cum + num;	// 求和
const data: number = range(0, 100).filter(odd).map(pow2).reduce(sum);	// 计算结果
console.log(data);	// 166650
```

上面是大多数时候的普通写法，不难发现，生成的数组被遍历了三次，并且因为我们只需要 reduce 计算的结果，中间 filter 与 map 函数都会产生无效的中间数据。上述做法在处理大量数据时毋庸置疑会由于多次遍历与大量中间数据的产生，造成严重的性能问题，这也是 JavaScript 中的函数式编程被人们所诟病的缺点之一。

因此，在处理大量数据时，人们普遍更倾向与使用命令式编程的方式：使用 for 循环，但这是必须的吗？当然不是！Clojure 社区在此前便提出了 Transducer 的概念：https://clojure.org/reference/transducers 。借助 Transducer 的思想，能够将 map、filter 等一系列处理数据的函数组合成不产生中间数据的高效的函数。

现在假设我们有一个函数 compose 可以组合其他函数并产生 Transducers 函数，我们可以这样实现上述算法：

```typescript
const trans = compose(filter(odd), map(pow2), reduce(sum));
const data: number = trans(range(0, 100));
```

上述 trans 方法只会遍历一遍数组，同时执行 filter、map 与 reduce 然后直接得出结果。

### 2. Make Functions Composable 

不难发现，compose 函数需要对每一个传入的函数进行组合并将其转换为 Transducer，这要求传入的每一个函数都是可组合的（Composable）。这需要每一个被组合的函数必须在参数与返回值上都具有通用性，但默认的 map 与 filter 并不满足这一要求，因此我们需要将它们重新封装一遍使其具有统一的参数和返回值模式。

不管是 map、filter 还是 forEach 都是对集合的遍历操作，所有的遍历操作都能用 reduce 实现，因此我们使用 reduce 封装出 map 与 filter 使其满足相同的参数与返回值模式。

```typescript
type Reducing<T, U> = (T, U) => T;
type F<T, U> = (T) => U;

const mapReducer = <T, U> (f: F<T, U>) => (result: U[], item: T) => {
    result.push(f(item));
    return result;
};

const filterReducer = <T> (predicate: F<T, boolean>) => (result: T[], item: T) => {
    if (predicate(item)) {
        result.push(item);
    }
    return result;
};

const data: number = range(0, 100)
    .reduce(filterReducer(odd), [])
    .reduce(mapReducer(pow2), [])
    .reduce(sum, 0);
console.log(data);		// 166650
```

现在，我们可以直接使用 mapReducer 与 filterReducer来替代 map 与 filter，它们返回的函数具有相同的参数与返回值模式，我们把它叫做 Reducing，在 TS 中可以表示为`type Reducing<T, U> = (T, U) => T;`。我们在此基础上继续做一层抽象，让 Reducing 可以从外部传入:

```typescript
const map = <T, U> (f: F<T, U>) => (reducing: Reducing<U[], U>) => (result: U[], item: U) => reducing(result, f(item));

const filter = <T> (predicate: F<T, boolean>) => (reducing: Reducing<T[], T>) => (result: T[], item: T) => predicate(item) ? reducing(result, item) : result;
```

现在 filter 和 map 都会返回一个高阶函数，这个高阶函数又可接收一个函数，包括 filter 和 map 返回的函数，这样它们便成了可组合（composable）了！现在，我们使用 reduce 把他们组合起来：

```typescript
const trans: Reducing<number> = filter(odd)(map(pow2)(sum));
const data: number = range(0, 100).reduce(trans, 0);
console.log(data);		// 166650
```

Well Done! 现在，通过上面一系列的函数，我们便可简单地将一系列函数组合成一个高效的函数，从而只需一次遍历便计算出结果！

### 3. Compose Function

上述写法如`filter(odd)(map(pow2)(sum))`虽然能够实现函数的组合，但是嵌套太深，括号太多，大大降低了代码的可读性，因此，我们实现一个 compose 函数，实现函数的组合；

```typescript
const compose = (...f: ((...any) => any)[]): Reducing<any> => {
    const [r, ...fs] = [...f].reverse();
    return [...fs].reduce((res, fn) => fn(res), r);
};
```

compose 函数接受一个 Reducing 函数及一系列的高阶函数：`(((a, b, …, n) → o), (o → p), …, (x → y), (y → z)) → ((a, b, …, n) → z)`，compose 函数将参数中第一个函数作为参数调用第二个函数，然后将返回的函数作为参数继续依次调用参数中的函数，最终得到一个新的 Reducing 函数，我们把它叫做 Transducer。

现在，用 compose 来组合一系列函数：

```typescript
const trans: Reducing<number> = compose(filter(odd), map(pow2), sum);
const data: number = range(0, 100).reduce(trans1);
console.log(data);		// 166650
```

Bingo! 正确得出结果！简单、清晰又优雅高效。

### 4. Benchmark

求出小于 1000000 的所有为 7 的倍数且个位数为偶数且该数的前一位不能被 4 整除的数字的之和：

```typescript
const even: (number) => boolean = (x) => !odd(x);
const trans: Reducing<number, number> = compose(
    filter(x => x % 7 === 0),
    filter(x => even(x % 10)),
    filter(x => (x - 1) % 4 !== 0),
    map(x => x * x),
    sum
);

console.time("With transducer");
const result1 = range(0, 1000000).reduce(trans, 0);
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
```

Benchmark 结果（Node v8.9.1，macOS 10.13.3，i7 2.5 GHz，16GB）：

* With transducer: 50.254ms
* Without transducer: 89.749ms

在这个例子中，使用 Transducer，通过简单的函数组合，提升了 44% 的性能！

### 5. Code

下面是实现 Transducer 的所有代码，只需要三个函数！

```typescript
type Reducing<T, U> = (T, U) => T;
type F<T, U> = (T) => U;

const map = <T, U> (f: F<T, U>) => (reducing: Reducing<U[], U>) => (result: U[], item: U) => reducing(result, f(item));

const filter = <T> (predicate: F<T, boolean>) => (reducing: Reducing<T[], T>) => (result: T[], item: T) => predicate(item) ? reducing(result, item) : result;

const compose = (...f: ((...any) => any)[]): Reducing<any, any> => {
    const [r, ...fs] = [...f].reverse();
    return [...fs].reduce((res, fn) => fn(res), r);
};
```

