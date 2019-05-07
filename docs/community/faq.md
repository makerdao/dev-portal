---
id: faq
title: Frequently Asked Questions
sidebar_label: FAQ
---

# Introduction to Dai.js

Dai.js is a JavaScript library that makes it easy to build applications on top of MakerDAO's platform of smart contracts. You can use Maker's contracts to open Collateralized Debt Positions (CDPs), withdraw loans in Dai, trade tokens on OasisDEX, and more. The library features a pluggable, service-based architecture, which allows users maximal control when integrating the Maker functionality into existing infrastructures. It also includes convenient configuration presets for out-of-the-box usability and support for both front-end and back-end applications. 

Maker's entire suite of contracts will eventually be accessible through this library—including the DAO governance and the upcoming multi-collateral release—but functionality is limited in the current alpha version to the following areas:

- Opening and closing CDPs
- Locking and unlocking collateral
- Withdrawing and repaying Dai
- Automated token conversions
- Token contract functionality for WETH, PETH, MKR, Dai, and ETH
- Buying and selling MKR and Dai with built-in DEX integration

For example code that consumes the library, check out this [repository](https://github.com/makerdao/integration-examples).

# Getting Started

## Installation

Install the package with npm in your terminal:

`npm install @makerdao/dai`

Once it's installed, import the module into your project as shown on the right.

```js 
import Maker from '@makerdao/dai';
// or
const Maker = require('@makerdao/dai');
```
**UMD**
```js 
<script src="./dai.js" />

<script>
Maker.create('http',{
    privateKey: YOUR_PRIVATE_KEY,
    url: 'https://kovan.infura.io/v3/YOUR_INFURA_PROJECT_ID'
})
    .then(maker => { window.maker = maker })
    .then(() => maker.authenticate())
  .then(() => maker.openCdp())
  .then(cdp => console.log(cdp.id));
</script>
```
This library is also accessible as a [UMD module](https://github.com/umdjs/umd).

## **Quick Example**

Using the [Maker](https://makerdao.com/documentation/#maker) and [CDP](https://makerdao.com/documentation/#cdp) APIs, the code shown on the right opens a cdp, locks 0.25 ETH into it, draws out 50 Dai, and then logs information about the newly opened position to the console.

```js
import Maker from '@makerdao/dai';
    
async function openLockDraw() {
    const maker = await Maker.create("http", {
        privateKey: YOUR_PRIVATE_KEY,
        url: 'https://kovan.infura.io/v3/YOUR_INFURA_PROJECT_ID'
    });

  await maker.authenticate();
  const cdp = await maker.openCdp();

  await cdp.lockEth(0.25);
  await cdp.drawDai(50);

  const debt = await cdp.getDebtValue();
  console.log(debt.toString); // '50.00 DAI'
}

openLockDraw();
```
