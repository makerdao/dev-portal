---
id: Basic
title: Maker
sidebar_label: Basic
---

## Presets

When instantiating a `Maker` object, you pass in the name of a configuration preset and an options hash.
Available presets are listed below, with the required options for each shown on the right.

- `'browser'`
  - Use the provider from the browser (e.g. MetaMask).
- `'http'`
  - Use Web3.providers.HttpProvider.
- `'test'`
  - Use a local testnet (e.g. Ganache) running at `http://127.0.0.1:2000`, and sign transactions using testnet-managed keys.

```js
const makerBrowser = await Maker.create('browser');

const makerHttp = await Maker.create('http', {
  privateKey: YOUR_PRIVATE_KEY,
  url: 'https://kovan.infura.io/v3/YOUR_INFURA_PROJECT_ID'
});

const makerTest = await Maker.create('test');
```

## Options

- `privateKey`
  - The private key used to sign transactions. If not provided, the first account available from the Ethereum provider will be used.
- `url`
  - The URL of the node to connect to. Only used when `provider.type` is `"HTTP"`.
- `provider.type`
  - `"HTTP"`: connect to an Ethereum node via any arbitrary url
  - `"BROWSER"`: try `window.web3` or `window.ethereum.enable()`
- `web3.statusTimerDelay`
  - Number in milliseconds that represents how often the blockchain connection and account authentication is checked. This allows the library to move out of an authenticated or connected state when it discovers it no longer has access to unlocked accounts, or can no longer connect to a node.
  - Default value: 5000 (5 seconds)
- `web3.transactionSettings`
  - Object containing transaction options to be applied to all transactions sent through the library.
  - Default value: `{ gasLimit: 4000000 }`
- `web3.confirmedBlockCount`
  - Number of blocks to wait after a transaction has been mined when calling `confirm`. See [transactions](https://makerdao.com/documentation/#transactions) for further explanation. Defaults to 5.
- `log`
  - Set this to `false` to reduce the verbosity of logging.
```js
const maker = await Maker.create('http', {
  privateKey: YOUR_PRIVATE_KEY, // '0xabc...'
  url: 'http://some-ethereum-rpc-node.net',
  provider: {
    type: 'HTTP',
    network: 'kovan'
  },
  web3: {
    statusTimerDelay: 2000,
    confirmedBlockCount: 8
    transactionSettings: {
      gasPrice: 12000000000
    }
  },
  log: false
});
```

## Instance methods

### authenticate

After creating your Maker instance, and before using any other methods, run this. It makes sure all services are initialized, connected to any remote API's, and properly authenticated.

```js
await maker.authenticate();
```


### service

**Params:** service (string)

- **Returns:** service object

The service function can be used to access services that were injected into your instance of `maker`. See the service documentation sections below.
```js
const priceService = maker.service('price');
```


## openCdp

**Params:** none

- **Returns:** promise (resolves to new CDP object once mined)

`maker.openCdp()` will create a new CDP, and then return the CDP object, which can be used to access other CDP functionality.
The promise will resolve when the transaction is mined.

```js
const newCdp = await maker.openCdp();
```

## getCdp

**Params:** CDP ID (integer)

- **Returns:** promise (resolves to CDP object)

`maker.getCdp(id)` creates a CDP object for an existing CDP. The CDP object can then be used to interact with your CDP.

```js
const cdp = await maker.getCdp(614);
```

