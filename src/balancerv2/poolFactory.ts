import { Address } from '@graphprotocol/graph-ts';
import { WeightedPool as WeightedPoolTemplate } from '../../generated/templates'
import { StablePool as StablePoolTemplate } from '../../generated/templates'

// datasource
import { PoolCreated as WeightedPoolCreated } from "../../generated/WeightedPoolFactory/WeightedPoolFactory";
import { PoolCreated as StablePoolCreated } from "../../generated/StablePoolFactory/StablePoolFactory";

export function handleNewWeightedPool(event: WeightedPoolCreated): void {
  let poolAddress: Address = event.params.pool;
  WeightedPoolTemplate.create(poolAddress);
}

export function handleNewStablePool(event: StablePoolCreated): void {
  let poolAddress: Address = event.params.pool;
  StablePoolTemplate.create(poolAddress);
}
