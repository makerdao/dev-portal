---
id: dai
title: Developing
sidebar_label: Developing
---

# Installation

1. `git clone https://github.com/makerdao/makerdao-integration-poc`
2. `npm install`
## **Running the tests**

The test suite is configured to run on a Ganache test chain.
If you run the tests with `npm test`, it will start a test chain and deploy all the smart contracts for the Dai stablecoin system. This takes a few minutes.
To keep the test chain running and re-run the tests when changes are made to the code, use the command `npm run test:watch`.
If you want to deploy the contracts to a test chain without running the test suite, use `npm run test:net`.

## **Inspect contract state**

Start the dev server using `npm start`, then open [http://localhost:9000](http://localhost:9000/).

## **Commands**
- `npm start` - start the dev server
- `npm run build:backend` - create backend build in `dist` folder
- `npm run build:frontend` - create frontend build in `dist` folder
- `npm run lint` - run an ESLint check
- `npm run coverage` - run code coverage and generate report in the `coverage`folder
- `npm test` - run all tests
- `npm run test:watch` - run all tests in watch mode
- `npm run test:net` - launch a Ganache test chain and deploy MakerDAO's contracts on it
