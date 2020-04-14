### 代码结构

代码框架来自于：https://ice.work/

在本项目中，同业务相关的代码主要包括以下三部分：

1. src\layouts\BlankLayout\components\\**Header**\index.jsx
> 此部分代码包含了搜索框以及账户可提取的余额
2. src\pages\HomePage\components\\**Banner**\index.jsx
> 此部分代码用于竞拍
3. src\pages\HomePage\components\\**Exchange**\index.jsx
> 此部分代码用于设置交易费率

\
功能性代码位于：src\utils，包括：
- contracts.js
> 合约相关代码，包括合约地址，ABI信息，以及合约接口的生成
- global.js
> 一些工具类方法
- quarkchainRPC.js
> 一些RPC接口方法

### 执行流程

```
> npm i
> npm run build
> npm run start -- -p 8080
```
