[fun 提供的 文档](https://www.notion.so/seacows/AMM-431e9fcf908d46c280fa23f34e160a95)

1. sell 的时候，价格已经查到了，但是查的是有 AI 的情况，没有 AI 的情况应该查什么 function，fun 没有给。两周前就问过这个问题，他给的文档并没有解决，没有给 function。导致的结果就是：NFT worlds 和 otherdeed 的池子价格都是有 AI group 的，没有 AI 的 collection 的池子会报错挂掉，整个 wallet 里的 NFT 都无法显示

> 买/卖价格查询我们和 sudo 一样都只提供了一组方法（区别是参数不一样） getBuyNFTQuote/getSellNFTQuote
> [we](https://github.com/yolominds/SeacowsAMM/blob/main/contracts/SeacowsPair.sol) > [sudo](https://github.com/sudoswap/lssvm/blob/main/src/LSSVMPair.sol)

2. sell，swap 的 Min Amount 不清楚，看聊天记录，tz 说 min amount 是读到的 New spot price，但是这样的话 swap failed。忠仁改成了 1，成功了，不知道为什么，可能这里是 NFT 数量的意思？我们只能猜。tz 说让看她的 sample。

> func name swapNFTsForToken
> [we](https://github.com/yolominds/SeacowsAMM/blob/main/contracts/SeacowsRouter.sol) > [sudo](https://github.com/sudoswap/lssvm/blob/main/src/LSSVMRouter.sol)

3. 如果按上面的方法，min amount 改成 1，swap success 之后，再次查询该池子的 NFT 价格会查不到，不知道为什么。

> minOutput 描述 @param minOutput The minimum acceptable total tokens received
> 我在群里问 tz 说是 所有的 nft 最小价格的 感觉像是求和

4. 第三方往池子里 sell NFT，应该越卖越便宜，选择一个 NFT 之后，报价也有会减少（和 sudoswap 一样），现在这里也有问题，不管选几个 NFT 价格都一样

> 我这个还是获取价格的问题，我这边可以先调试一下

5. 池子的 deposit token 如果数量不够，比如只够买一个 NFT，那么第三方 sell 的时候应该最多只能往池子里卖 1 个 NFT，但是现在也没有限制

> 可能需要一个 func 需要获取以一下最多能 sell 的个数 之前没讨论过这个问题

6. buy 的时候，需要 subgraph，要不然查询 collection 下的 pool 的 NFT list 需要至少 5 遍，速度非常慢。如果 subgraph 不解决，buy 没法用。sudoswap 是维护的自己的 api，我们没有，用 subgraph 也是临时，不知道效果怎么样。fun 写了代码给鹏洋，鹏洋还没部署，我不知道代码改了什么，效果怎么样，这都需要有人来跟踪，但是我做不了这个事情。

> TODO

7. buy 的 swap 会遇到和 sell 一样的问题，现在甚至还没有开始测试

> TODO

8. ai 价格是有问题的，现在 NFT Worlds 给的建议价是 10.599，这应该是半年前 NFT worlds 算法给出来的结果，现在 NFT Worlds 只有 0.5 了。当然测试网可以先上一个 AI 的数，不管对错，但是 AI 结果差别和真实这么大，恐怕用户也会有疑惑

> AI update

9. 如何判断 pool 是否使用了 AI

> ??
