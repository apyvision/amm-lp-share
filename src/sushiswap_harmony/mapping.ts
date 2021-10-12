/* eslint-disable prefer-const */
import {Transfer} from '../../generated/templates/SushiswapPair/Pair'
import {handleTransferGeneral} from "../util";

export function handleTransfer(event: Transfer): void {
  handleTransferGeneral(
    "sushiswap_v1_harmony",
    event,
    event.address,
    event.params.to,
    event.params.from,
    event.params.value);
}
