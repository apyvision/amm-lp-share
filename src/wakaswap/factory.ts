/* eslint-disable prefer-const */
import { PairCreated } from '../../generated/WakaswapFactory/Factory'
import { log } from "@graphprotocol/graph-ts/index";
import { WakaswapPair as PairTemplate } from '../../generated/templates'

export function handleNewPair(event: PairCreated): void {
  // create the tracked contract based on the template
  log.warning("[Wakaswap] Creating factory tracking for pair: {}", [event.params.pair.toHexString()])
  PairTemplate.create(event.params.pair)
}
