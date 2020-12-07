/* eslint-disable prefer-const */
import {log} from "@graphprotocol/graph-ts/index";
import {PairCreated} from "../../generated/PancakeFactory2/Factory";
import {PancakePair as PairTemplate} from '../../generated/templates'

export function handleNewPair(event: PairCreated): void {
  // create the tracked contract based on the template
  log.warning("[PancakeswapV2] Creating factory tracking for pair: {}", [event.params.pair.toHexString()])
  PairTemplate.create(event.params.pair)
}
