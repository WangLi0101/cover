# 最短RTT

![封面图](../photo/rtt-race-cover.webp)

有很多ip地址，如何找出RTT最短的IP的地址，假设最大并发数为10
#### 解题思路
1. 将ip地址根据最大并发数分组
2. 对每个分组进行RTT计算
3. 出现最小RTT后，其余正在请求的组取消请求
4.  找出RTT最短的IP地址

```ts
function chunk(arr: string[], size: number) {
  const arrList = [];
  for (let i = 0; i < arr.length; i += size) {
    arrList.push(arr.slice(i, i + size));
  }
  return arrList;
}

function race(chunk: string[], rtt: number) {
  return new Promise<{ ip: string; rtt: number } | null>((resolve) => {
    const abortController = new AbortController();
    setTimeout(() => {
      abortController.abort();
      resolve(null);
    }, rtt);
    let start = Date.now();
    for (const ip of chunk) {
      fetch(ip, { signal: abortController.signal }).then(() => {
        const rtt = Date.now() - start;
        // 取消所有请求
        abortController.abort();
        resolve({ ip, rtt });
      });
    }
  });
}

async function findShortesRTT(ips: string[], paralleCount = 10) {
  const ipChunks = chunk(ips, paralleCount);
  let result = {
    ip: "",
    rtt: Infinity,
  };
  for (const chunk of ipChunks) {
    const temp = await race(chunk, result.rtt);
    if (temp) {
      result = temp;
    }
  }
  return result;
}

```
