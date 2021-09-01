# APY Vision LP Balances Subgraph

#### Introduction

This subgraph indexes AMM Shares and User LP Transactions.

AMM Shares store LP Positions and balances, historical information about a user's LP positions.

User LP Transactions the user has performed.

This subgraph will index all the Liquidity Pool balances of a user whether they are still in the
pool or not. This is useful information as we want to build a history of P+L for their liquidity
pool holdings.

Supports Balancer, Sushiswap and Uniswap -- more to be added later.

We also support metatransactions and also zaps (alot of the subgraphs don't support this since the attribution is incorrect).

This is one of the subgraphs used for [APY Vision](https://apy.vision)

#### Building

```
nvm use 10.16.3
```

To generate the mapping ts files, please do:

```
yarn codegen
```

To deploy (to use your own custom subgraph.yaml), please use:

```
 graph deploy \
    --debug \
    --node https://api.thegraph.com/deploy/ \
    --ipfs https://api.thegraph.com/ipfs/ \
    apyvision/ethereum-user-amm-shares
```

To deploy (to use our defined subgraph.yaml), please use:

Separate codegen and deploy commands exist for each chain:

```
"codegen-eth": "graph codegen subgraph-eth.yaml",
"codegen-matic": "graph codegen subgraph-matic.yaml",
"codegen-fantom": "graph codegen subgraph-fantom.yaml",
    
"deploy-eth": "graph deploy apyvision/ethereum-user-amm-shares subgraph-eth.yaml --ipfs https://api.thegraph.com/ipfs/ --node https://api.thegraph.com/deploy/",
"deploy-matic": "graph deploy apyvision/polygon-user-amm-shares subgraph-matic.yaml --ipfs https://api.thegraph.com/ipfs/ --node https://api.thegraph.com/deploy/",
"deploy-fantom": "graph deploy apyvision/fantom-user-amm-shares subgraph-fantom.yaml --ipfs https://api.thegraph.com/ipfs/ --node https://api.thegraph.com/deploy/",
```

#### Schema

You can find the latest schema in schema.graphql

#### Contributions

If you have other AMMs to add, please feel free to open a PR!


#### Changelog for the subgraph

- Aug 30, 2021
Upload V1 of [apyvision/ethereum-user-amm-shares](https://thegraph.com/legacy-explorer/subgraph/apyvision/ethereum-user-amm-shares)
