/* eslint-disable prefer-const */
import { PairCreated } from '../../generated/SpookyswapFactory/Factory'
import { log } from "@graphprotocol/graph-ts/index";
import { SpookyswapPair as PairTemplate } from '../../generated/templates'

export function handleNewPair(event: PairCreated): void {
  // create the tracked contract based on the template
  log.warning("[Spookyswap] Creating factory tracking for pair: {}", [event.params.pair.toHexString()])
  PairTemplate.create(event.params.pair)
}
