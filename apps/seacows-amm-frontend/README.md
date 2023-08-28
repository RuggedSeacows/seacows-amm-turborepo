## contract address

```
Deployer ETH balance BigNumber { value: "269813059999252240" }
Deployer Address 0x8796Edd33C5D574885D0A2A214A4a840d4933A48
LinearCurve deployed to: 0x24D8aD786A6Ca7fDE15CEEEFc4dC4327399a4Cf8
ExponentialCurve deployed to: 0x0F3C8F9F01693308482ccEFE9b7A8c98DaE0230a
> SeacowsPairEnumerableERC20 deployed to: 0x3B2caEc9764303A7Ed661f2fB77bBB5767beaE3b
SeacowsPairMissingEnumerableERC20 deployed to: 0xdD65c9885B894DA47C3E707bdABD70bC4DC36Dd7
SeacowsPairEnumerableETH deployed to: 0xFde5f645EaaF9122807D9Be89B77A7A791a8A59A
SeacowsPairMissingEnumerableETH deployed to: 0xD924acF748beAB520e36Fc5859082bC72482C02f
SeacowsPairFactory deployed to: 0xd6Ddb728c10F80B09591FB87D87CB2EbE7dcC086
SeacowsRouter deployed to: 0xf2B19657A9930740b97D03AC40Ed5Ce2f2678475
SeacowsGroupFeed deployed to: 0x727aAceE3B846E69C7Cbc6586d8EC270FdF7ae20
> SeacowsCollectionRegistry  deployed to: 0xB7D8053D4D6668F1Af2FC4Bf4b0F0fF4f889ad29
TestSeacowsToken deployed to: 0xB7D8053D4D6668F1Af2FC4Bf4b0F0fF4f889ad29
TestSeacowsNFT deployed to: 0xd32974a53B1D838ad00bD3e68Ea9134AD179084c
```

### LinearCurve / ExponentialCurve

params

`spotPrice: Starting Price
delta: delta
numItems: selected nft number
feeMultiplier:Swap Fee 用户自己定义
protocolFeeMultiplier: 我们这个项目的fee， 我们定义的， 跟sudo一样， 0.5%`

### ceratePair

```
IERC721 _nft,   nft 地址
ICurve _bondingCurve, ？
address payable _assetRecipient,  0
SeacowsPair.PoolType _poolType, TRADE
uint128 _delta, delta
uint96 _fee, Fee 用户自己定义
uint128 _spotPrice, getbuyinfo 得到
uint256[] calldata _initialNFTIDs nft 的 tokenid

```

TODO

1. 通知
2. nft img 原图太大
3. view pool list

### pool list 字段

```
address：用户钱包address
chain: 网络
transactionhash: 交易hash
state: 0 失败， 1 完成， 空 pending
collectionName： nft分类名称
collectiotokenAddress： nftaddress
collectionImg： 分类图片
tokenName：币名
tokenAddress 币地址
tokenImg： 币图标地址
accountAsddress 用户池子address
```

查询：
1、根据网络查询整个 list
2、根据用户 address、chain 查询用户专属

### 交易历史

四种类型
建池子：Add （NFT- Token）Liquidity
撤池子：Withdraw （NFT- Token）Liquidity
swap：Swap #number（NFT/Token）for #number（NFT/Token）
approve：Approve（NFT/Token）

```
address：用户钱包address
chain: 网络
type
transactionhash
label 交易备注
status 交易状态
```

## mint

```
bsc: SeacowsBNB 0x1b4328D21eB2a7c885FDDC7FBDED80B1D8D0Dc70
rinkeby: SeacowsETH 0x6Cc5Ae6b01c933689fA5D3A9f5550915411eee33
goerli:SeacowsETH  0x0Ba1d01d1fFAe5876E41598866134d8E774B2EBd
```

wallet history

```
建池子：Add （NFT- Token）Liquidity
撤池子：Withdraw （NFT- Token）Liquidity
swap：Swap #number（NFT/Token）for #number（NFT/Token）
approve：Approve（NFT/Token）
```

## gerio

```
And contract verified on goerli.
Successfully verified contract MockNFTWorlds on Etherscan.
https://goerli.etherscan.io/address/0x85c88f2b64B0DEdbC7c69CD44Cc1c1cA1E235f72#code
Successfully verified contract MockOtherdeed on Etherscan.
https://goerli.etherscan.io/address/0xa44d5f2954Eb528E9cDa391C63EFfe56B38D6556#code
Successfully verified contract SeacowsBLOCWARSAPT on Etherscan.
https://goerli.etherscan.io/address/0x167Cf7364Fa1E13cd2CE7C0A85fe566f235118e2#code
Successfully verified contract SeacowsOasis on Etherscan.
https://goerli.etherscan.io/address/0x3a364eDbFdC74220fbA451034362ad31427e81e9#code


BSC-> goerli
Deployer Address 0xa18580F9D9363A1d37058bF758C339fE9545EB06
MockNFTWorlds deployed to: 0x85c88f2b64B0DEdbC7c69CD44Cc1c1cA1E235f72
MockOtherdeed  deployed to: 0xa44d5f2954Eb528E9cDa391C63EFfe56B38D6556
SeacowsBLOCWARSAPT deployed to: 0x167Cf7364Fa1E13cd2CE7C0A85fe566f235118e2
SeacowsOasis deployed to: 0x3a364eDbFdC74220fbA451034362ad31427e81e9
```

## question
