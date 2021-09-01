/* eslint-disable prefer-const */
import {PairCreated} from '../../generated/DfynFactory/Factory'
import {log} from "@graphprotocol/graph-ts/index";
import {DfynPair as PairTemplate} from '../../generated/templates'

export function handleNewPair(event: PairCreated): void {
  // create the tracked contract based on the template
  log.warning("[Dfyn] Creating factory tracking for pair: {}", [event.params.pair.toHexString()])
  PairTemplate.create(event.params.pair)
}
