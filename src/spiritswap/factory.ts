/* eslint-disable prefer-const */
import { PairCreated } from '../../generated/SpiritswapFactory/Factory'
import { log } from "@graphprotocol/graph-ts/index";
import { SpiritswapPair as PairTemplate } from '../../generated/templates'

export function handleNewPair(event: PairCreated): void {
  // create the tracked contract based on the template
  log.warning("[Spiritswap] Creating factory tracking for pair: {}", [event.params.pair.toHexString()])
  PairTemplate.create(event.params.pair)
}
