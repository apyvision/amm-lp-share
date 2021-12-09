/* eslint-disable prefer-const */
import {PairCreated} from '../../generated/KingdomsFactory/Factory'
import {log} from "@graphprotocol/graph-ts/index";
import {KingdomsPair as PairTemplate} from '../../generated/templates'

export function handleNewPair(event: PairCreated): void {

  // create the tracked contract based on the template

  log.warning("[Kingdoms] Creating factory tracking for pair: {}", [event.params.pair.toHexString()])
  PairTemplate.create(event.params.pair)
}
