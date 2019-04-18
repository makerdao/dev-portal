---
id: Basic
title: System Status
sidebar_label: Basic
---

# Summary

To access system status information, retrieve the ETH CDP Service through Maker.service('cdp').

```js
    const ethCdp = maker.service('cdp');
```

## getSystemCollateralization

- **Params:** none

- **Returns:** promise (resolves to system collateralization ratio)

`getSystemCollateralization()` returns the collateralization ratio for the entire system, e.g. 2.75

```js
    const systemRatio = await ethCdp.getSystemCollateralization();
```
## getTargetPrice

- **Params:** none

- **Returns:** promise (resolves to target price)

`getTargetPrice()` returns the target price of Dai in USD, that is, the value to which Dai is soft-pegged, e.g. 1.0

```js
const targetPrice = await ethCdp.getTargetPrice();
```