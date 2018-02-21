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

因此，在处理大量数据时，人们普遍更倾向与使用命令式编程的方式：使用 for 循环，但这是必须的吗？当然不是！Clojure 社区在此前便在 Clojure 语言中提出了 Transducer 的概念：https://clojure.org/reference/transducers。借助 Transducer 的思想，