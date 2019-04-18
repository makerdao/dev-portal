---
id: Basic
title: Transactions
sidebar_label: Basic
---
# Summary: Transaction Object Lifecycle Hooks

The `transactionManager` service is used to access and monitor `TransactionObjects` which can be used to track a transaction's status as it propagates through the blockchain. `TransactionObjects` have methods which trigger callbacks in the event of a transaction's status being `pending`, `mined`, `confirmed` or `error`.

```js
const txMgr = maker.service('transactionManager');
// instance of transactionManager
const open = maker.service('cdp').openCdp();
// open is a transactionObject when promise resolves
```

## Listen

Accessing these status callbacks is done through the `listen` function from the `transactionManager` service. The listen function takes a promise and a callback object with the transaction status as a key.

One caveat is that the `confirmed` event will not fire unless the `transactionManager` confirms the promise. This `confirm()` function waits on a number of blocks after the transaction has been mined, of which the default is 5, to resolve. To change this, the `confirmedBlockCount` attribute in the [options](https://makerdao.com/documentation/#options) object can be modified.

```js
txMgr.listen(open, {
  pending: tx => {
    // do something when tx is pending
  },
  mined: tx => {
    // do something when tx is mined
  },
  confirmed: tx => {
    // do something when tx is confirmed       
  },
  error: tx => {
    // do someting when tx fails
  }
});

await txMgr.confirm(open); // confirmed will fire after 5 blocks if default
```


## Transaction Metadata

There are functions such as `lockEth()` which are composed of several internal transactions. These can be more accurately tracked by accessing the `tx.metadata`in the callback which contains both the `contract` and the `method` the internal transactions were created from.


## Transaction Object Methods

A `TransactionObject` also has a few methods to provide further details on the transaction:

- `hash` : transaction hash
- `fees()` : amount of ether spent on gas
- `timeStamp()` : timestamp of when transaction was mined
- `timeStampSubmitted()` : timestamp of when transaction was submitted to the network

```js
const lock = cdp.lockEth(1);
txMgr.listen(lock, {
  pending: tx => {
    const {contract, method} = tx.metadata;
    if(contract === 'WETH' && method === 'deposit') {
      console.log(tx.hash); // print hash for WETH.deposit
    }
  }
})

```
