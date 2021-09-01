/* eslint-disable prefer-const */
import {log} from "@graphprotocol/graph-ts/index";
import {PairCreated} from "../../generated/PancakeFactory/Factory";
import {PancakePair as PairTemplate} from '../../generated/templates'

export function handleNewPair(event: PairCreated): void {
  // create the tracked contract based on the template
  log.warning("[Pancakeswap] Creating factory tracking for pair: {}", [event.params.pair.toHexString()])
  PairTemplate.create(event.params.pair)
}
