---
id: Basic
title: Price Service
sidebar_label: Basic
---

# Summary

Retrieve the PriceService through `Maker.service('price')`.
The PriceService exposes the collateral and governance tokens' price information that is reported by the oracles in the Maker system.

```js
const price = maker.service('price');
```

## getEthPrice

Get the current USD price of ETH, as a `USD_ETH` [price unit](https://makerdao.com/documentation/#units).

```js
const ethPrice = await price.getEthPrice();
```

## getMkrPrice

Get the current USD price of the governance token MKR, as a `USD_MKR` [price unit](https://makerdao.com/documentation/#units).

```js
const mkrPrice = await price.getMkrPrice();
```

## getPethPrice

Get the current USD price of PETH (pooled ethereum), as a `USD_PETH` [price unit](https://makerdao.com/documentation/#units).

```js
await pethPrice = price.getPethPrice();
```

## setEthPrice

Set the current USD price of ETH.
This requires the necessary permissions and will only be useful in a testing environment.

```js
await price.setEthPrice(475);
```

## setMkrPrice

Set the current USD price of the governance token MKR.
This requires the necessary permissions and will only be useful in a testing environment.

```js
await price.setMkrPrice(950.00);
```

## getWethToPethRatio

Returns the current W-ETH to PETH ratio.

```js
await price.getWethToPethRatio();
```