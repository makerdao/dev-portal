---
id: Basic
title: ETH CDP Service
sidebar_label: Basic
---

# Summary 

Retrieve the ETH CDP Service through Maker.service('cdp').
The ETH CDP Service exposes the risk parameter information for the Ether CDP type (in single-collateral Dai, this is the only CDP Type).

```js
const ethCdp = maker.service('cdp');
```

## getLiquidationRatio

- **Params:** none

- **Returns:** promise (resolves to liquidation ratio)

`getLiquidationRatio()` returns a decimal representation of the liquidation ratio, e.g. 1.5

```js
const ratio = await ethCdp.getLiquidationRatio();
```

## getLiquidationPenalty

- **Params:** none

- **Returns:** promise (resolves to liquidation penalty)

`getLiquidationPenalty()` returns a decimal representation of the liquidation penalty, e.g. 0.13

```js
const penalty = await ethCdp.getLiquidationPenalty();
```

## getAnnualGovernanceFee

- **Params:** none

- **Returns:** promise (resolves to yearly governance fee)

`getAnnualGovernanceFee()` returns a decimal representation of the annual governance fee, e.g. 0.005.

```js
const fee = await ethCdp.getAnnualGovernanceFee();
```

**Note:** This is often referred to as the `Stability Fee`, even though technically the `Stability Fee` is the fee that is paid in Dai, and the `Governance Fee` is the fee that is paid in MKR. But since fees are only paid in MKR in Single-Collateral Dai, and only paid in Dai in Multi-Collateral Dai, the fee in Single-Collateral Dai is often referred to as the `Stability Fee` to be consistent with the term that will be used in Multi-Collateral Dai and to avoid unduly confusing regular users.

