## Intro to Transducer

### 1. 什么是 Transducer

在函数式编程中，Transducer 是一种用于处理数据的高效、**可组合**且**不会产生的中间数据**的**纯函数**。

这样说可能会有些让人无法理解，让我们用通俗的代码解释一遍：

假设我们需要找出 100 以内能被 3 整除的所有奇数的平方和：

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

上面是大多数时候的普通写法，不难发现，生成的数组被遍历了三次，并且因为我们只需要 reduce 计算的结果，中间 filter 与 map 函数都会产生无效的中间数据。毋庸置疑，上述做法在处理大量数据时会由于多次遍历与大量中间数据的产生，造成严重的性能问题，这也是 JavaScript 中的函数式编程被人们所诟病的缺点之一。

因此，在处理大量数据时，人们普遍更倾向与使用命令式编程的方式：使用 for 循环，但这是必须的吗？当然不是！Clojure 社区在此前便提出了 Transducer 的概念：https://clojure.org/reference/transducers。借助 Transducer 的思想，能够将 map、filter 等一系列处理数据的函数组合成不产生中间数据的高效的函数用来处理数据。

现在假设我们有一个函数 compose 可以组合其他函数并产生 Transducer 函数，我们可以这样实现上述算法：

```typescript
const trans = compose(filter(odd), map(pow2), reduce(sum));
const data: number = trans(range(0, 100));
```

上述 trans 方法只会遍历一遍数组，同时执行 filter、map 与 reduce 然后直接得出结果。

### 2. Composable Functions 

不难发现，compose 函数需要对每一个传入的函数进行组合并将其转换为 Transducer，这要求传入的每一个函数都是可组合的（Composable）。也就是说每一个被组合的函数在必须在参数与返回值上都具有通用性，但默认的 map、filter 与 reduce 并不满足这一要求，因此我们需要将它们重新封装一遍使其具有统一的参数和返回值模式。

不管是 map、filter 还是 forEach 都是对集合的遍历操作，所有的遍历操作都能用 reduce 实现，因此我们使用 reduce 封装出 map 与 filter 使其满足与 reduce 相同的参数与返回值模式。

```typescript
const mapReducer = (f) => (result, item) => {
    result.push(f(item));
    return result;
}
const filterReducer = (predicate) => (result, item) => {
    if (predicate(item)) {
        result.push(item);
    }
    return result;
}
```

