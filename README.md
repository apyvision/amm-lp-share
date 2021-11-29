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
nvm use 10.16.3 // optional
```

To generate the mapping ts files, please do:

```
yarn codegen
```

To deploy (to use our defined subgraph.yaml), please use:

Separate codegen and deploy commands exist for each chain:

```
"codegen-<network>": "graph codegen subgraph-<>.yaml",
"build-<network>": "graph build subgraph-<>.yaml",
"deploy-<network": "graph deploy apyvision/<>-user-amm-shares subgraph-<>.yaml --ipfs https://api.thegraph.com/ipfs/ --node https://api.thegraph.com/deploy/",
```

#### Schema

You can find the latest schema in schema.graphql

#### Contributions

If you have other AMMs to add, please feel free to open a PR!


#### Subgraph URLs on the Graph
These are the subgraphs that we have deployed on the graph, please check package.json for the addresses

#### Changelog for the subgraph
Nov 29, 2021
- Update our graph libs to the latest (breaking changes) version
- Deployed Fantom with 0.0.5

Sept 27, 2021
- Don't use the balance for now (it's too slow)

Sept 24, 2021
- Added Arbitrum

Aug 30, 2021 
- Upload V1 of [apyvision/ethereum-user-amm-shares](https://thegraph.com/legacy-explorer/subgraph/apyvision/ethereum-user-amm-shares)


#### Note for Harmony
Harmony is not in the Graph infrastucture, so these are the steps required:

```
Rename subgraph-harmony.yaml to subgraph.yaml
yarn run create-harmony
yarn run deploy-harmony
```

To troubleshoot and see the indexing status, please use this query

```
https://graph.t.hmny.io/subgraphs/name/apyvision/harmony-user-amm-shares/graphql?query=%23%20Welcome%20to%20GraphiQL%0A%23%0A%23%20GraphiQL%20is%20an%20in-browser%20tool%20for%20writing%2C%20validating%2C%20and%0A%23%20testing%20GraphQL%20queries.%0A%23%0A%23%20Type%20queries%20into%20this%20side%20of%20the%20screen%2C%20and%20you%20will%20see%20intelligent%0A%23%20typeaheads%20aware%20of%20the%20current%20GraphQL%20type%20schema%20and%20live%20syntax%20and%0A%23%20validation%20errors%20highlighted%20within%20the%20text.%0A%23%0A%23%20GraphQL%20queries%20typically%20start%20with%20a%20%22%7B%22%20character.%20Lines%20that%20starts%0A%23%20with%20a%20%23%20are%20ignored.%0A%23%0A%23%20An%20example%20GraphQL%20query%20might%20look%20like%3A%0A%23%0A%23%20%20%20%20%20%7B%0A%23%20%20%20%20%20%20%20field(arg%3A%20%22value%22)%20%7B%0A%23%20%20%20%20%20%20%20%20%20subField%0A%23%20%20%20%20%20%20%20%7D%0A%23%20%20%20%20%20%7D%0A%23%0A%23%20Keyboard%20shortcuts%3A%0A%23%0A%23%20%20Prettify%20Query%3A%20%20Shift-Ctrl-P%20(or%20press%20the%20prettify%20button%20above)%0A%23%0A%23%20%20%20%20%20%20%20Run%20Query%3A%20%20Ctrl-Enter%20(or%20press%20the%20play%20button%20above)%0A%23%0A%23%20%20%20Auto%20Complete%3A%20%20Ctrl-Space%20(or%20just%20start%20typing)%0A%23%0A%0Aquery%20%7B%0A%20%20_meta%20%7B%0A%20%20%20%20block%20%7B%0A%20%20%20%20%20%20number%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D
```

```
query {
  _meta {
    block {
      number
    }
  }
}
```
