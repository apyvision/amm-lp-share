/* eslint-disable prefer-const */
import {log} from "@graphprotocol/graph-ts/index";
import {QuickswapPair as PairTemplate} from '../../generated/templates'
import {PairCreated} from "../../generated/QuickswapFactory/Factory";

export function handleNewPair(event: PairCreated): void {
  // create the tracked contract based on the template
  log.warning("[Quickswap] Creating factory tracking for pair: {}", [event.params.pair.toHexString()])
  PairTemplate.create(event.params.pair)
}
