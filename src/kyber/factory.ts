/* eslint-disable prefer-const */
import { log } from "@graphprotocol/graph-ts/index";
import { PoolCreated } from "../../generated/DmmFactory/DmmFactory";
import { KyberPool as PoolTemplate } from '../../generated/templates'

export function handleNewPair(event: PoolCreated): void {
  // create the tracked contract based on the template
  log.warning("[Kyber] Creating factory tracking for pair: {}", [event.params.pool.toHexString()])
  PoolTemplate.create(event.params.pool)
}
