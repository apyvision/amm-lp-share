/* eslint-disable prefer-const */
import { log } from "@graphprotocol/graph-ts/index";
import { Deployed } from "../../generated/OneinchV2Factory/Factory";
import { OneInchPair as PairTemplate } from '../../generated/templates'

export function handleNewPair(event: Deployed): void {
  // create the tracked contract based on the template
  log.warning("[Oneinch] Creating factory tracking for pair: {}", [event.params.mooniswap.toHexString()])
  PairTemplate.create(event.params.mooniswap)
}
